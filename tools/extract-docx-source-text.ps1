param(
    [Parameter(Mandatory = $true)]
    [string]$InputDirectory,

    [Parameter(Mandatory = $true)]
    [string]$OutputDirectory,

    [Parameter(Mandatory = $true)]
    [ValidatePattern('^RE[1-5]$')]
    [string]$ModuleId
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$inputRoot = (Resolve-Path $InputDirectory).Path
$outputRoot = [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $OutputDirectory))
$extractedRoot = Join-Path $outputRoot 'extracted'
[System.IO.Directory]::CreateDirectory($extractedRoot) | Out-Null
$utf8 = New-Object System.Text.UTF8Encoding($false)

function Get-RepoRelativePath([string]$Path) {
    $repoUri = New-Object System.Uri(($repoRoot.TrimEnd('\') + '\'))
    $pathUri = New-Object System.Uri([System.IO.Path]::GetFullPath($Path))
    return [System.Uri]::UnescapeDataString($repoUri.MakeRelativeUri($pathUri).ToString())
}

function Get-Sha256([string]$Path) {
    return (Get-FileHash -LiteralPath $Path -Algorithm SHA256).Hash.ToLowerInvariant()
}

function Get-NodeText($Node, $NamespaceManager) {
    $parts = @($Node.SelectNodes('.//w:t | .//w:delText', $NamespaceManager) | ForEach-Object { $_.InnerText })
    return (($parts -join '') -replace '\r?\n', ' ').Trim()
}

function Get-CellParagraphs($Cell, $NamespaceManager) {
    $paragraphs = New-Object System.Collections.Generic.List[string]
    foreach ($paragraph in $Cell.SelectNodes('./w:p', $NamespaceManager)) {
        $text = Get-NodeText $paragraph $NamespaceManager
        if ($text) {
            $paragraphs.Add($text)
        }
    }
    return @($paragraphs)
}

function Get-TableRows($Table, $NamespaceManager) {
    $rows = New-Object System.Collections.Generic.List[object]
    foreach ($row in $Table.SelectNodes('./w:tr', $NamespaceManager)) {
        $cells = New-Object System.Collections.Generic.List[object]
        foreach ($cell in $row.SelectNodes('./w:tc', $NamespaceManager)) {
            $paragraphs = @(Get-CellParagraphs $cell $NamespaceManager)
            $cells.Add([ordered]@{
                paragraphs = $paragraphs
                text = ($paragraphs -join "`n`n")
            })
        }
        $rows.Add($cells.ToArray())
    }
    return $rows.ToArray()
}

function Get-SlideNumbers([string]$Label) {
    return @([regex]::Matches($Label, '\d+') | ForEach-Object { [int]$_.Value })
}

function Get-TextSha256([string]$Text) {
    $sha = [System.Security.Cryptography.SHA256]::Create()
    try {
        $bytes = $utf8.GetBytes($Text)
        return ([System.BitConverter]::ToString($sha.ComputeHash($bytes))).Replace('-', '').ToLowerInvariant()
    }
    finally {
        $sha.Dispose()
    }
}

$documents = New-Object System.Collections.Generic.List[object]
$issues = New-Object System.Collections.Generic.List[string]
$warnings = New-Object System.Collections.Generic.List[string]

$docxFiles = @(Get-ChildItem -LiteralPath $inputRoot -File -Filter '*.docx' | Sort-Object Name)
if ($docxFiles.Count -eq 0) {
    throw "Keine DOCX-Dateien unter $inputRoot gefunden."
}

foreach ($docx in $docxFiles) {
    $zip = [System.IO.Compression.ZipFile]::OpenRead($docx.FullName)
    try {
        $documentEntry = $zip.GetEntry('word/document.xml')
        if (-not $documentEntry) {
            $issues.Add("$($docx.Name): word/document.xml fehlt.")
            continue
        }

        $stream = $documentEntry.Open()
        try {
            $xml = New-Object System.Xml.XmlDocument
            $xml.PreserveWhitespace = $true
            $xml.Load($stream)
        }
        finally {
            $stream.Dispose()
        }

        $ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
        $ns.AddNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')
        $body = $xml.SelectSingleNode('//w:body', $ns)
        $tables = @($xml.SelectNodes('//w:tbl', $ns))
        $paragraphCount = @($xml.SelectNodes('//w:p', $ns)).Count
        $metadata = [ordered]@{}
        $sections = New-Object System.Collections.Generic.List[object]
        $pendingTitle = ''
        $pendingLabel = ''
        $sectionIndex = 0

        foreach ($child in $body.ChildNodes) {
            if ($child.LocalName -eq 'p') {
                $paragraphText = Get-NodeText $child $ns
                $headingMatch = [regex]::Match($paragraphText, '^Folie\s+([0-9/]+)\s*:\s*(.*)$', 'IgnoreCase')
                if ($headingMatch.Success) {
                    $pendingLabel = $headingMatch.Groups[1].Value
                    $pendingTitle = $headingMatch.Groups[2].Value.Trim()
                }
                continue
            }

            if ($child.LocalName -ne 'tbl') {
                continue
            }

            $rows = @(Get-TableRows $child $ns)
            $rowMap = [ordered]@{}
            foreach ($row in $rows) {
                if ($row.Count -lt 2) {
                    continue
                }
                $key = [string]$row[0].text
                $value = [string]$row[1].text
                if ($key) {
                    $rowMap[$key.Trim()] = $value.Trim()
                }
            }

            if ($rowMap.Contains('Modul Nummer')) {
                foreach ($key in $rowMap.Keys) {
                    $metadata[$key] = $rowMap[$key]
                }
                continue
            }

            if (-not $rowMap.Contains('Foliennummer')) {
                continue
            }

            $localLabel = [string]$rowMap['Foliennummer']
            $tableNumbers = @(Get-SlideNumbers $localLabel)
            $headingNumbers = @(Get-SlideNumbers $pendingLabel)
            if ($pendingLabel -and $headingNumbers.Count -gt $tableNumbers.Count) {
                $localLabel = $pendingLabel
            }
            elseif (-not $localLabel) {
                $localLabel = $pendingLabel
            }
            $title = [string]$rowMap['Folientitel']
            if (-not $title) {
                $title = $pendingTitle
            }

            $spokenParagraphs = New-Object System.Collections.Generic.List[string]
            $textHeaderSeen = $false
            foreach ($row in $rows) {
                if ($row.Count -eq 1 -and ([string]$row[0].text) -match '^Text\s*Folie$') {
                    $textHeaderSeen = $true
                    continue
                }
                if ($textHeaderSeen -and $row.Count -eq 1) {
                    foreach ($paragraph in @($row[0].paragraphs)) {
                        if ($paragraph) {
                            $spokenParagraphs.Add([string]$paragraph)
                        }
                    }
                }
            }

            $spokenText = (@($spokenParagraphs) -join "`n`n").Trim()
            $sectionIndex += 1
            $sectionId = 'section_{0:d3}' -f $sectionIndex
            $numbers = @(Get-SlideNumbers $localLabel)
            $status = if ($numbers.Count -gt 0 -and $spokenText) { 'ready' } else { 'needs_review' }
            if ($status -ne 'ready') {
                $warnings.Add("$($docx.Name): Abschnitt $sectionId ist unvollstaendig.")
            }

            $sections.Add([ordered]@{
                section_id = $sectionId
                source_local_slide_label = $localLabel
                source_local_slide_numbers = $numbers
                title = $title
                spoken_text = $spokenText
                spoken_text_sha256 = Get-TextSha256 $spokenText
                paragraph_count = $spokenParagraphs.Count
                extraction_status = $status
            })

            $pendingLabel = ''
            $pendingTitle = ''
        }

        $markdownPath = Join-Path $extractedRoot ($docx.BaseName + '.md')
        $markdown = New-Object System.Text.StringBuilder
        [void]$markdown.AppendLine('# Extracted Source Text')
        [void]$markdown.AppendLine()
        [void]$markdown.AppendLine("- module_id: $ModuleId")
        [void]$markdown.AppendLine("- source_docx: $(Get-RepoRelativePath $docx.FullName)")
        [void]$markdown.AppendLine("- source_sha256: $(Get-Sha256 $docx.FullName)")
        [void]$markdown.AppendLine('- extraction_method: deterministic_ooxml_table_parser')
        foreach ($key in $metadata.Keys) {
            $safeKey = ($key -replace '\s+', '_').ToLowerInvariant()
            [void]$markdown.AppendLine("- ${safeKey}: $($metadata[$key])")
        }
        [void]$markdown.AppendLine()

        foreach ($section in $sections) {
            [void]$markdown.AppendLine("## Folie $($section.source_local_slide_label): $($section.title)")
            [void]$markdown.AppendLine()
            [void]$markdown.AppendLine("- section_id: $($section.section_id)")
            [void]$markdown.AppendLine("- source_local_slide_numbers: $(@($section.source_local_slide_numbers) -join ', ')")
            [void]$markdown.AppendLine("- spoken_text_sha256: $($section.spoken_text_sha256)")
            [void]$markdown.AppendLine()
            [void]$markdown.AppendLine('### Gesprochener Text')
            [void]$markdown.AppendLine()
            [void]$markdown.AppendLine($section.spoken_text)
            [void]$markdown.AppendLine()
        }

        [System.IO.File]::WriteAllText($markdownPath, $markdown.ToString(), $utf8)
        $sectionArray = $sections.ToArray()
        $notReadyCount = @($sectionArray | Where-Object { $_.extraction_status -ne 'ready' }).Count
        $documents.Add([ordered]@{
            source_docx = Get-RepoRelativePath $docx.FullName
            source_sha256 = Get-Sha256 $docx.FullName
            extracted_markdown = Get-RepoRelativePath $markdownPath
            extracted_sha256 = Get-Sha256 $markdownPath
            extraction_status = if ($notReadyCount -eq 0) { 'ready' } else { 'needs_review' }
            paragraph_count = $paragraphCount
            table_count = $tables.Count
            metadata = $metadata
            sections = $sectionArray
            notes = @()
        })
    }
    finally {
        $zip.Dispose()
    }
}

$index = [ordered]@{
    schema_version = 'basisReDocxExtraction/v1'
    module_id = $ModuleId
    input_root = Get-RepoRelativePath $inputRoot
    output_root = Get-RepoRelativePath $outputRoot
    extraction_method = 'deterministic_ooxml_table_parser'
    documents = $documents.ToArray()
    qa = [ordered]@{
        issues = $issues.ToArray()
        warnings = $warnings.ToArray()
        open_questions = @()
    }
}

$indexPath = Join-Path $outputRoot 'extraction-index.json'
$json = $index | ConvertTo-Json -Depth 12
[System.IO.File]::WriteAllText($indexPath, ($json + "`n"), $utf8)
Write-Output "Extracted $($documents.Count) DOCX files to $outputRoot"
Write-Output "Index: $indexPath"
Write-Output "Issues: $($issues.Count); Warnings: $($warnings.Count)"

param(
    [Parameter(Mandatory = $true)]
    [string]$ModuleId,

    [Parameter(Mandatory = $true)]
    [string]$SvgDirectory,

    [Parameter(Mandatory = $true)]
    [string]$TextMap,

    [Parameter(Mandatory = $true)]
    [string]$Output
)

$ErrorActionPreference = "Stop"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$svgRoot = (Resolve-Path $SvgDirectory).Path
$textMapPath = (Resolve-Path $TextMap).Path

function Convert-ToRepoPath([string]$PathValue) {
    $absolute = [IO.Path]::GetFullPath($PathValue)
    $rootUri = [Uri]($repoRoot.TrimEnd("\") + "\")
    $pathUri = [Uri]$absolute
    return [Uri]::UnescapeDataString($rootUri.MakeRelativeUri($pathUri).ToString())
}

function Get-Sha256([string]$PathValue) {
    return (Get-FileHash -LiteralPath $PathValue -Algorithm SHA256).Hash.ToLowerInvariant()
}

function Normalize-Text([string]$Value) {
    if ([string]::IsNullOrWhiteSpace($Value)) { return "" }
    return ([regex]::Replace($Value, "\s+", " ")).Trim()
}

function Get-NodeCount([xml]$Xml, [string]$LocalName) {
    return @($Xml.SelectNodes("//*[local-name()='$LocalName']")).Count
}

function Get-NumericAttribute($Node, [string]$Name) {
    if (-not $Node.Attributes[$Name]) { return $null }
    $raw = $Node.Attributes[$Name].Value -replace "px$", ""
    $number = 0.0
    if ([double]::TryParse($raw, [Globalization.NumberStyles]::Float, [Globalization.CultureInfo]::InvariantCulture, [ref]$number)) {
        return $number
    }
    return $null
}

function Get-VisibleText([xml]$Xml) {
    $items = [Collections.Generic.List[string]]::new()
    foreach ($node in @($Xml.SelectNodes("//*[local-name()='text']"))) {
        $value = Normalize-Text $node.InnerText
        if ($value) { $items.Add($value) }
    }
    return @($items)
}

function Get-References([xml]$Xml) {
    $result = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    foreach ($node in @($Xml.SelectNodes("//*[@href or @*[local-name()='href']]"))) {
        foreach ($attribute in @($node.Attributes)) {
            if ($attribute.LocalName -eq "href" -and $attribute.Value) {
                [void]$result.Add($attribute.Value)
            }
        }
    }
    return @($result | Sort-Object)
}

function Get-SpeakerAssetIds([xml]$Xml) {
    $ids = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    foreach ($image in @($Xml.SelectNodes("//*[local-name()='defs']//*[local-name()='image']"))) {
        $width = Get-NumericAttribute $image "width"
        $height = Get-NumericAttribute $image "height"
        if ($width -eq 64 -and $height -eq 64 -and $image.Attributes["id"]) {
            [void]$ids.Add($image.Attributes["id"].Value)
        }
    }
    return @($ids)
}

function Get-SpeakerUseCount([xml]$Xml, [string[]]$AssetIds) {
    if ($AssetIds.Count -eq 0) { return 0 }
    $count = 0
    foreach ($use in @($Xml.SelectNodes("//*[local-name()='use']"))) {
        $href = ""
        foreach ($attribute in @($use.Attributes)) {
            if ($attribute.LocalName -eq "href") { $href = $attribute.Value }
        }
        if ($href -and $AssetIds -contains $href.TrimStart("#")) {
            $ancestor = $use.ParentNode
            $bottomRightPlacement = $false
            while ($ancestor -and $ancestor.NodeType -eq [Xml.XmlNodeType]::Element) {
                if ($ancestor.Attributes["transform"]) {
                    $numbers = [regex]::Matches($ancestor.Attributes["transform"].Value, "-?\d+(?:\.\d+)?(?:e[+-]?\d+)?", "IgnoreCase") |
                        ForEach-Object { [double]::Parse($_.Value, [Globalization.CultureInfo]::InvariantCulture) }
                    if ($numbers.Count -ge 6 -and $numbers[$numbers.Count - 2] -ge 900 -and $numbers[$numbers.Count - 1] -ge 420) {
                        $bottomRightPlacement = $true
                    }
                }
                $ancestor = $ancestor.ParentNode
            }
            if ($bottomRightPlacement) { $count += 1 }
        }
    }
    return $count
}

function Get-SetDifference([string[]]$Left, [string[]]$Right) {
    $rightSet = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    foreach ($value in $Right) { [void]$rightSet.Add($value) }
    return @($Left | Where-Object { -not $rightSet.Contains($_) } | Select-Object -Unique)
}

$mapping = Get-Content -LiteralPath $textMapPath -Raw -Encoding UTF8 | ConvertFrom-Json
if ($mapping.module_id -ne $ModuleId) {
    throw "ModuleId stimmt nicht mit dem Text-Mapping ueberein."
}
if ($mapping.mapping_status -ne "mapped") {
    throw "Text-Mapping ist nicht freigegeben: $($mapping.mapping_status)"
}

$slides = [Collections.Generic.List[object]]::new()
$previousVisibleText = @()
$previousSlideNumber = $null
$previousSharedGroup = $null
$moduleWarnings = [Collections.Generic.List[string]]::new()

foreach ($entry in @($mapping.mappings | Sort-Object source_slide_number)) {
    $svgPath = Join-Path $repoRoot ($entry.source_svg -replace "/", "\")
    if (-not (Test-Path -LiteralPath $svgPath)) { throw "Quell-SVG fehlt: $($entry.source_svg)" }

    [xml]$xml = Get-Content -LiteralPath $svgPath -Raw -Encoding UTF8
    $root = $xml.DocumentElement
    $width = if ($root.Attributes["width"]) { $root.Attributes["width"].Value } else { $null }
    $height = if ($root.Attributes["height"]) { $root.Attributes["height"].Value } else { $null }
    $viewBoxSource = "source"
    if ($root.Attributes["viewBox"]) {
        $viewBox = $root.Attributes["viewBox"].Value
    } elseif ($width -and $height) {
        $viewBox = "0 0 $($width -replace 'px$', '') $($height -replace 'px$', '')"
        $viewBoxSource = "derived_from_dimensions"
    } else {
        $viewBox = "missing"
        $viewBoxSource = "missing"
    }

    $visibleText = @(Get-VisibleText $xml)
    $references = @(Get-References $xml)
    $speakerAssetIds = @(Get-SpeakerAssetIds $xml)
    $speakerControlCount = Get-SpeakerUseCount $xml $speakerAssetIds
    $hasMojibake = [bool](($visibleText -join " ") -match "(?:Ã|Â|â€|ï¿½)")
    $externalReferences = @($references | Where-Object { $_ -notmatch "^(?:#|data:)" })
    $technicalStatus = if ($viewBoxSource -eq "missing") { "blocked" } elseif ($viewBoxSource -ne "source" -or $hasMojibake -or $speakerControlCount -gt 0) { "warning" } else { "ready" }

    $added = if ($null -eq $previousSlideNumber) { @($visibleText) } else { @(Get-SetDifference $visibleText $previousVisibleText) }
    $removed = if ($null -eq $previousSlideNumber) { @() } else { @(Get-SetDifference $previousVisibleText $visibleText) }
    $sameSharedSequence = $entry.shared_text_group -and $entry.shared_text_group -eq $previousSharedGroup
    $interpretation = if ($null -eq $previousSlideNumber) {
        "Erster Quellzustand des Moduls."
    } elseif ($sameSharedSequence) {
        "Direkter Aufbauzustand derselben Sprechertextpassage."
    } elseif ($added.Count -le 2 -and $removed.Count -le 2) {
        "Visuell eng verwandter Folgezustand; Sequenzzuordnung im Preflight pruefen."
    } else {
        "Neuer Inhaltszustand mit eigenem Sprechertextabschnitt."
    }

    $notes = [Collections.Generic.List[string]]::new()
    if ($viewBoxSource -eq "derived_from_dimensions") { $notes.Add("Ziel-viewBox deterministisch aus width und height ableiten.") }
    if ($speakerControlCount -gt 0) { $notes.Add("PowerPoint-Lautsprecher unten rechts vollstaendig entfernen.") }
    if ($hasMojibake) { $notes.Add("Sichtbaren deutschen Text vor Uebernahme auf fehlerhafte UTF-8-Dekodierung pruefen und reparieren.") }
    if ($entry.shared_text_group) { $notes.Add("Mit den benachbarten SVG-Zustaenden der Gruppe $($entry.shared_text_group) als gemeinsame animierte Szene planen.") }

    $qaWarnings = [Collections.Generic.List[string]]::new()
    if ($viewBoxSource -eq "derived_from_dimensions") { $qaWarnings.Add("Quell-SVG besitzt kein viewBox; 0 0 $width $height wird abgeleitet.") }
    if ($speakerControlCount -gt 0) { $qaWarnings.Add("PowerPoint-Lautsprecher-Bedienelement erkannt; im Ziel nicht erlaubt.") }
    if ($hasMojibake) { $qaWarnings.Add("Moegliche Mojibake-Zeichen im sichtbaren Quelltext erkannt.") }
    if ($externalReferences.Count -gt 0) { $qaWarnings.Add("Externe Referenzen muessen fuer das Ziel eingebettet oder entfernt werden.") }

    $summary = if ($entry.source_text_title) { $entry.source_text_title } elseif ($visibleText.Count) { $visibleText[0] } else { "Quell-SVG $($entry.source_slide_number)" }
    $slides.Add([ordered]@{
        source_slide_key = $entry.source_slide_key
        source_slide_number = [int]$entry.source_slide_number
        source_svg = $entry.source_svg
        sha256 = Get-Sha256 $svgPath
        view_box = $viewBox
        width = $width
        height = $height
        spoken_text_source = $entry.extracted_markdown
        text_mapping_ref = "$($entry.source_docx)#$($entry.source_text_section_id)"
        spoken_text = $entry.spoken_text
        technical_status = $technicalStatus
        visible_content_summary = $summary
        visible_text = @($visibleText)
        features = [ordered]@{
            view_box_source = $viewBoxSource
            group_count = Get-NodeCount $xml "g"
            id_count = @($xml.SelectNodes("//*[@id]")).Count
            text_count = Get-NodeCount $xml "text"
            path_count = Get-NodeCount $xml "path"
            image_count = Get-NodeCount $xml "image"
            use_count = Get-NodeCount $xml "use"
            defs_count = Get-NodeCount $xml "defs"
            clip_path_count = Get-NodeCount $xml "clipPath"
            mask_count = Get-NodeCount $xml "mask"
            filter_count = Get-NodeCount $xml "filter"
            symbol_count = Get-NodeCount $xml "symbol"
            has_embedded_images = [bool]($references | Where-Object { $_ -match "^data:" })
            has_external_references = [bool]($externalReferences.Count)
            has_foreign_object = (Get-NodeCount $xml "foreignObject") -gt 0
            has_script = (Get-NodeCount $xml "script") -gt 0
            has_mojibake_text = $hasMojibake
            powerpoint_speaker_control_count = $speakerControlCount
        }
        references = @($references)
        sequence_role = if (-not $entry.shared_text_group) { "standalone" } else {
            $group = @($mapping.mappings | Where-Object shared_text_group -eq $entry.shared_text_group | Sort-Object source_slide_number)
            if ($entry.source_slide_number -eq $group[0].source_slide_number) { "sequence_start" }
            elseif ($entry.source_slide_number -eq $group[-1].source_slide_number) { "sequence_final" }
            else { "sequence_state" }
        }
        state_delta = [ordered]@{
            compared_to = $previousSlideNumber
            added = @($added)
            removed = @($removed)
            changed = @()
            interpretation = $interpretation
        }
        candidate_sequence_group = $entry.shared_text_group
        transformation_notes = @($notes)
        qa = [ordered]@{
            issues = if ($viewBoxSource -eq "missing") { @("Weder viewBox noch ableitbare Abmessungen vorhanden.") } else { @() }
            warnings = @($qaWarnings)
            open_questions = @()
        }
    })

    $previousVisibleText = @($visibleText)
    $previousSlideNumber = [int]$entry.source_slide_number
    $previousSharedGroup = $entry.shared_text_group
}

$speakerSlides = @($slides | Where-Object { $_.features.powerpoint_speaker_control_count -gt 0 }).Count
if ($speakerSlides -gt 0) { $moduleWarnings.Add("In $speakerSlides Quell-SVGs wurde der zu entfernende PowerPoint-Lautsprecher unten rechts erkannt.") }
if (@($slides | Where-Object { $_.features.has_mojibake_text }).Count -gt 0) { $moduleWarnings.Add("Sichtbare Quelltexte enthalten moegliche Dekodierungsartefakte; Zieltexte muessen korrektes Deutsch verwenden.") }
if (@($mapping.deferred_documents).Count -gt 0) { $moduleWarnings.Add("$(@($mapping.deferred_documents).Count) Textdokumente sind fuer diesen Testlauf ausdruecklich zurueckgestellt.") }

$result = [ordered]@{
    schema_version = "basisReSourceSvgInventory/v2"
    module_id = $ModuleId
    source_root = (Convert-ToRepoPath $svgRoot) + "/"
    input_kind = "powerpoint_slide_svg"
    text_root = $mapping.text_root
    text_mapping_file = Convert-ToRepoPath $textMapPath
    text_mapping_status = $mapping.mapping_status
    narration_root = $null
    narration_status = "mapped"
    slides = @($slides)
    qa = [ordered]@{
        issues = @()
        warnings = @($moduleWarnings)
        open_questions = @()
    }
}

$outputPath = [IO.Path]::GetFullPath((Join-Path $repoRoot $Output))
[IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($outputPath)) | Out-Null
$json = $result | ConvertTo-Json -Depth 100
[IO.File]::WriteAllText($outputPath, $json + [Environment]::NewLine, [Text.UTF8Encoding]::new($false))

Write-Host "Inventory slides: $($slides.Count)"
Write-Host "Speaker controls: $speakerSlides"
Write-Host "Output: $outputPath"

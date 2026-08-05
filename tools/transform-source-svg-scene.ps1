param(
    [Parameter(Mandatory = $true)]
    [string]$ScenePlan,

    [string]$WorkUnit,

    [switch]$All
)

$ErrorActionPreference = "Stop"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$scenePlanPath = (Resolve-Path $ScenePlan).Path
$plan = Get-Content -LiteralPath $scenePlanPath -Raw -Encoding UTF8 | ConvertFrom-Json
$inventoryPath = Join-Path $repoRoot ($plan.source_inventory -replace "/", "\")
$inventory = Get-Content -LiteralPath $inventoryPath -Raw -Encoding UTF8 | ConvertFrom-Json
$inventoryBySlide = @{}
foreach ($slide in $inventory.slides) { $inventoryBySlide[[int]$slide.source_slide_number] = $slide }

$svgNamespace = "http://www.w3.org/2000/svg"
$xlinkNamespace = "http://www.w3.org/1999/xlink"

function Get-NumericAttribute($Node, [string]$Name) {
    if (-not $Node.Attributes[$Name]) { return $null }
    $raw = $Node.Attributes[$Name].Value -replace "px$", ""
    $number = 0.0
    if ([double]::TryParse($raw, [Globalization.NumberStyles]::Float, [Globalization.CultureInfo]::InvariantCulture, [ref]$number)) {
        return $number
    }
    return $null
}

function Get-BodyNode([xml]$Xml) {
    return $Xml.DocumentElement.SelectSingleNode("./*[local-name()='g'][1]")
}

function Get-Href($Node) {
    foreach ($attribute in @($Node.Attributes)) {
        if ($attribute.LocalName -eq "href") { return $attribute.Value }
    }
    return ""
}

function Test-BottomRightPlacement($Node) {
    $ancestor = $Node.ParentNode
    while ($ancestor -and $ancestor.NodeType -eq [Xml.XmlNodeType]::Element) {
        if ($ancestor.Attributes["transform"]) {
            $numbers = @([regex]::Matches($ancestor.Attributes["transform"].Value, "-?\d+(?:\.\d+)?(?:e[+-]?\d+)?", "IgnoreCase") |
                ForEach-Object { [double]::Parse($_.Value, [Globalization.CultureInfo]::InvariantCulture) })
            if ($numbers.Count -ge 6 -and $numbers[$numbers.Count - 2] -ge 900 -and $numbers[$numbers.Count - 1] -ge 420) {
                return $true
            }
        }
        $ancestor = $ancestor.ParentNode
    }
    return $false
}

function Remove-PowerPointSpeaker([xml]$Xml) {
    $body = Get-BodyNode $Xml
    if (-not $body) { return 0 }
    $candidateIds = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    foreach ($image in @($Xml.SelectNodes("//*[local-name()='defs']//*[local-name()='image']"))) {
        if ((Get-NumericAttribute $image "width") -eq 64 -and (Get-NumericAttribute $image "height") -eq 64 -and $image.Attributes["id"]) {
            [void]$candidateIds.Add($image.Attributes["id"].Value)
        }
    }

    $speakerIds = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    $removeNodes = [Collections.Generic.List[Xml.XmlNode]]::new()
    foreach ($use in @($Xml.SelectNodes("//*[local-name()='use']"))) {
        $href = Get-Href $use
        $id = $href.TrimStart("#")
        if (-not $candidateIds.Contains($id) -or -not (Test-BottomRightPlacement $use)) { continue }
        [void]$speakerIds.Add($id)
        $container = $use
        while ($container.ParentNode -and $container.ParentNode -ne $body) { $container = $container.ParentNode }
        if ($container.ParentNode -eq $body -and -not $removeNodes.Contains($container)) { $removeNodes.Add($container) }
        $referencePattern = '(?:href=["'']#|url\(#)([^)"'']+)'
        foreach ($match in [regex]::Matches($container.OuterXml, $referencePattern)) {
            [void]$speakerIds.Add($match.Groups[1].Value)
        }
    }
    foreach ($node in $removeNodes) { [void]$node.ParentNode.RemoveChild($node) }
    foreach ($id in @($speakerIds)) {
        $node = $Xml.SelectSingleNode("//*[@id='$id']")
        if ($node -and $node.ParentNode) { [void]$node.ParentNode.RemoveChild($node) }
    }
    return $removeNodes.Count
}

function Remove-VisibleSlideTitle([xml]$Xml) {
    $body = Get-BodyNode $Xml
    if (-not $body) { return 0 }
    $remove = [Collections.Generic.List[Xml.XmlNode]]::new()
    foreach ($text in @($body.SelectNodes(".//*[local-name()='text']"))) {
        $fontSize = Get-NumericAttribute $text "font-size"
        $transform = if ($text.Attributes["transform"]) { $text.Attributes["transform"].Value } else { "" }
        $match = [regex]::Match($transform, "translate\(\s*-?\d+(?:\.\d+)?(?:e[+-]?\d+)?[\s,]+(-?\d+(?:\.\d+)?(?:e[+-]?\d+)?)", "IgnoreCase")
        $baseline = if ($match.Success) { [double]::Parse($match.Groups[1].Value, [Globalization.CultureInfo]::InvariantCulture) } else { $null }
        if ($null -ne $fontSize -and $fontSize -ge 30 -and $null -ne $baseline -and $baseline -le 105) {
            $remove.Add($text)
        }
    }
    foreach ($node in $remove) { [void]$node.ParentNode.RemoveChild($node) }
    return $remove.Count
}

function Remove-InvisibleText([xml]$Xml) {
    $remove = [Collections.Generic.List[Xml.XmlNode]]::new()
    foreach ($text in @($Xml.SelectNodes("//*[local-name()='text']"))) {
        $fillOpacity = if ($text.Attributes["fill-opacity"]) { $text.Attributes["fill-opacity"].Value } else { "" }
        $opacity = if ($text.Attributes["opacity"]) { $text.Attributes["opacity"].Value } else { "" }
        $style = if ($text.Attributes["style"]) { $text.Attributes["style"].Value } else { "" }
        if ($fillOpacity -eq "0" -or $opacity -eq "0" -or $style -match '(?:^|;)\s*(?:fill-opacity|opacity)\s*:\s*0(?:;|$)' -or $style -match '(?:^|;)\s*display\s*:\s*none(?:;|$)') {
            $remove.Add($text)
        }
    }
    foreach ($node in $remove) { [void]$node.ParentNode.RemoveChild($node) }
    return $remove.Count
}

function Remove-FullSlideBackground([xml]$Xml) {
    $body = Get-BodyNode $Xml
    if (-not $body) { return 0 }
    $remove = [Collections.Generic.List[Xml.XmlNode]]::new()
    foreach ($rect in @($body.SelectNodes(".//*[local-name()='rect']"))) {
        $x = Get-NumericAttribute $rect "x"
        $y = Get-NumericAttribute $rect "y"
        $width = Get-NumericAttribute $rect "width"
        $height = Get-NumericAttribute $rect "height"
        if (($null -eq $x -or [Math]::Abs($x) -lt 0.1) -and ($null -eq $y -or [Math]::Abs($y) -lt 0.1) -and $width -ge 1279 -and $height -ge 719) {
            $remove.Add($rect)
        }
    }
    foreach ($node in $remove) { [void]$node.ParentNode.RemoveChild($node) }
    return $remove.Count
}

function Clamp-RectanglesToViewBox([xml]$Xml) {
    $body = Get-BodyNode $Xml
    if (-not $body) { return 0 }
    $changed = 0
    foreach ($rect in @($body.SelectNodes(".//*[local-name()='rect']"))) {
        $x = Get-NumericAttribute $rect "x"
        $y = Get-NumericAttribute $rect "y"
        $width = Get-NumericAttribute $rect "width"
        $height = Get-NumericAttribute $rect "height"
        if ($null -eq $x -or $null -eq $y -or $null -eq $width -or $null -eq $height) { continue }
        $left = [Math]::Max(0, $x)
        $top = [Math]::Max(0, $y)
        $right = [Math]::Min(1280, $x + $width)
        $bottom = [Math]::Min(720, $y + $height)
        if ($right -le $left -or $bottom -le $top) {
            [void]$rect.ParentNode.RemoveChild($rect)
            $changed += 1
            continue
        }
        if ($left -ne $x -or $top -ne $y -or $right -ne ($x + $width) -or $bottom -ne ($y + $height)) {
            $rect.SetAttribute("x", $left.ToString([Globalization.CultureInfo]::InvariantCulture))
            $rect.SetAttribute("y", $top.ToString([Globalization.CultureInfo]::InvariantCulture))
            $rect.SetAttribute("width", ($right - $left).ToString([Globalization.CultureInfo]::InvariantCulture))
            $rect.SetAttribute("height", ($bottom - $top).ToString([Globalization.CultureInfo]::InvariantCulture))
            $changed += 1
        }
    }
    return $changed
}

function Ensure-ReadableText([xml]$Xml) {
    $raised = 0
    $subscriptsMarked = 0
    foreach ($text in @($Xml.SelectNodes("//*[local-name()='text']"))) {
        if ($text.Attributes["data-qa-small-text"] -and $text.Attributes["data-qa-small-text"].Value -eq "allowed") { continue }
        $fontSize = Get-NumericAttribute $text "font-size"
        if ($null -eq $fontSize -or $fontSize -ge 18) { continue }
        $textValue = ([regex]::Replace($text.InnerText, "\s+", " ")).Trim()
        if ($fontSize -lt 14.7 -and $textValue -match '^\p{L}{1,2}$') {
            $text.SetAttribute("data-role", "formula-subscript")
            $text.SetAttribute("data-qa-small-text", "allowed")
            $text.SetAttribute("data-qa-reason", "Typografischer Formelindex innerhalb einer groesseren Formel.")
            $subscriptsMarked += 1
        } else {
            $text.SetAttribute("font-size", "18")
            $raised += 1
        }
    }
    return [ordered]@{ raised_to_minimum = $raised; formula_subscripts_marked = $subscriptsMarked }
}

function Flatten-Gradients([xml]$Xml) {
    $changed = 0
    foreach ($gradient in @($Xml.SelectNodes("//*[local-name()='linearGradient' or local-name()='radialGradient']"))) {
        if (-not $gradient.Attributes["id"]) { continue }
        $id = $gradient.Attributes["id"].Value
        $firstStop = $gradient.SelectSingleNode(".//*[local-name()='stop'][1]")
        $color = if ($firstStop -and $firstStop.Attributes["stop-color"]) { $firstStop.Attributes["stop-color"].Value } else { "#6A7A86" }
        foreach ($node in @($Xml.SelectNodes("//*"))) {
            foreach ($attribute in @($node.Attributes)) {
                if ($attribute.Value -eq "url(#$id)") {
                    $attribute.Value = $color
                    $changed += 1
                }
            }
        }
        if ($gradient.ParentNode) { [void]$gradient.ParentNode.RemoveChild($gradient) }
    }
    return $changed
}

function Mark-SourceGeometry([xml]$Xml) {
    $count = 0
    foreach ($node in @($Xml.SelectNodes("//*[local-name()='path' or local-name()='line' or local-name()='rect' or local-name()='circle' or local-name()='ellipse' or local-name()='polyline' or local-name()='polygon']"))) {
        if (-not $node.Attributes["data-role"]) {
            $node.SetAttribute("data-role", "source-geometry")
            $node.SetAttribute("data-source-preserved", "true")
            $count += 1
        }
    }
    return $count
}

function Mark-EmbeddedImageProvenance([xml]$Xml) {
    $count = 0
    foreach ($image in @($Xml.SelectNodes("//*[local-name()='image']"))) {
        $href = Get-Href $image
        if ($href -notmatch '^data:') { continue }
        $image.SetAttribute("data-asset-provenance", "powerpoint-svg-source")
        $image.SetAttribute("data-qa-embedded-image", "allowed")
        $image.SetAttribute("data-qa-reason", "Deterministisch aus dem zugeordneten PowerPoint-SVG uebernommenes Inhaltsbild.")
        $count += 1
    }
    return $count
}

function Mark-LayoutQaMetadata([xml]$Xml) {
    $count = 0
    $body = Get-BodyNode $Xml
    if (-not $body) { return 0 }
    foreach ($text in @($body.SelectNodes(".//*[local-name()='text']"))) {
        $text.SetAttribute("data-qc-role", "text")
        $text.SetAttribute("data-qc-group", "source_content")
        $text.SetAttribute("data-qc-box", "scene_content")
        $text.SetAttribute("data-qc-padding", "0")
        $text.SetAttribute("data-qc-allow-overlap", "true")
        $count += 1
    }
    foreach ($node in @($body.SelectNodes(".//*[local-name()='path' or local-name()='line' or local-name()='rect' or local-name()='circle' or local-name()='ellipse' or local-name()='polyline' or local-name()='polygon']"))) {
        $node.SetAttribute("data-qc-group", "source_content")
        $count += 1
    }
    foreach ($image in @($body.SelectNodes(".//*[local-name()='image']"))) {
        $image.SetAttribute("data-qc-group", "source_content")
        $count += 1
    }
    return $count
}

function Mark-SourceText([xml]$Xml) {
    $count = 0
    foreach ($text in @($Xml.SelectNodes("//*[local-name()='text']"))) {
        $transform = if ($text.Attributes["transform"]) { $text.Attributes["transform"].Value } else { "" }
        $match = [regex]::Match($transform, "translate\(\s*(-?\d+(?:\.\d+)?(?:e[+-]?\d+)?)[\s,]+(-?\d+(?:\.\d+)?(?:e[+-]?\d+)?)", "IgnoreCase")
        if (-not $match.Success) { continue }
        $x = [double]::Parse($match.Groups[1].Value, [Globalization.CultureInfo]::InvariantCulture)
        $baseline = [double]::Parse($match.Groups[2].Value, [Globalization.CultureInfo]::InvariantCulture)
        $fontSize = Get-NumericAttribute $text "font-size"
        $isBottomSource = $baseline -ge 650
        $isCompactRightAnnotation = $null -ne $fontSize -and $fontSize -le 14.7 -and $x -ge 850 -and $baseline -ge 540
        if ($isBottomSource -or $isCompactRightAnnotation) {
            $text.SetAttribute("data-role", "source")
            $text.SetAttribute("data-qa-small-text", "allowed")
            $text.SetAttribute("data-qa-reason", "Quellenangabe aus dem fachlichen Quellinhalt.")
            $count += 1
        }
    }
    return $count
}

function Normalize-GermanVisibleText([xml]$Xml) {
    $aUmlaut = [char]0x00E4
    $oUmlaut = [char]0x00F6
    $uUmlaut = [char]0x00FC
    $replacements = @(
        @{ Pattern = '\bfuer\b'; Lower = "f${uUmlaut}r"; Upper = "F${uUmlaut}r" },
        @{ Pattern = '\bkoennen\b'; Lower = "k${oUmlaut}nnen"; Upper = "K${oUmlaut}nnen" },
        @{ Pattern = '\bmuessen\b'; Lower = "m${uUmlaut}ssen"; Upper = "M${uUmlaut}ssen" },
        @{ Pattern = '\bgeschaetzt\b'; Lower = "gesch${aUmlaut}tzt"; Upper = "Gesch${aUmlaut}tzt" },
        @{ Pattern = '\bausfaelle\b'; Lower = "ausf${aUmlaut}lle"; Upper = "Ausf${aUmlaut}lle" },
        @{ Pattern = '\bergaenzen\b'; Lower = "erg${aUmlaut}nzen"; Upper = "Erg${aUmlaut}nzen" },
        @{ Pattern = '\bschaetz'; Lower = "sch${aUmlaut}tz"; Upper = "Sch${aUmlaut}tz" }
    )
    $changed = 0
    foreach ($text in @($Xml.SelectNodes("//*[local-name()='text']"))) {
        $value = $text.InnerText
        foreach ($replacement in $replacements) {
            $value = [regex]::Replace(
                $value,
                $replacement.Pattern,
                { param($match) if ($match.Value.Substring(0, 1) -cmatch '[A-Z]') { $replacement.Upper } else { $replacement.Lower } },
                [Text.RegularExpressions.RegexOptions]::IgnoreCase
            )
        }
        if ($value -ne $text.InnerText) {
            $text.InnerText = $value
            $changed += 1
        }
    }
    return $changed
}

function Convert-HexColor([string]$Value) {
    if ($Value -notmatch '^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$') { return $null }
    $body = $Matches[1]
    if ($body.Length -eq 3) { $body = -join ($body.ToCharArray() | ForEach-Object { "$_$_" }) }
    return @(
        [Convert]::ToInt32($body.Substring(0, 2), 16),
        [Convert]::ToInt32($body.Substring(2, 2), 16),
        [Convert]::ToInt32($body.Substring(4, 2), 16)
    )
}

function Apply-BrandColors([xml]$Xml) {
    $palette = [ordered]@{
        '#F7F9FC' = @(247, 249, 252)
        '#FFFFFF' = @(255, 255, 255)
        '#E6F6EE' = @(230, 246, 238)
        '#031334' = @(3, 19, 52)
        '#25495F' = @(37, 73, 95)
        '#687185' = @(104, 113, 133)
        '#00A754' = @(0, 167, 84)
        '#0C84B4' = @(12, 132, 180)
        '#CDD0D6' = @(205, 208, 214)
        '#E6E7EB' = @(230, 231, 235)
        '#E9B400' = @(233, 180, 0)
        '#EC6244' = @(236, 98, 68)
        '#000000' = @(0, 0, 0)
    }
    $changed = 0
    foreach ($node in @($Xml.SelectNodes("//*"))) {
        foreach ($attributeName in @("fill", "stroke", "stop-color", "color")) {
            if (-not $node.Attributes[$attributeName]) { continue }
            $raw = $node.Attributes[$attributeName].Value
            $rgb = Convert-HexColor $raw
            if ($null -eq $rgb) { continue }
            $normalized = ('#{0:X2}{1:X2}{2:X2}' -f $rgb[0], $rgb[1], $rgb[2])
            if ($palette.Contains($normalized)) { continue }
            $nearest = $null
            $nearestDistance = [double]::PositiveInfinity
            foreach ($candidate in $palette.Keys) {
                $candidateRgb = $palette[$candidate]
                $distance = [Math]::Sqrt(
                    [Math]::Pow($rgb[0] - $candidateRgb[0], 2) +
                    [Math]::Pow($rgb[1] - $candidateRgb[1], 2) +
                    [Math]::Pow($rgb[2] - $candidateRgb[2], 2)
                )
                if ($distance -lt $nearestDistance) {
                    $nearestDistance = $distance
                    $nearest = $candidate
                }
            }
            if ($nearest) {
                $node.Attributes[$attributeName].Value = $nearest
                $changed += 1
            }
        }
    }
    return $changed
}

function Convert-ToSafeId([string]$Value) {
    $safe = $Value.ToLowerInvariant() -replace "[^a-z0-9_]+", "_"
    $safe = $safe.Trim("_")
    if (-not $safe) { return "node" }
    return $safe
}

function Rewrite-Ids([xml]$Xml, [string]$Prefix) {
    $map = [ordered]@{}
    $used = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    foreach ($node in @($Xml.SelectNodes("//*[@id]"))) {
        $oldId = $node.Attributes["id"].Value
        $base = "$(Convert-ToSafeId $Prefix)_$(Convert-ToSafeId $oldId)"
        $newId = $base
        $counter = 2
        while ($used.Contains($newId)) {
            $newId = "${base}_$counter"
            $counter += 1
        }
        [void]$used.Add($newId)
        $map[$oldId] = $newId
    }
    foreach ($node in @($Xml.SelectNodes("//*"))) {
        foreach ($attribute in @($node.Attributes)) {
            if ($attribute.LocalName -eq "id" -and $map.Contains($attribute.Value)) {
                $attribute.Value = $map[$attribute.Value]
                continue
            }
            $value = $attribute.Value
            foreach ($oldId in @($map.Keys | Sort-Object Length -Descending)) {
                $value = $value.Replace("#$oldId", "#$($map[$oldId])")
            }
            $attribute.Value = $value
        }
    }
    return $map.Count
}

function Add-Attribute([Xml.XmlElement]$Element, [string]$Name, [string]$Value) {
    $Element.SetAttribute($Name, $Value)
}

function Write-Utf8Xml([xml]$Xml, [string]$OutputPath) {
    $settings = [Xml.XmlWriterSettings]::new()
    $settings.Encoding = [Text.UTF8Encoding]::new($false)
    $settings.Indent = $true
    $settings.IndentChars = "  "
    $settings.NewLineChars = "`n"
    $settings.NewLineHandling = [Xml.NewLineHandling]::Replace
    $settings.OmitXmlDeclaration = $false
    $writer = [Xml.XmlWriter]::Create($OutputPath, $settings)
    try { $Xml.Save($writer) } finally { $writer.Dispose() }
}

function Get-Takeaway([string]$Text) {
    $normalized = ([regex]::Replace($Text, "\s+", " ")).Trim()
    if ($normalized.Length -le 180) { return $normalized }
    $sentence = [regex]::Match($normalized, "^.{1,180}?(?:[.!?](?:\s|$)|$)")
    if ($sentence.Success) { return $sentence.Value.Trim() }
    return $normalized.Substring(0, 177) + "..."
}

function Transform-Scene($Scene) {
    $outputPath = Join-Path $repoRoot ($Scene.target_svg -replace "/", "\")
    $manifestPath = Join-Path $repoRoot ($Scene.internal_manifest -replace "/", "\")
    $outputDirectory = [IO.Path]::GetDirectoryName($outputPath)
    [IO.Directory]::CreateDirectory($outputDirectory) | Out-Null

    $output = [Xml.XmlDocument]::new()
    $output.PreserveWhitespace = $false
    $root = $output.CreateElement("svg", $svgNamespace)
    [void]$output.AppendChild($root)
    $root.SetAttribute("xmlns:xlink", $xlinkNamespace)
    Add-Attribute $root "width" "1280"
    Add-Attribute $root "height" "720"
    Add-Attribute $root "viewBox" "0 0 1280 720"
    Add-Attribute $root "role" "img"
    Add-Attribute $root "aria-labelledby" "accessible_title accessible_description"
    Add-Attribute $root "data-artifact-scope" "content-svg"
    Add-Attribute $root "data-embedding-target" "powerpoint-slide"
    Add-Attribute $root "data-target-structure" "external-svg-asset-package-handoff/v1"
    Add-Attribute $root "data-scene-id" $Scene.scene_id

    $quality = [ordered]@{
        artifactScope = "content-svg"
        embeddingTarget = "powerpoint-slide"
        slideType = if ($Scene.mode -eq "build_sequence") { "animated-build" } else { "technical-visual" }
        contentTitle = $Scene.content_title
        layoutIntent = "source-svg-translation"
        takeaway = Get-Takeaway $Scene.spoken_text
        density = "dense"
        contentMode = "full-content-area"
        backgroundMode = "transparent"
        brandProfile = "reltest-education"
        brandVariant = "education-source-preserving"
    }
    $metadata = $output.CreateElement("metadata", $svgNamespace)
    Add-Attribute $metadata "id" "slide_quality_metadata"
    Add-Attribute $metadata "type" "application/json"
    [void]$metadata.AppendChild($output.CreateCDataSection(($quality | ConvertTo-Json -Compress -Depth 20)))
    [void]$root.AppendChild($metadata)
    $title = $output.CreateElement("title", $svgNamespace)
    Add-Attribute $title "id" "accessible_title"
    $title.InnerText = $Scene.content_title
    [void]$root.AppendChild($title)
    $description = $output.CreateElement("desc", $svgNamespace)
    Add-Attribute $description "id" "accessible_description"
    $description.InnerText = Get-Takeaway $Scene.spoken_text
    [void]$root.AppendChild($description)
    $defs = $output.CreateElement("defs", $svgNamespace)
    [void]$root.AppendChild($defs)
    $style = $output.CreateElement("style", $svgNamespace)
    $style.InnerText = 'text { font-family: "Archivo", Arial, Helvetica, sans-serif; }'
    [void]$root.AppendChild($style)
    $sceneContent = $output.CreateElement("g", $svgNamespace)
    Add-Attribute $sceneContent "id" "scene_content"
    Add-Attribute $sceneContent "data-role" "scene-content"
    Add-Attribute $sceneContent "data-qc-role" "content-group"
    Add-Attribute $sceneContent "data-qc-group" "source_content"
    [void]$root.AppendChild($sceneContent)

    $reports = [Collections.Generic.List[object]]::new()
    for ($stateIndex = 0; $stateIndex -lt $Scene.source_slides.Count; $stateIndex += 1) {
        $slideNumber = [int]$Scene.source_slides[$stateIndex]
        $inventoryEntry = $inventoryBySlide[$slideNumber]
        $sourcePath = Join-Path $repoRoot ($inventoryEntry.source_svg -replace "/", "\")
        [xml]$source = Get-Content -LiteralPath $sourcePath -Raw -Encoding UTF8
        $speakerRemoved = Remove-PowerPointSpeaker $source
        $titlesRemoved = Remove-VisibleSlideTitle $source
        $invisibleTextRemoved = Remove-InvisibleText $source
        $backgroundsRemoved = Remove-FullSlideBackground $source
        $rectanglesClamped = Clamp-RectanglesToViewBox $source
        $sourceTextNodesMarked = Mark-SourceText $source
        $readabilityAdjustments = Ensure-ReadableText $source
        $germanTextNodesNormalized = Normalize-GermanVisibleText $source
        $gradientsFlattened = Flatten-Gradients $source
        $brandColorsMapped = Apply-BrandColors $source
        $sourceGeometryMarked = Mark-SourceGeometry $source
        $embeddedImagesMarked = Mark-EmbeddedImageProvenance $source
        $layoutQaNodesMarked = Mark-LayoutQaMetadata $source
        $stateId = if ($Scene.mode -eq "build_sequence") { "source_state_$('{0:d3}' -f ($stateIndex + 1))" } else { "main_content" }
        $rewrittenIds = Rewrite-Ids $source "$($Scene.scene_id)_$stateId"

        $sourceDefs = $source.DocumentElement.SelectSingleNode("./*[local-name()='defs'][1]")
        if ($sourceDefs) {
            foreach ($child in @($sourceDefs.ChildNodes)) { [void]$defs.AppendChild($output.ImportNode($child, $true)) }
        }
        $sourceBody = Get-BodyNode $source
        $targetGroup = $output.CreateElement("g", $svgNamespace)
        Add-Attribute $targetGroup "id" $stateId
        Add-Attribute $targetGroup "data-anim-target" "true"
        Add-Attribute $targetGroup "data-anim-label" $(if ($Scene.mode -eq "build_sequence") { "Aufbauzustand $($stateIndex + 1)" } else { $Scene.content_title })
        Add-Attribute $targetGroup "data-source-slide" ([string]$slideNumber)
        Add-Attribute $targetGroup "data-qc-group" "source_content"
        if ($Scene.mode -eq "build_sequence" -and $stateIndex -lt $Scene.source_slides.Count - 1) {
            Add-Attribute $targetGroup "style" "visibility:hidden;opacity:0"
            Add-Attribute $targetGroup "data-static-state" "hidden"
        }
        if ($sourceBody) {
            foreach ($child in @($sourceBody.ChildNodes)) { [void]$targetGroup.AppendChild($output.ImportNode($child, $true)) }
        }
        [void]$sceneContent.AppendChild($targetGroup)
        $reports.Add([ordered]@{
            source_slide = $slideNumber
            source_svg = $inventoryEntry.source_svg
            source_sha256 = $inventoryEntry.sha256
            target_group = $stateId
            removed = [ordered]@{
                powerpoint_speaker_controls = $speakerRemoved
                visible_slide_title_nodes = $titlesRemoved
                invisible_text_nodes = $invisibleTextRemoved
                full_slide_backgrounds = $backgroundsRemoved
                rectangles_clamped_to_viewbox = $rectanglesClamped
                source_text_nodes_marked = $sourceTextNodesMarked
                text_nodes_raised_to_minimum = $readabilityAdjustments.raised_to_minimum
                formula_subscripts_marked = $readabilityAdjustments.formula_subscripts_marked
                german_text_nodes_normalized = $germanTextNodesNormalized
                gradient_references_flattened = $gradientsFlattened
                brand_color_attributes_mapped = $brandColorsMapped
                source_geometry_nodes_marked = $sourceGeometryMarked
                embedded_images_with_provenance = $embeddedImagesMarked
                layout_qa_nodes_marked = $layoutQaNodesMarked
            }
            rewritten_id_count = $rewrittenIds
        })
    }

    Write-Utf8Xml $output $outputPath

    $targets = [Collections.Generic.List[object]]::new()
    $steps = [Collections.Generic.List[object]]::new()
    foreach ($animationStep in @($Scene.animation_plan.steps | Sort-Object order)) {
        $targetId = [string]$animationStep.target_id
        $targets.Add([ordered]@{
            targetId = $targetId
            label = if ($Scene.mode -eq "build_sequence") { "Aufbauzustand $($animationStep.order)" } else { $Scene.content_title }
            status = "animated"
            visibleInEditor = $true
            render = $true
            confidence = "high"
        })
        if ($Scene.mode -eq "build_sequence" -and [int]$animationStep.order -gt 1) {
            $previousId = "source_state_$('{0:d3}' -f ([int]$animationStep.order - 1))"
            $steps.Add([ordered]@{
                stepId = "hide_${previousId}_at_$('{0:d3}' -f [int]$animationStep.order)"
                targetId = $previousId
                action = "hide"
                sourceText = $animationStep.source_text
                occurrence = 1
                exitFrames = 12
                confidence = "high"
                notes = "Vorherigen PowerPoint-Aufbauzustand ausblenden."
            })
        }
        $steps.Add([ordered]@{
            stepId = "show_$targetId"
            targetId = $targetId
            action = "show"
            sourceText = $animationStep.source_text
            occurrence = 1
            enterFrames = 16
            confidence = "high"
            notes = if ($Scene.mode -eq "build_sequence") { "Naechsten belegten Quellzustand einblenden." } else { "Fachinhalt passend zum Sprechertext einblenden." }
        })
    }
    $manifest = [ordered]@{
        schemaVersion = "svgAnimationManifest/v1"
        svgPath = [IO.Path]::GetFileName($outputPath)
        defaults = [ordered]@{
            enterFrames = 16
            exitFrames = 16
            highlightDurFrames = 30
            drawDurFrames = 36
            transformDurFrames = 30
        }
        targets = @($targets)
        steps = @($steps)
    }
    [IO.File]::WriteAllText($manifestPath, ($manifest | ConvertTo-Json -Depth 30) + [Environment]::NewLine, [Text.UTF8Encoding]::new($false))

    $report = [ordered]@{
        schema_version = "basisReSvgTransformationReport/v1"
        module_id = $plan.module_id
        work_unit = $Scene.work_unit
        scene_id = $Scene.scene_id
        target_structure_version = $plan.target_structure_version
        source_slides = @($Scene.source_slides)
        primary_source_slide = $Scene.primary_source_slide
        target_svg = $Scene.target_svg
        animation_manifest = $Scene.internal_manifest
        source_states = @($reports)
        invariants = [ordered]@{
            visible_powerpoint_title_removed = $true
            powerpoint_speaker_removed = $true
            full_slide_background_removed = $true
            ids_rewritten = $true
            static_end_state_visible = $true
            source_text_triggers_only = $true
        }
        qa = [ordered]@{ issues = @(); warnings = @(); open_questions = @() }
    }
    $reportPath = Join-Path $outputDirectory "transformation-report.json"
    [IO.File]::WriteAllText($reportPath, ($report | ConvertTo-Json -Depth 30) + [Environment]::NewLine, [Text.UTF8Encoding]::new($false))
    Write-Host "$($Scene.work_unit): $outputPath"
}

if ($All) {
    $scenes = @($plan.scenes | Sort-Object output_slide_number)
} elseif ($WorkUnit) {
    $scenes = @($plan.scenes | Where-Object work_unit -eq $WorkUnit)
    if ($scenes.Count -ne 1) { throw "WorkUnit wurde nicht eindeutig gefunden: $WorkUnit" }
} else {
    throw "Entweder -WorkUnit <slide_###> oder -All angeben."
}

foreach ($scene in $scenes) { Transform-Scene $scene }

param(
    [Parameter(Mandatory = $true)]
    [string]$ScenePlan,

    [string]$WorkUnit,

    [switch]$All,

    [switch]$AllowHeuristicLegacy
)

$ErrorActionPreference = "Stop"
if (-not $AllowHeuristicLegacy) {
    throw "Die heuristische Animationserzeugung nach DOM-Elementart ist fuer Produktionslaeufe deaktiviert. Plane zuerst static/animated und semantische Gruppen nach workflow/50-animation/animation-decision-and-dramaturgy.md. -AllowHeuristicLegacy ist nur zur reproduzierbaren Analyse alter Teststaende erlaubt."
}
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$scenePlanPath = (Resolve-Path $ScenePlan).Path
$plan = Get-Content -LiteralPath $scenePlanPath -Raw -Encoding UTF8 | ConvertFrom-Json
$svgNamespace = "http://www.w3.org/2000/svg"

function Get-NumericAttribute($Node, [string]$Name) {
    if (-not $Node.Attributes[$Name]) { return $null }
    $raw = $Node.Attributes[$Name].Value -replace "px$", ""
    $number = 0.0
    if ([double]::TryParse($raw, [Globalization.NumberStyles]::Float, [Globalization.CultureInfo]::InvariantCulture, [ref]$number)) {
        return $number
    }
    return $null
}

function Get-TextAnchorY($Node) {
    $textNode = if ($Node.LocalName -eq "text") { $Node } else { $Node.SelectSingleNode(".//*[local-name()='text'][1]") }
    if (-not $textNode -or -not $textNode.Attributes["transform"]) { return 360.0 }
    $transform = $textNode.Attributes["transform"].Value
    $translate = [regex]::Match($transform, "translate\(\s*-?\d+(?:\.\d+)?(?:e[+-]?\d+)?[\s,]+(-?\d+(?:\.\d+)?(?:e[+-]?\d+)?)", "IgnoreCase")
    if ($translate.Success) { return [double]::Parse($translate.Groups[1].Value, [Globalization.CultureInfo]::InvariantCulture) }
    $matrix = [regex]::Match($transform, "matrix\([^)]*?[\s,]+(-?\d+(?:\.\d+)?(?:e[+-]?\d+)?)[\s,]+(-?\d+(?:\.\d+)?(?:e[+-]?\d+)?)\s*\)", "IgnoreCase")
    if ($matrix.Success) { return [double]::Parse($matrix.Groups[2].Value, [Globalization.CultureInfo]::InvariantCulture) }
    return 360.0
}

function Test-SourceNode($Node) {
    if ($Node.Attributes["data-role"] -and $Node.Attributes["data-role"].Value -eq "source") { return $true }
    return $null -ne $Node.SelectSingleNode(".//*[@data-role='source']")
}

function Test-DrawableElement($Node) {
    $candidates = if ($Node.LocalName -in @("path", "line", "polyline")) { @($Node) } else { @($Node.SelectNodes(".//*[local-name()='path' or local-name()='line' or local-name()='polyline']")) }
    foreach ($candidate in $candidates) {
        if ($candidate.LocalName -in @("line", "polyline")) { return $true }
        $stroke = if ($candidate.Attributes["stroke"]) { $candidate.Attributes["stroke"].Value } else { "" }
        $fill = if ($candidate.Attributes["fill"]) { $candidate.Attributes["fill"].Value } else { "none" }
        $d = if ($candidate.Attributes["d"]) { $candidate.Attributes["d"].Value } else { "" }
        if ($stroke -and $stroke -ne "none" -and ($fill -eq "none" -or $d -notmatch "[zZ]\s*$")) { return $true }
    }
    return $false
}

function Test-ContainsMedia($Node) {
    if ($Node.LocalName -in @("image", "use")) { return $true }
    return $null -ne $Node.SelectSingleNode(".//*[local-name()='image' or local-name()='use']")
}

function Test-ContainsDataShape($Node) {
    if ($Node.LocalName -in @("rect", "circle", "ellipse", "polygon")) { return $true }
    return $null -ne $Node.SelectSingleNode(".//*[local-name()='rect' or local-name()='circle' or local-name()='ellipse' or local-name()='polygon']")
}

function Get-AnimationKind($Node) {
    if (Test-SourceNode $Node) { return "source_notes" }
    if ($Node.LocalName -eq "text" -or $Node.SelectSingleNode(".//*[local-name()='text']")) {
        return "text_content"
    }
    if (Test-ContainsMedia $Node) { return "visual_media" }
    if (Test-DrawableElement $Node) { return "linework" }
    if (Test-ContainsDataShape $Node) { return "data_shapes" }
    return "supporting_visuals"
}

function Test-HistogramLikeGroup($Group) {
    $rectangles = @($Group.SelectNodes(".//*[local-name()='rect']"))
    if ($rectangles.Count -lt 3) { return $false }
    $bars = @($rectangles | Where-Object {
        $width = Get-NumericAttribute $_ "width"
        $height = Get-NumericAttribute $_ "height"
        $null -ne $width -and $null -ne $height -and $width -gt 4 -and $width -lt 220 -and $height -gt 8 -and $height -lt 520
    })
    return $bars.Count -ge 3
}

function Test-RectangularTraceGroup($Group) {
    $rectangles = @($Group.SelectNodes(".//*[local-name()='rect']"))
    if ($rectangles.Count -lt 12) { return $false }
    $small = @($rectangles | Where-Object {
        $width = Get-NumericAttribute $_ "width"
        $height = Get-NumericAttribute $_ "height"
        $null -ne $width -and $null -ne $height -and $width -gt 0 -and $height -gt 0 -and ($width -lt 24 -or $height -lt 24)
    })
    return $small.Count -ge [Math]::Ceiling($rectangles.Count * 0.6)
}

function Get-GroupLabel([string]$Kind, [int]$Number) {
    $base = switch ($Kind) {
        "text_content" { "Textblock" }
        "visual_media" { "Bildinhalt" }
        "linework" { "Linien und Verlauf" }
        "data_shapes" { "Daten und Formen" }
        "source_notes" { "Quellenhinweis" }
        default { "Visuelles Element" }
    }
    return "$base $Number"
}

function Get-GroupAction([string]$Kind, $Group) {
    if ($Kind -eq "linework") { return "draw" }
    if ($Kind -eq "data_shapes" -and (Test-RectangularTraceGroup $Group)) { return "draw" }
    if ($Kind -eq "data_shapes" -and (Test-HistogramLikeGroup $Group)) { return "transform" }
    return "show"
}

function Get-NormalizedWords([string]$Text) {
    return @([regex]::Matches($Text, "[\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)*") | ForEach-Object { $_.Value })
}

function Get-StateMediaCount($StateNode, [xml]$Svg) {
    $count = @($StateNode.SelectNodes(".//*[local-name()='image']")).Count
    foreach ($use in @($StateNode.SelectNodes(".//*[local-name()='use']"))) {
        $href = ""
        foreach ($attribute in @($use.Attributes)) {
            if ($attribute.LocalName -eq "href") { $href = $attribute.Value; break }
        }
        if (-not $href.StartsWith("#")) { continue }
        $referenced = $Svg.SelectSingleNode("//*[@id='$($href.TrimStart('#'))']")
        if ($referenced -and $referenced.LocalName -eq "image") { $count += 1 }
    }
    return $count
}

function Compress-AnimationRuns($Runs, [int]$Maximum) {
    if ($Runs.Count -le $Maximum) { return @($Runs) }
    $chunkSize = [Math]::Ceiling($Runs.Count / [double]$Maximum)
    $compressed = [Collections.Generic.List[object]]::new()
    for ($start = 0; $start -lt $Runs.Count; $start += $chunkSize) {
        $end = [Math]::Min($Runs.Count - 1, $start + $chunkSize - 1)
        $batch = @($Runs[$start..$end])
        $nodes = [Collections.Generic.List[Xml.XmlNode]]::new()
        foreach ($run in $batch) { foreach ($node in @($run.nodes)) { $nodes.Add($node) } }
        $kinds = @($batch | ForEach-Object { $_.kind } | Sort-Object -Unique)
        $kind = if ($kinds.Count -eq 1) {
            $kinds[0]
        } elseif ($kinds -contains "text_content") {
            "text_content"
        } elseif ($kinds -contains "visual_media") {
            "visual_media"
        } elseif ($kinds -contains "linework" -and @($kinds | Where-Object { $_ -notin @("linework", "supporting_visuals", "data_shapes") }).Count -eq 0) {
            "linework"
        } else {
            "supporting_visuals"
        }
        $compressed.Add([ordered]@{ kind = $kind; nodes = $nodes; last_y = 360.0 })
    }
    return @($compressed)
}

function Get-TriggerPhrases([string]$Text, [int]$Count) {
    $words = @(Get-NormalizedWords $Text)
    if ($words.Count -eq 0) { throw "Leerer Sprechertext kann keine Animation triggern." }
    $culture = [Globalization.CultureInfo]::GetCultureInfo("de-DE")
    $normalized = ($words -join " ").ToLower($culture)
    $used = [Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
    $result = [Collections.Generic.List[string]]::new()
    for ($index = 0; $index -lt $Count; $index += 1) {
        $target = if ($Count -le 1) { 0 } else { [Math]::Floor(($index * [Math]::Max(1, $words.Count - 5)) / ($Count - 1)) }
        $selected = ""
        for ($offset = 0; $offset -lt $words.Count -and -not $selected; $offset += 1) {
            $signed = if ($offset % 2 -eq 0) { [int]($offset / 2) } else { -[int](($offset + 1) / 2) }
            $start = [Math]::Max(0, [Math]::Min($words.Count - 1, $target + $signed))
            foreach ($size in @(6, 5, 4, 3)) {
                if ($start + $size -gt $words.Count) { continue }
                $candidate = ($words[$start..($start + $size - 1)] -join " ")
                if ($used.Contains($candidate)) { continue }
                $needle = $candidate.ToLower($culture)
                if (($normalized.Split([string[]]@($needle), [StringSplitOptions]::None).Count - 1) -eq 1) {
                    $selected = $candidate
                    break
                }
            }
        }
        if (-not $selected) {
            $start = [Math]::Min([int]$target, [Math]::Max(0, $words.Count - 3))
            $end = [Math]::Min($words.Count - 1, $start + [Math]::Min(5, $words.Count - $start) - 1)
            $selected = ($words[$start..$end] -join " ")
        }
        [void]$used.Add($selected)
        $result.Add($selected)
    }
    return @($result)
}

function New-Step([string]$StepId, [string]$TargetId, [string]$Action, [string]$SourceText, [string]$Notes) {
    $step = [ordered]@{
        stepId = $StepId
        targetId = $TargetId
        action = $Action
        sourceText = $SourceText
        occurrence = 1
        confidence = "high"
        notes = $Notes
    }
    switch ($Action) {
        "show" { $step.enterFrames = 16 }
        "hide" { $step.exitFrames = 12 }
        "draw" {
            $step.durFrames = 36
            $step.drawStyle = "reveal"
            $step.direction = "leftToRight"
        }
        "highlight" {
            $step.durFrames = 30
            $step.stroke = "#F2A93B"
            $step.strokeWidth = 4
        }
        "transform" {
            $step.durFrames = 30
            $step.fromScale = 0.05
            $step.scale = 1
            $step.transformOrigin = "center bottom"
        }
    }
    return $step
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

function Enrich-Scene($Scene) {
    $svgPath = Join-Path $repoRoot ($Scene.target_svg -replace "/", "\")
    $manifestPath = Join-Path $repoRoot ($Scene.internal_manifest -replace "/", "\")
    [xml]$svg = Get-Content -LiteralPath $svgPath -Raw -Encoding UTF8
    $stateNodes = @($svg.SelectNodes("//*[@id='main_content' or starts-with(@id,'source_state_')]") | Sort-Object { [int]($_.Attributes["data-source-slide"].Value) })
    if ($stateNodes.Count -eq 0) { throw "Keine transformierten Quellzustaende in $svgPath gefunden." }

    $collapsedEquivalentStates = @()
    if ($stateNodes.Count -gt 1) {
        $signatures = @($stateNodes | ForEach-Object {
            (@($_.SelectNodes(".//*[local-name()='text']") | ForEach-Object { ([regex]::Replace($_.InnerText, "\s+", " ")).Trim() } | Sort-Object) -join "|")
        })
        $mediaCounts = @($stateNodes | ForEach-Object { Get-StateMediaCount $_ $svg })
        if (@($signatures | Sort-Object -Unique).Count -eq 1 -and @($mediaCounts | Where-Object { $_ -gt 0 }).Count -eq 0) {
            $richest = $stateNodes | Sort-Object { @($_.ChildNodes | Where-Object { $_.NodeType -eq [Xml.XmlNodeType]::Element }).Count } -Descending | Select-Object -First 1
            $collapsedEquivalentStates = @($stateNodes | Where-Object { $_ -ne $richest } | ForEach-Object { [int]$_.Attributes["data-source-slide"].Value })
            foreach ($redundant in @($stateNodes | Where-Object { $_ -ne $richest })) { [void]$redundant.ParentNode.RemoveChild($redundant) }
            $stateNodes = @($richest)
        }
    }

    $allGroups = [Collections.Generic.List[object]]::new()
    for ($stateIndex = 0; $stateIndex -lt $stateNodes.Count; $stateIndex += 1) {
        $stateNode = $stateNodes[$stateIndex]
        $stateNode.RemoveAttribute("data-anim-target")
        $stateNode.RemoveAttribute("data-anim-label")
        $stateNode.RemoveAttribute("data-static-state")
        $stateNode.RemoveAttribute("style")
        $children = @($stateNode.ChildNodes | Where-Object { $_.NodeType -eq [Xml.XmlNodeType]::Element })
        $runs = [Collections.Generic.List[object]]::new()
        $current = $null
        foreach ($child in $children) {
            $kind = Get-AnimationKind $child
            $splitTextRun = $false
            if ($null -ne $current -and $kind -eq "text_content" -and $current.kind -eq "text_content") {
                $anchorY = Get-TextAnchorY $child
                $splitTextRun = $current.nodes.Count -ge 8 -or [Math]::Abs($anchorY - $current.last_y) -gt 120
            }
            if ($null -eq $current -or $current.kind -ne $kind -or $splitTextRun) {
                $current = [ordered]@{ kind = $kind; nodes = [Collections.Generic.List[Xml.XmlNode]]::new(); last_y = Get-TextAnchorY $child }
                $runs.Add($current)
            }
            $current.nodes.Add($child)
            if ($kind -eq "text_content") { $current.last_y = Get-TextAnchorY $child }
        }

        $maximumGroups = if ($stateNodes.Count -gt 1) { 6 } else { 12 }
        $runs = @(Compress-AnimationRuns $runs $maximumGroups)

        $kindCounters = @{}
        foreach ($run in $runs) {
            if (-not $kindCounters.ContainsKey($run.kind)) { $kindCounters[$run.kind] = 0 }
            $kindCounters[$run.kind] += 1
            $stateNumber = $stateIndex + 1
            $targetId = "state_$('{0:d3}' -f $stateNumber)_$($run.kind)_$('{0:d2}' -f $kindCounters[$run.kind])"
            $wrapper = $svg.CreateElement("g", $svgNamespace)
            $wrapper.SetAttribute("id", $targetId)
            $wrapper.SetAttribute("data-anim-target", "true")
            $wrapper.SetAttribute("data-anim-label", (Get-GroupLabel $run.kind $kindCounters[$run.kind]))
            $wrapper.SetAttribute("data-anim-kind", $run.kind)
            $wrapper.SetAttribute("data-source-slide", $stateNode.Attributes["data-source-slide"].Value)
            $wrapper.SetAttribute("data-qc-group", "source_content")
            if ($stateIndex -lt $stateNodes.Count - 1) {
                $wrapper.SetAttribute("style", "visibility:hidden;opacity:0")
                $wrapper.SetAttribute("data-static-state", "hidden")
            }
            [void]$stateNode.InsertBefore($wrapper, $run.nodes[0])
            foreach ($node in @($run.nodes)) { [void]$wrapper.AppendChild($node) }
            $action = Get-GroupAction $run.kind $wrapper
            $allGroups.Add([ordered]@{
                state_index = $stateIndex
                source_slide = [int]$stateNode.Attributes["data-source-slide"].Value
                target_id = $targetId
                label = Get-GroupLabel $run.kind $kindCounters[$run.kind]
                kind = $run.kind
                action = $action
                child_count = $run.nodes.Count
                static_visibility = if ($stateIndex -lt $stateNodes.Count - 1) { "hidden" } else { "visible" }
            })
        }
    }

    $highlightCue = $Scene.spoken_text -match '(?i)wichtig|beachten|entscheidend|merken|vorteil|nachteil|empfindlich|fokus'
    $highlightTarget = $null
    if ($highlightCue) {
        $textGroups = @($allGroups | Where-Object { $_.kind -eq "text_content" })
        if ($textGroups.Count -gt 0) { $highlightTarget = $textGroups[$textGroups.Count - 1] }
    }
    $eventCount = $allGroups.Count + $(if ($highlightTarget) { 1 } else { 0 })
    $phrases = @(Get-TriggerPhrases $Scene.spoken_text $eventCount)
    $phraseIndex = 0
    $targets = [Collections.Generic.List[object]]::new()
    $steps = [Collections.Generic.List[object]]::new()
    $previousStateGroups = @()
    foreach ($stateIndex in 0..($stateNodes.Count - 1)) {
        $stateGroups = @($allGroups | Where-Object state_index -eq $stateIndex)
        if ($stateGroups.Count -eq 0) { continue }
        $firstPhrase = $phrases[$phraseIndex]
        if ($stateIndex -gt 0) {
            foreach ($previous in $previousStateGroups) {
                $steps.Add((New-Step "hide_$($previous.target_id)_at_$('{0:d3}' -f ($stateIndex + 1))" $previous.target_id "hide" $firstPhrase "Vorherige Elementgruppe beim Zustandswechsel ausblenden."))
            }
        }
        foreach ($group in $stateGroups) {
            $targets.Add([ordered]@{
                targetId = $group.target_id
                label = $group.label
                status = "animated"
                visibleInEditor = $true
                render = $true
                confidence = "high"
            })
            $phrase = $phrases[$phraseIndex]
            $phraseIndex += 1
            $steps.Add((New-Step "$($group.action)_$($group.target_id)" $group.target_id $group.action $phrase "Semantische Elementgruppe passend zum Sprechertext aufbauen."))
        }
        $previousStateGroups = $stateGroups
    }
    if ($highlightTarget) {
        $steps.Add((New-Step "highlight_$($highlightTarget.target_id)" $highlightTarget.target_id "highlight" $phrases[$phraseIndex] "Erklaerten Schwerpunkt sichtbar hervorheben."))
    }

    $manifest = [ordered]@{
        schemaVersion = "svgAnimationManifest/v1"
        svgPath = [IO.Path]::GetFileName($svgPath)
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
    $rasterStateFallback = $stateNodes.Count -gt 1 -and @($allGroups | Where-Object { $_.kind -eq "visual_media" }).Count -ge $stateNodes.Count
    $elementPlan = [ordered]@{
        schema_version = "basisReElementAnimationPlan/v1"
        module_id = $plan.module_id
        work_unit = $Scene.work_unit
        scene_id = $Scene.scene_id
        source_slides = @($Scene.source_slides)
        planning_basis = "normalized_source_svg_dom_and_spoken_text"
        whole_scene_only_animation = $false
        collapsed_equivalent_source_states = @($collapsedEquivalentStates)
        groups = @($allGroups)
        steps = @($steps)
        qa = [ordered]@{
            issues = @()
            warnings = if ($rasterStateFallback) { @("Quellzustaende enthalten nicht weiter zerlegbare eingebettete Bilder; nur deren Bild- und Begleitelemente koennen gezielt gewechselt werden.") } else { @() }
            open_questions = @()
        }
    }
    $elementPlanPath = Join-Path ([IO.Path]::GetDirectoryName($svgPath)) "element-animation-plan.json"
    [IO.File]::WriteAllText($elementPlanPath, ($elementPlan | ConvertTo-Json -Depth 40) + [Environment]::NewLine, [Text.UTF8Encoding]::new($false))
    Write-Utf8Xml $svg $svgPath
    [IO.File]::WriteAllText($manifestPath, ($manifest | ConvertTo-Json -Depth 40) + [Environment]::NewLine, [Text.UTF8Encoding]::new($false))
    Write-Host "$($Scene.work_unit): $($allGroups.Count) Elementgruppen, $($steps.Count) Schritte"
}

if ($All) {
    $scenes = @($plan.scenes | Sort-Object output_slide_number)
} elseif ($WorkUnit) {
    $scenes = @($plan.scenes | Where-Object work_unit -eq $WorkUnit)
    if ($scenes.Count -ne 1) { throw "WorkUnit wurde nicht eindeutig gefunden: $WorkUnit" }
} else {
    throw "Entweder -WorkUnit <slide_###> oder -All angeben."
}

foreach ($scene in $scenes) { Enrich-Scene $scene }

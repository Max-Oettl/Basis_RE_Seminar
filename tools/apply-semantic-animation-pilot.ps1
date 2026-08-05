param(
    [Parameter(Mandatory = $true)]
    [string]$PilotPlan
)

$ErrorActionPreference = "Stop"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$pilotPath = (Resolve-Path $PilotPlan).Path
$pilot = Get-Content -LiteralPath $pilotPath -Raw -Encoding UTF8 | ConvertFrom-Json
$scenePlanPath = Join-Path $repoRoot ($pilot.scene_plan -replace "/", "\")
$scenePlan = Get-Content -LiteralPath $scenePlanPath -Raw -Encoding UTF8 | ConvertFrom-Json
$svgNamespace = "http://www.w3.org/2000/svg"

function Write-Utf8Text([string]$Path, [string]$Content) {
    [IO.File]::WriteAllText($Path, $Content, [Text.UTF8Encoding]::new($false))
}

function Write-Utf8Json([string]$Path, $Value) {
    Write-Utf8Text $Path (($Value | ConvertTo-Json -Depth 100) + "`n")
}

function Write-Utf8Xml([xml]$Xml, [string]$Path) {
    $settings = [Xml.XmlWriterSettings]::new()
    $settings.Encoding = [Text.UTF8Encoding]::new($false)
    $settings.Indent = $true
    $settings.IndentChars = "  "
    $settings.NewLineChars = "`n"
    $settings.NewLineHandling = [Xml.NewLineHandling]::Replace
    $settings.OmitXmlDeclaration = $false
    $writer = [Xml.XmlWriter]::Create($Path, $settings)
    try { $Xml.Save($writer) } finally { $writer.Dispose() }
}

function Normalize-Text([string]$Text) {
    return ([regex]::Replace([string]$Text, "\s+", " ")).Trim()
}

function Unwrap-Node($Node) {
    $parent = $Node.ParentNode
    foreach ($child in @($Node.ChildNodes)) {
        [void]$parent.InsertBefore($child, $Node)
    }
    [void]$parent.RemoveChild($Node)
}

function Remove-Legacy-AnimationMetadata([xml]$Svg) {
    foreach ($node in @($Svg.SelectNodes('//*[@data-anim-target="true"]'))) {
        $node.RemoveAttribute("data-anim-target")
        $node.RemoveAttribute("data-anim-label")
        $node.RemoveAttribute("data-anim-kind")
        $node.RemoveAttribute("data-static-state")
        if ($node.Attributes["style"] -and $node.Attributes["style"].Value -match "visibility\s*:\s*hidden|opacity\s*:\s*0") {
            $node.RemoveAttribute("style")
        }
    }
}

function Restore-SemanticFragments([xml]$Svg) {
    foreach ($fragment in @($Svg.SelectNodes('//*[@data-semantic-fragment-source]'))) {
        $sourceId = $fragment.Attributes["data-semantic-fragment-source"].Value
        $startIndex = [int]$fragment.Attributes["data-semantic-fragment-start"].Value
        $source = $Svg.SelectSingleNode("//*[@id='$sourceId']")
        if (-not $source) { throw "Quellgruppe fuer Fragment fehlt: $sourceId" }
        $sourceElements = @($source.ChildNodes | Where-Object { $_.NodeType -eq [Xml.XmlNodeType]::Element })
        $anchor = if ($startIndex -lt $sourceElements.Count) { $sourceElements[$startIndex] } else { $null }
        foreach ($child in @($fragment.ChildNodes | Where-Object { $_.NodeType -eq [Xml.XmlNodeType]::Element })) {
            if ($anchor) {
                [void]$source.InsertBefore($child, $anchor)
            } else {
                [void]$source.AppendChild($child)
            }
        }
        [void]$fragment.ParentNode.RemoveChild($fragment)
    }
}

function New-SemanticFragments([xml]$Svg, $PilotScene) {
    $fragments = @($PilotScene.fragments | Sort-Object start_index -Descending)
    foreach ($definition in $fragments) {
        $source = $Svg.SelectSingleNode("//*[@id='$($definition.source_id)']")
        if (-not $source) { throw "Quellgruppe fuer Fragment fehlt: $($definition.source_id)" }
        $elements = @($source.ChildNodes | Where-Object { $_.NodeType -eq [Xml.XmlNodeType]::Element })
        $start = [int]$definition.start_index
        $end = [int]$definition.end_index
        if ($start -lt 0 -or $end -lt $start -or $end -ge $elements.Count) {
            throw "Ungueltiger Fragmentbereich $start..$end in $($definition.source_id) mit $($elements.Count) Elementen."
        }
        $selected = @($elements[$start..$end])
        $actualTexts = @($selected | ForEach-Object { Normalize-Text $_.InnerText })
        $expectedTexts = @($definition.expected_texts | ForEach-Object { Normalize-Text $_ })
        if (($actualTexts -join "|") -ne ($expectedTexts -join "|")) {
            throw "Fragment $($definition.fragment_id) stimmt nicht mit den erwarteten Textgrenzen ueberein: '$($actualTexts -join " | ")'."
        }
        $fragment = $Svg.CreateElement("g", $svgNamespace)
        $fragment.SetAttribute("id", $definition.fragment_id)
        $fragment.SetAttribute("data-semantic-fragment-source", $definition.source_id)
        $fragment.SetAttribute("data-semantic-fragment-start", [string]$start)
        $fragment.SetAttribute("data-qc-group", "atomic_list_fragment")
        if ($source.NextSibling) {
            [void]$source.ParentNode.InsertBefore($fragment, $source.NextSibling)
        } else {
            [void]$source.ParentNode.AppendChild($fragment)
        }
        foreach ($node in $selected) { [void]$fragment.AppendChild($node) }
    }
}

function Resolve-MemberNodes([xml]$Svg, $Member) {
    if ($Member.id) {
        $node = $Svg.SelectSingleNode("//*[@id='$($Member.id)']")
        if (-not $node) { throw "SVG-Mitglied fehlt: $($Member.id)" }
        return @($node)
    }

    if ($Member.parent_id -and $Member.texts) {
        $parent = $Svg.SelectSingleNode("//*[@id='$($Member.parent_id)']")
        if (-not $parent) { throw "SVG-Elterngruppe fehlt: $($Member.parent_id)" }
        $resolved = [Collections.Generic.List[Xml.XmlNode]]::new()
        foreach ($expected in @($Member.texts)) {
            $matches = @($parent.SelectNodes('./*[local-name()="text"]') | Where-Object {
                (Normalize-Text $_.InnerText) -eq (Normalize-Text $expected)
            })
            if ($matches.Count -ne 1) {
                throw "Textmitglied '$expected' in $($Member.parent_id) wurde $($matches.Count)-mal gefunden."
            }
            $resolved.Add($matches[0])
        }
        return @($resolved)
    }

    throw "Unbekannte Mitgliedsdefinition im Pilotplan."
}

function Get-MemberDescriptions($Group) {
    $descriptions = [Collections.Generic.List[string]]::new()
    foreach ($member in @($Group.members)) {
        if ($member.id) {
            $descriptions.Add([string]$member.id)
        } else {
            foreach ($text in @($member.texts)) {
                $descriptions.Add("$($member.parent_id)::text[$text]")
            }
        }
    }
    return @($descriptions)
}

function New-ManifestStep($Group, [int]$Order) {
    $step = [ordered]@{
        stepId = "$($Group.action)_$($Group.group_id)"
        targetId = $Group.group_id
        action = $Group.action
        sourceText = $Group.source_text
        occurrence = 1
        confidence = "high"
        notes = "Semantisch geplante Fachgruppe; Trigger aus dem vollstaendigen Sprechertext."
    }
    switch ($Group.action) {
        "show" { $step.enterFrames = 16 }
        "draw" {
            $step.drawDurFrames = 36
            $step.drawStyle = "reveal"
            $step.direction = "leftToRight"
        }
        "highlight" {
            $step.highlightDurFrames = 30
            $step.stroke = "#F2A93B"
            $step.strokeWidth = 4
        }
        "hide" { $step.exitFrames = 12 }
        "transform" {
            $step.transformDurFrames = 30
            $step.transformOrigin = "center"
        }
    }
    return $step
}

function Apply-Scene($PilotScene, $Scene) {
    $svgPath = Join-Path $repoRoot ($Scene.target_svg -replace "/", "\")
    $manifestPath = Join-Path $repoRoot ($Scene.internal_manifest -replace "/", "\")
    $elementPlanPath = Join-Path $repoRoot ($Scene.element_animation_plan -replace "/", "\")
    [xml]$svg = Get-Content -LiteralPath $svgPath -Raw -Encoding UTF8

    foreach ($group in @($PilotScene.groups)) {
        $existing = $svg.SelectSingleNode("//*[@id='$($group.group_id)']")
        if ($existing) { Unwrap-Node $existing }
    }
    Restore-SemanticFragments $svg
    Remove-Legacy-AnimationMetadata $svg
    New-SemanticFragments $svg $PilotScene

    $targets = [Collections.Generic.List[object]]::new()
    $steps = [Collections.Generic.List[object]]::new()
    $semanticGroups = [Collections.Generic.List[object]]::new()
    $usedNodes = [Collections.Generic.HashSet[Xml.XmlNode]]::new()

    if ($PilotScene.decision -eq "animated") {
        $order = 0
        foreach ($group in @($PilotScene.groups)) {
            $order += 1
            $nodes = [Collections.Generic.List[Xml.XmlNode]]::new()
            foreach ($member in @($group.members)) {
                foreach ($node in @(Resolve-MemberNodes $svg $member)) {
                    if (-not $usedNodes.Add($node)) {
                        throw "SVG-Knoten wurde mehreren Gruppen zugewiesen: $($group.group_id)"
                    }
                    $nodes.Add($node)
                }
            }
            if ($nodes.Count -eq 0) { throw "Leere semantische Gruppe: $($group.group_id)" }
            $parent = $nodes[0].ParentNode
            if (@($nodes | Where-Object { $_.ParentNode -ne $parent }).Count -gt 0) {
                throw "Mitglieder von $($group.group_id) besitzen keinen gemeinsamen SVG-Elternknoten."
            }
            $orderedNodes = @($parent.ChildNodes | Where-Object { $usedNodes.Contains($_) -and $nodes.Contains($_) })
            $wrapper = $svg.CreateElement("g", $svgNamespace)
            $wrapper.SetAttribute("id", $group.group_id)
            $wrapper.SetAttribute("data-anim-target", "true")
            $wrapper.SetAttribute("data-anim-label", $group.label)
            $wrapper.SetAttribute("data-anim-kind", "semantic_group")
            $wrapper.SetAttribute("data-qc-group", "source_content")
            $wrapper.SetAttribute("data-semantic-role", $group.role)
            $wrapper.SetAttribute("data-source-slide", (@($Scene.source_slides) -join ","))
            [void]$parent.InsertBefore($wrapper, $orderedNodes[0])
            foreach ($node in $orderedNodes) { [void]$wrapper.AppendChild($node) }

            $targets.Add([ordered]@{
                targetId = $group.group_id
                label = $group.label
                status = "animated"
                visibleInEditor = $true
                render = $true
                confidence = "high"
            })
            $steps.Add((New-ManifestStep $group $order))
            $semanticGroups.Add([ordered]@{
                group_id = $group.group_id
                label = $group.label
                role = $group.role
                members = @(Get-MemberDescriptions $group)
            })
        }
    }

    $manifest = [ordered]@{
        schemaVersion = "svgAnimationManifest/v1"
        svgPath = [IO.Path]::GetFileName($svgPath)
        defaults = [ordered]@{
            enterFrames = 16
            exitFrames = 12
            highlightDurFrames = 30
            drawDurFrames = 36
            transformDurFrames = 30
        }
        targets = @($targets)
        steps = @($steps)
    }

    $elementPlan = [ordered]@{
        schema_version = "basisReSemanticAnimationPlan/v2"
        module_id = $pilot.module_id
        work_unit = $Scene.work_unit
        scene_id = $Scene.scene_id
        source_slides = @($Scene.source_slides)
        planning_basis = [ordered]@{
            pilot_plan = $PilotPlan -replace "\\", "/"
            workflow = "workflow/50-animation/animation-decision-and-dramaturgy.md"
            spoken_text_reviewed = $true
            source_svg_reviewed = $true
            heuristic_grouping_used = $false
        }
        decision = $PilotScene.decision
        rationale = $PilotScene.rationale
        narrative_beats = @($PilotScene.narrative_beats)
        semantic_groups = @($semanticGroups)
        steps = @($steps)
        qa = [ordered]@{
            issues = @()
            warnings = @()
            open_questions = @()
        }
    }

    $Scene.animation_plan = [pscustomobject][ordered]@{
        decision = $PilotScene.decision
        rationale = $PilotScene.rationale
        strategy = if ($PilotScene.decision -eq "animated") { "semantic_reveal" } else { "static" }
        state_count = if ($PilotScene.decision -eq "animated") { $semanticGroups.Count + 1 } else { 1 }
        public_targets = @($semanticGroups | ForEach-Object { $_.group_id })
        semantic_groups = @($semanticGroups)
        steps = @($PilotScene.groups | ForEach-Object -Begin { $index = 0 } -Process {
            $index += 1
            [ordered]@{
                order = $index
                target_id = $_.group_id
                action = $_.action
                source_text = $_.source_text
            }
        })
    }

    Write-Utf8Xml $svg $svgPath
    Write-Utf8Json $manifestPath $manifest
    Write-Utf8Json $elementPlanPath $elementPlan
    Write-Output "$($Scene.work_unit): $($PilotScene.decision), $($steps.Count) Schritte"
}

$pilotByWorkUnit = @{}
foreach ($pilotScene in @($pilot.scenes)) { $pilotByWorkUnit[$pilotScene.work_unit] = $pilotScene }

foreach ($scene in @($scenePlan.scenes)) {
    if ($pilotByWorkUnit.ContainsKey($scene.work_unit)) {
        Apply-Scene $pilotByWorkUnit[$scene.work_unit] $scene
    } elseif (-not $scene.animation_plan.decision) {
        $scene.animation_plan = [pscustomobject][ordered]@{
            decision = "needs_review"
            rationale = "Semantische Animationsentscheidung steht fuer diese Szene noch aus."
            strategy = "unplanned"
            state_count = 0
            public_targets = @()
            semantic_groups = @()
            steps = @()
        }
    }
}

Write-Utf8Json $scenePlanPath $scenePlan

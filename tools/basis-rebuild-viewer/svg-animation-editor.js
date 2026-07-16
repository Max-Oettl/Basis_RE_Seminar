(() => {
  "use strict";

  const domain = window.SvgAnimationDomain;
  const SVG_NS = "http://www.w3.org/2000/svg";
  const query = new URLSearchParams(location.search);

  const state = {
    slideId: query.get("id") || "",
    data: null,
    manifest: null,
    inventory: [],
    issues: [],
    diagnosticIssues: [],
    spokenText: "",
    svgSource: "",
    selectedTargetId: "",
    collapsed: new Set(),
    dirty: false,
    saving: false,
    readOnly: false,
    saveBlocked: false,
  };

  const elements = {
    app: document.querySelector("#editorApp"),
    sceneTitle: document.querySelector("#sceneTitle"),
    svgPath: document.querySelector("#svgPath"),
    triggerCount: document.querySelector("#triggerCount"),
    issueCount: document.querySelector("#issueCount"),
    saveState: document.querySelector("#saveState"),
    saveButton: document.querySelector("#saveButton"),
    backButton: document.querySelector("#backButton"),
    svgStage: document.querySelector("#svgStage"),
    selectedPreviewId: document.querySelector("#selectedPreviewId"),
    inventoryCount: document.querySelector("#inventoryCount"),
    structureSummary: document.querySelector("#structureSummary"),
    structureTree: document.querySelector("#structureTree"),
    selectionDetails: document.querySelector("#selectionDetails"),
    issuesList: document.querySelector("#issuesList"),
    issuesRemainder: document.querySelector("#issuesRemainder"),
    collapseAllButton: document.querySelector("#collapseAllButton"),
    animateAllButton: document.querySelector("#animateAllButton"),
    animateNoneButton: document.querySelector("#animateNoneButton"),
    showAllButton: document.querySelector("#showAllButton"),
    hideAllButton: document.querySelector("#hideAllButton"),
    fatalError: document.querySelector("#fatalError"),
    fatalErrorText: document.querySelector("#fatalErrorText"),
    fatalBackButton: document.querySelector("#fatalBackButton"),
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function child(tagName, className = "", text = "") {
    const node = document.createElement(tagName);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function icon(name) {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    const paths = {
      chevron: ["M9 18l6-6-6-6"],
      eye: ["M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12", "M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6"],
      eyeOff: ["M3 3l18 18", "M10.6 10.6a2 2 0 0 0 2.8 2.8", "M9.9 4.2A10.5 10.5 0 0 1 12 4c6.5 0 10 8 10 8a18 18 0 0 1-2.2 3.3", "M6.6 6.6C3.7 8.5 2 12 2 12s3.5 8 10 8a9.7 9.7 0 0 0 4.1-.9"],
    };
    for (const pathData of paths[name] || []) {
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", pathData);
      svg.append(path);
    }
    return svg;
  }

  function targetById(targetId) {
    return state.manifest?.targets.find((target) => target.targetId === targetId) || null;
  }

  function stepCount(targetId) {
    return state.manifest?.steps.filter((step) => step.targetId === targetId).length || 0;
  }

  function relationData() {
    return domain.inventoryRelations(state.inventory);
  }

  function groupIds() {
    const { childrenById } = relationData();
    return [...childrenById.entries()]
      .filter(([, children]) => children.length)
      .map(([targetId]) => targetId);
  }

  function isEditorTarget(targetId) {
    const target = targetById(targetId);
    if (!target || !domain.isEffectivelyRendered(state.manifest, state.inventory, targetId)) return false;
    return target.visibleInEditor !== false || stepCount(targetId) > 0;
  }

  function blockingParent(targetId) {
    return domain
      .ancestorIds(state.inventory, targetId)
      .find((parentId) => targetById(parentId)?.render === false) || "";
  }

  function nearestEditorParent(targetId) {
    return domain
      .ancestorIds(state.inventory, targetId)
      .find((parentId) => isEditorTarget(parentId)) || "";
  }

  function ensureDraftTarget(draft, item) {
    let target = draft.targets.find((candidate) => candidate.targetId === item.targetId);
    if (!target) {
      target = {
        targetId: item.targetId,
        label: item.label || domain.labelFromTargetId(item.targetId),
        status: "needsReview",
      };
      draft.targets.push(target);
    }
    return target;
  }

  function diagnosticIssues(payloadIssues) {
    const diagnosticCodes = new Set([
      "svg-script",
      "svg-foreign-object",
      "duplicate-id",
      "shared-narration-section",
    ]);
    return (payloadIssues || []).filter((issue) => diagnosticCodes.has(issue.code));
  }

  function refreshIssues() {
    const schemaIssues = domain.validateManifest(state.manifest).map((error) => ({
      code: "manifest-schema",
      severity: "error",
      message: `${error.path}: ${error.message}`,
    }));
    state.issues = domain.collectIssues(
      state.manifest,
      state.inventory,
      state.spokenText,
      [...state.diagnosticIssues, ...schemaIssues],
    );
    state.saveBlocked = state.issues.some((issue) =>
      issue.severity === "error" || issue.code === "duplicate-id",
    );
  }

  function setSaveState(text, tone = "") {
    elements.saveState.textContent = text;
    elements.saveState.className = `save-state${tone ? ` ${tone}` : ""}`;
  }

  function renderHeader() {
    elements.triggerCount.textContent = `${state.manifest?.steps.length || 0} Trigger`;
    elements.issueCount.textContent = `${state.issues.length} Hinweis${state.issues.length === 1 ? "" : "e"}`;
    const editorTargets = state.inventory.filter((item) => isEditorTarget(item.targetId)).length;
    elements.inventoryCount.textContent = `${state.inventory.length} IDs`;
    elements.structureSummary.textContent = `${editorTargets} Animation · ${state.inventory.length} IDs`;

    if (state.saving) {
      setSaveState("Speichere…");
    } else if (state.readOnly) {
      setSaveState("Schreibgeschützt", "error");
    } else if (state.saveBlocked) {
      setSaveState("Speichern blockiert", "error");
    } else if (state.dirty) {
      setSaveState("Ungespeichert", "dirty");
    } else {
      setSaveState("Gespeichert", "ok");
    }

    elements.saveButton.disabled =
      state.readOnly || state.saveBlocked || state.saving || !state.dirty;
    for (const button of [
      elements.animateAllButton,
      elements.animateNoneButton,
      elements.showAllButton,
      elements.hideAllButton,
    ]) {
      button.disabled = state.readOnly || state.saving;
    }
  }

  function sanitizeSvgDocument(source) {
    const parsed = new DOMParser().parseFromString(source, "image/svg+xml");
    if (parsed.querySelector("parsererror") || parsed.documentElement?.localName?.toLowerCase() !== "svg") {
      throw new Error("Das SVG konnte nicht als gültiges XML gelesen werden.");
    }

    parsed.querySelectorAll("script, foreignObject, iframe, object, embed").forEach((node) => node.remove());
    parsed.querySelectorAll("style").forEach((style) => {
      if (/@import|javascript:|url\(\s*['\"]?(?:https?:|\/\/)/i.test(style.textContent || "")) {
        style.remove();
      }
    });
    parsed.querySelectorAll("*").forEach((node) => {
      for (const attribute of [...node.attributes]) {
        const name = attribute.name.toLowerCase();
        const value = attribute.value.trim();
        if (name.startsWith("on")) {
          node.removeAttribute(attribute.name);
          continue;
        }
        if (["href", "xlink:href", "src"].includes(name)) {
          if (/^(?:javascript:|vbscript:|data:text\/html|https?:|\/\/)/i.test(value)) {
            node.removeAttribute(attribute.name);
          }
          continue;
        }
        if (name === "style" && /javascript:|url\(\s*['\"]?(?:https?:|\/\/)/i.test(value)) {
          node.removeAttribute(attribute.name);
        }
      }
    });

    const root = parsed.documentElement;
    root.removeAttribute("width");
    root.removeAttribute("height");
    if (!root.getAttribute("preserveAspectRatio")) root.setAttribute("preserveAspectRatio", "xMidYMid meet");
    return document.importNode(root, true);
  }

  function svgIdMap(root) {
    const nodes = [root, ...root.querySelectorAll("[id]")];
    return new Map(nodes.filter((node) => node.id).map((node) => [node.id, node]));
  }

  function selectTarget(targetId) {
    if (!state.inventory.some((item) => item.targetId === targetId)) return;
    state.selectedTargetId = targetId;
    for (const parentId of domain.ancestorIds(state.inventory, targetId)) {
      state.collapsed.delete(parentId);
    }
    renderAll();
  }

  function renderPreview() {
    if (!state.svgSource) return;
    try {
      const root = sanitizeSvgDocument(state.svgSource);
      let idMap = svgIdMap(root);
      for (const target of state.manifest.targets) {
        if (target.render !== false) continue;
        const node = idMap.get(target.targetId);
        if (!node || !root.contains(node)) continue;
        if (node === root) node.style.display = "none";
        else node.remove();
      }

      idMap = svgIdMap(root);
      const selected = idMap.get(state.selectedTargetId);
      if (selected) {
        selected.classList.add("svg-inspector-selected");
        selected.querySelectorAll("[id]").forEach((node) => node.classList.add("svg-inspector-selected"));
      }

      root.addEventListener("click", (event) => {
        const target = event.target instanceof Element ? event.target.closest("[id]") : null;
        if (!target || !root.contains(target)) return;
        event.preventDefault();
        event.stopPropagation();
        selectTarget(target.id);
      });
      root.addEventListener("pointerover", (event) => {
        const target = event.target instanceof Element ? event.target.closest("[id]") : null;
        if (target && root.contains(target)) target.classList.add("svg-inspector-hover");
      });
      root.addEventListener("pointerout", (event) => {
        const target = event.target instanceof Element ? event.target.closest("[id]") : null;
        if (target) target.classList.remove("svg-inspector-hover");
      });

      elements.svgStage.replaceChildren(root);
      elements.selectedPreviewId.textContent = state.selectedTargetId || "Keine ID ausgewählt";
    } catch (error) {
      elements.svgStage.replaceChildren(child("div", "empty-state", error.message));
    }
  }

  function rowStatus(item) {
    const target = targetById(item.targetId);
    const count = stepCount(item.targetId);
    const rendered = domain.isEffectivelyRendered(state.manifest, state.inventory, item.targetId);
    if (!rendered) return { label: "Ausgeblendet", tone: "hidden" };
    if (count) return { label: `${count} Trigger`, tone: "steps" };
    if (isEditorTarget(item.targetId)) return { label: "Animation", tone: "animation" };
    const parentId = nearestEditorParent(item.targetId);
    if (parentId) return { label: `Erbt: ${parentId}`, tone: "" };
    if (target?.status === "orphaned") return { label: "Orphaned", tone: "hidden" };
    return { label: "Nicht in Animation", tone: "" };
  }

  function toggleEditorTarget(item, visible) {
    if (state.readOnly) return;
    state.manifest = domain.setEditorVisibility(
      state.manifest,
      state.inventory,
      item.targetId,
      visible,
    );
    markDirty();
  }

  function toggleRenderTarget(item) {
    if (state.readOnly) return;
    const target = targetById(item.targetId);
    const parentId = blockingParent(item.targetId);
    if (parentId) return;
    const nextVisible = target?.render === false || !domain.isEffectivelyRendered(
      state.manifest,
      state.inventory,
      item.targetId,
    );
    if (!nextVisible) {
      const ids = domain.descendantIds(state.inventory, item.targetId, true);
      const affectedSteps = state.manifest.steps.filter((step) => ids.has(step.targetId)).length;
      if (
        affectedSteps &&
        !window.confirm(`${affectedSteps} Trigger dieses Elements oder seiner Unterelemente werden aus dem Draft entfernt. Fortfahren?`)
      ) {
        return;
      }
    }
    state.manifest = domain.setRenderVisibility(
      state.manifest,
      state.inventory,
      item.targetId,
      nextVisible,
    );
    markDirty();
  }

  function createStructureRow(item, depth, hasChildren) {
    const row = child("div", `structure-row${state.selectedTargetId === item.targetId ? " selected" : ""}`);
    row.setAttribute("role", "treeitem");
    row.setAttribute("aria-level", String(depth + 1));
    row.setAttribute("aria-selected", String(state.selectedTargetId === item.targetId));
    row.tabIndex = 0;

    if (hasChildren) {
      const toggle = child("button", `tree-toggle${state.collapsed.has(item.targetId) ? "" : " expanded"}`);
      toggle.type = "button";
      toggle.setAttribute("aria-label", state.collapsed.has(item.targetId) ? "Gruppe aufklappen" : "Gruppe einklappen");
      toggle.append(icon("chevron"));
      toggle.addEventListener("click", (event) => {
        event.stopPropagation();
        if (state.collapsed.has(item.targetId)) state.collapsed.delete(item.targetId);
        else state.collapsed.add(item.targetId);
        renderTree();
      });
      row.append(toggle);
    } else {
      row.append(child("span"));
    }

    const editorLabel = child("label", "animation-toggle");
    const editorInput = document.createElement("input");
    editorInput.type = "checkbox";
    editorInput.checked = isEditorTarget(item.targetId);
    editorInput.disabled =
      state.readOnly ||
      !domain.isEffectivelyRendered(state.manifest, state.inventory, item.targetId) ||
      stepCount(item.targetId) > 0;
    editorInput.setAttribute("aria-label", `${item.targetId} im Animationstab anzeigen`);
    editorInput.addEventListener("click", (event) => event.stopPropagation());
    editorInput.addEventListener("change", () => toggleEditorTarget(item, editorInput.checked));
    editorLabel.append(editorInput, child("span", "", editorInput.checked ? "aktiv" : "aus"));
    row.append(editorLabel);

    const parentId = blockingParent(item.targetId);
    const rendered = domain.isEffectivelyRendered(state.manifest, state.inventory, item.targetId);
    const visibilityButton = child(
      "button",
      `visibility-toggle ${rendered ? "visible" : "hidden"}`,
    );
    visibilityButton.type = "button";
    visibilityButton.disabled = state.readOnly || Boolean(parentId);
    visibilityButton.setAttribute("aria-label", rendered ? `${item.targetId} ausblenden` : `${item.targetId} anzeigen`);
    visibilityButton.append(icon(rendered ? "eye" : "eyeOff"));
    visibilityButton.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleRenderTarget(item);
    });
    row.append(visibilityButton);

    const targetCell = child("div", "target-cell");
    targetCell.style.setProperty("--tree-depth", depth);
    targetCell.append(
      child("span", "target-id", item.targetId),
      child("span", "target-tag", item.tagName),
    );
    const status = rowStatus(item);
    targetCell.append(child("span", `status-chip ${status.tone}`.trim(), status.label));
    row.append(targetCell);

    row.addEventListener("click", () => selectTarget(item.targetId));
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectTarget(item.targetId);
      }
    });
    return row;
  }

  function renderTree() {
    const { byId, childrenById } = relationData();
    const roots = state.inventory.filter((item) => !item.parentTargetId || !byId.has(item.parentTargetId));
    const fragment = document.createDocumentFragment();

    function appendItem(item, depth) {
      const childIds = childrenById.get(item.targetId) || [];
      fragment.append(createStructureRow(item, depth, childIds.length > 0));
      if (state.collapsed.has(item.targetId)) return;
      childIds.forEach((childId) => {
        const childItem = byId.get(childId);
        if (childItem) appendItem(childItem, depth + 1);
      });
    }

    roots.forEach((item) => appendItem(item, 0));
    elements.structureTree.replaceChildren(fragment);
    const groups = groupIds();
    const allCollapsed = groups.length > 0 && groups.every((targetId) => state.collapsed.has(targetId));
    elements.collapseAllButton.textContent = allCollapsed ? "Alles aufklappen" : "Alles einklappen";
  }

  function renderSelectionDetails() {
    const item = state.inventory.find((candidate) => candidate.targetId === state.selectedTargetId);
    if (!item) {
      const title = child("strong", "", "Keine SVG-ID ausgewählt");
      const text = child("p", "", "Wähle eine Zeile oder ein Element in der Vorschau.");
      elements.selectionDetails.replaceChildren(title, text);
      return;
    }
    const target = targetById(item.targetId);
    const rendered = domain.isEffectivelyRendered(state.manifest, state.inventory, item.targetId);
    const parentId = blockingParent(item.targetId) || nearestEditorParent(item.targetId);
    const title = child("strong", "", item.targetId);
    const details = [
      `${rendered ? "Gerendert" : "Nicht gerendert"}`,
      `${isEditorTarget(item.targetId) ? "eigenes Editorziel" : parentId ? `erbt von ${parentId}` : "kein eigenes Editorziel"}`,
      `${stepCount(item.targetId)} Trigger`,
      `Status ${target?.status || "nicht im Manifest"}`,
    ].join(" · ");
    const text = child("p", "", details);
    elements.selectionDetails.replaceChildren(title, text);
  }

  function renderIssues() {
    const limit = 50;
    const visible = state.issues.slice(0, limit);
    const fragment = document.createDocumentFragment();
    for (const issue of visible) {
      const item = child("li", issue.severity || "info", issue.message);
      if (issue.targetId && state.inventory.some((target) => target.targetId === issue.targetId)) {
        item.tabIndex = 0;
        item.setAttribute("role", "button");
        item.addEventListener("click", () => selectTarget(issue.targetId));
      }
      fragment.append(item);
    }
    if (!visible.length) fragment.append(child("li", "", "Keine Hinweise für den aktuellen Draft."));
    elements.issuesList.replaceChildren(fragment);
    const remainder = Math.max(0, state.issues.length - visible.length);
    elements.issuesRemainder.textContent = remainder ? `${remainder} weitere` : "";
  }

  function renderAll() {
    refreshIssues();
    renderHeader();
    renderPreview();
    renderTree();
    renderSelectionDetails();
    renderIssues();
  }

  function markDirty() {
    state.dirty = true;
    renderAll();
  }

  function applyBulkManifest(draft) {
    state.manifest = domain.syncManifest(draft, state.inventory, state.manifest.svgPath);
    markDirty();
  }

  function animateAll() {
    const draft = clone(state.manifest);
    for (const item of state.inventory) {
      if (!domain.isEffectivelyRendered(state.manifest, state.inventory, item.targetId)) continue;
      const target = ensureDraftTarget(draft, item);
      delete target.visibleInEditor;
      delete target.render;
      if (target.status === "orphaned") target.status = "needsReview";
    }
    applyBulkManifest(draft);
  }

  function animateNone() {
    const draft = clone(state.manifest);
    const stepTargets = new Set(draft.steps.map((step) => step.targetId));
    for (const item of state.inventory) {
      if (!domain.isEffectivelyRendered(state.manifest, state.inventory, item.targetId)) continue;
      if (stepTargets.has(item.targetId)) continue;
      ensureDraftTarget(draft, item).visibleInEditor = false;
    }
    applyBulkManifest(draft);
  }

  function showAll() {
    const draft = clone(state.manifest);
    for (const target of draft.targets) {
      if (target.render !== false) continue;
      delete target.render;
      delete target.visibleInEditor;
      if (target.status === "orphaned") target.status = "needsReview";
    }
    applyBulkManifest(draft);
  }

  function hideAll() {
    if (
      !window.confirm(
        `Alle SVG-Elemente werden im Draft ausgeblendet und ${state.manifest.steps.length} Trigger entfernt. Fortfahren?`,
      )
    ) {
      return;
    }
    const draft = clone(state.manifest);
    const { byId } = relationData();
    const roots = state.inventory.filter((item) => !item.parentTargetId || !byId.has(item.parentTargetId));
    for (const item of roots) {
      const target = ensureDraftTarget(draft, item);
      target.render = false;
      target.visibleInEditor = false;
    }
    draft.steps = [];
    applyBulkManifest(draft);
  }

  function toggleCollapseAll() {
    const groups = groupIds();
    const allCollapsed = groups.length > 0 && groups.every((targetId) => state.collapsed.has(targetId));
    state.collapsed = allCollapsed ? new Set() : new Set(groups);
    renderTree();
  }

  async function responseJson(response) {
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const details = Array.isArray(payload.details)
        ? ` ${payload.details.map((detail) => detail.message || detail.path).filter(Boolean).join(" ")}`
        : "";
      throw new Error(`${payload.error || `HTTP ${response.status}`}${details}`.trim());
    }
    return payload;
  }

  async function save() {
    if (elements.saveButton.disabled) return;
    state.saving = true;
    renderHeader();
    try {
      const response = await fetch("/api/svg-animation-manifest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: state.slideId, manifest: state.manifest }),
      });
      const payload = await responseJson(response);
      const next = payload.svgAnimation;
      state.data = next;
      state.manifest = next.manifest;
      state.inventory = next.inventory;
      state.spokenText = next.spokenText || "";
      state.diagnosticIssues = diagnosticIssues(next.issues);
      state.readOnly = Boolean(next.readOnly);
      state.dirty = false;
      state.saving = false;
      renderAll();
    } catch (error) {
      state.saving = false;
      setSaveState(error.message, "error");
      elements.saveButton.disabled = false;
    }
  }

  function returnToViewer() {
    if (state.dirty && !window.confirm("Ungespeicherte Änderungen verwerfen und zum Viewer zurückkehren?")) {
      return;
    }
    location.href = state.slideId ? `/#${encodeURIComponent(state.slideId)}` : "/";
  }

  function showFatalError(error) {
    elements.app.hidden = true;
    elements.fatalError.hidden = false;
    elements.fatalErrorText.textContent = error.message || String(error);
  }

  async function initialize() {
    if (!domain) throw new Error("Die gemeinsame SVG-Animationsdomain konnte nicht geladen werden.");
    if (!state.slideId) throw new Error("In der URL fehlt die Slide-ID.");

    const editorResponse = await fetch(
      `/api/svg-animation-editor?id=${encodeURIComponent(state.slideId)}&v=${Date.now()}`,
    );
    const editorPayload = await responseJson(editorResponse);
    const data = editorPayload.svgAnimation;
    const svgResponse = await fetch(`${data.svg.assetUrl}?v=${Date.now()}`);
    if (!svgResponse.ok) throw new Error(`SVG konnte nicht geladen werden (HTTP ${svgResponse.status}).`);

    state.data = data;
    state.manifest = data.manifest;
    state.inventory = data.inventory;
    state.spokenText = data.spokenText || "";
    state.svgSource = await svgResponse.text();
    state.diagnosticIssues = diagnosticIssues(data.issues);
    state.readOnly = Boolean(data.readOnly);
    state.saveBlocked = Boolean(data.saveBlocked);
    state.collapsed = new Set(groupIds());
    state.selectedTargetId =
      state.manifest.targets.find((target) => target.status === "needsReview")?.targetId ||
      state.manifest.targets[0]?.targetId ||
      state.inventory[0]?.targetId ||
      "";
    for (const parentId of domain.ancestorIds(state.inventory, state.selectedTargetId)) {
      state.collapsed.delete(parentId);
    }

    document.title = `${data.slide.title || data.slide.slideId} · SVG-Struktur`;
    elements.sceneTitle.textContent = data.slide.title || data.slide.slideId;
    elements.svgPath.textContent = `${data.svg.path} · ${data.svg.manifestPath}`;
    elements.app.setAttribute("aria-busy", "false");
    renderAll();
  }

  elements.saveButton.addEventListener("click", save);
  elements.backButton.addEventListener("click", returnToViewer);
  elements.fatalBackButton.addEventListener("click", returnToViewer);
  elements.collapseAllButton.addEventListener("click", toggleCollapseAll);
  elements.animateAllButton.addEventListener("click", animateAll);
  elements.animateNoneButton.addEventListener("click", animateNone);
  elements.showAllButton.addEventListener("click", showAll);
  elements.hideAllButton.addEventListener("click", hideAll);
  window.addEventListener("beforeunload", (event) => {
    if (!state.dirty) return;
    event.preventDefault();
    event.returnValue = "";
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") returnToViewer();
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      save();
    }
  });

  initialize().catch(showFatalError);
})();

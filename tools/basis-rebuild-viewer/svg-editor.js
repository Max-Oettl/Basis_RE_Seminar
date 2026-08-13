(() => {
  "use strict";

  const domain = window.SvgEditorDomain;
  const SVG_NS = "http://www.w3.org/2000/svg";
  const XLINK_NS = "http://www.w3.org/1999/xlink";
  const query = new URLSearchParams(location.search);

  const state = {
    slideId: query.get("id") || "",
    data: null,
    document: null,
    sourcePrefix: "",
    svgPath: "",
    expectedSha256: "",
    formulaAssets: new Map(),
    selectedPath: "",
    selectedPaths: [],
    referencePath: "",
    referencePicking: false,
    activeTab: "element",
    collapsed: new Set(),
    layersCollapsed: false,
    history: [],
    historyIndex: -1,
    savedSignature: "",
    zoom: 1,
    autoFit: true,
    baseCanvasWidth: 960,
    baseCanvasHeight: 540,
    saving: false,
    readOnly: false,
    pointerSession: null,
    marqueeSession: null,
    resizeSession: null,
    lineResizeSession: null,
    connectorPointSession: null,
    connectorPointIndex: -1,
    fieldTransaction: null,
    formulaPreview: null,
    formulaPreviewKey: "",
    formulaPreviewRequest: 0,
    formulaPreviewTimer: 0,
    clickCycle: { key: "", time: 0, index: 0 },
    toastTimer: 0,
    brandPalette: [],
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const elements = {
    app: $("#app"), moduleLabel: $("#moduleLabel"), slideTitle: $("#slideTitle"), sharedWarning: $("#sharedWarning"),
    undoButton: $("#undoButton"), redoButton: $("#redoButton"), parentButton: $("#parentButton"), formulaButton: $("#formulaButton"),
    zoomOutButton: $("#zoomOutButton"), zoomInButton: $("#zoomInButton"), zoomValue: $("#zoomValue"),
    saveState: $("#saveState"), saveButton: $("#saveButton"), viewerButton: $("#viewerButton"),
    breadcrumb: $("#breadcrumb"), measureFields: $$('[data-geometry]'),
    duplicateButton: $("#duplicateButton"), deleteButton: $("#deleteButton"), inspectorDuplicate: $("#inspectorDuplicate"), inspectorDelete: $("#inspectorDelete"),
    layerCount: $("#layerCount"), layerTree: $("#layerTree"), layerSearch: $("#layerSearch"), collapseLayersButton: $("#collapseLayersButton"),
    versionsToggle: $("#versionsToggle"), versionCount: $("#versionCount"), versionList: $("#versionList"),
    canvasViewport: $("#canvasViewport"), canvasDocument: $("#canvasDocument"), canvasEmpty: $("#canvasEmpty"), selectionBox: $("#selectionBox"), connectorHandles: $("#connectorHandles"), multiSelectionBoxes: $("#multiSelectionBoxes"), selectionMarquee: $("#selectionMarquee"), referenceBox: $("#referenceBox"),
    emptyInspector: $("#emptyInspector"), elementInspector: $("#elementInspector"), textInspector: $("#textInspector"), formulaInspector: $("#formulaInspector"),
    elementType: $("#elementType"), fillField: $("#fillField"), fillTextField: $("#fillTextField"), strokeField: $("#strokeField"), strokeTextField: $("#strokeTextField"), strokeWidthField: $("#strokeWidthField"), opacityField: $("#opacityField"),
    layerPosition: $("#layerPosition"), referenceStatus: $("#referenceStatus"), pickReferenceButton: $("#pickReferenceButton"), clearReferenceButton: $("#clearReferenceButton"),
    connectorSection: $("#connectorSection"), connectorPointStatus: $("#connectorPointStatus"), addConnectorCorner: $("#addConnectorCorner"), removeConnectorCorner: $("#removeConnectorCorner"), straightenConnectorHorizontal: $("#straightenConnectorHorizontal"), straightenConnectorVertical: $("#straightenConnectorVertical"), connectorEndpoint: $("#connectorEndpoint"),
    textField: $("#textField"), textTargetHint: $("#textTargetHint"), fontFamilyField: $("#fontFamilyField"), fontSizeField: $("#fontSizeField"), lineHeightField: $("#lineHeightField"), fontWeightField: $("#fontWeightField"), textFillField: $("#textFillField"), bulletStyleField: $("#bulletStyleField"), bulletColorField: $("#bulletColorField"),
    formulaMode: $("#formulaMode"), formulaSourceField: $("#formulaSourceField"), formulaPreview: $("#formulaPreview"), formulaFontSize: $("#formulaFontSize"), formulaColor: $("#formulaColor"), applyFormulaButton: $("#applyFormulaButton"), formulaHelp: $("#formulaHelp"),
    statusMessage: $("#statusMessage"), documentDimensions: $("#documentDimensions"), selectedStatus: $("#selectedStatus"),
    fatalError: $("#fatalError"), fatalErrorText: $("#fatalErrorText"), fatalBackButton: $("#fatalBackButton"), toast: $("#toast"),
    brandPalettes: $$('[data-brand-palette]'),
  };

  const FALLBACK_BRAND_PALETTE = [
    { name: "Marineblau", value: "#142452", role: "Basis" },
    { name: "Tiefes Marineblau", value: "#031334", role: "Basis" },
    { name: "Dunkles Marineblau", value: "#0D173D", role: "Basis" },
    { name: "Marineblau 80 %", value: "#435075", role: "Basis" },
    { name: "Marineblau 60 %", value: "#727C97", role: "Basis" },
    { name: "Marineblau 40 %", value: "#A1A8BA", role: "Basis" },
    { name: "Marineblau 20 %", value: "#D0D3DC", role: "Basis" },
    { name: "Marineblau 10 %", value: "#E8E9EE", role: "Basis" },
    { name: "Weiß", value: "#FFFFFF", role: "Neutral" },
    { name: "Fläche hell", value: "#F7F9FC", role: "Neutral" },
    { name: "Education-Grün", value: "#00A653", role: "Akzent" },
    { name: "Education-Grün hell", value: "#E6F6EE", role: "Akzent" },
    { name: "Goldgelb", value: "#E9B400", role: "Diagramm" },
    { name: "Koralle", value: "#EC6244", role: "Diagramm" },
    { name: "Stahlcyan", value: "#0C84B4", role: "Diagramm" },
    { name: "Graphitblau", value: "#25495F", role: "Diagramm" },
    { name: "Keine Farbe", value: "none", role: "Neutral" },
  ];

  function parseXml(source) {
    const parsed = new DOMParser().parseFromString(String(source || ""), "image/svg+xml");
    if (parsed.querySelector("parsererror") || parsed.documentElement?.localName !== "svg") {
      throw new Error("Die SVG-Quelldatei ist kein gültiges XML-Dokument.");
    }
    return parsed;
  }

  function serializeDocument() {
    if (!state.document) return "";
    return `${state.sourcePrefix || ""}${new XMLSerializer().serializeToString(state.document.documentElement)}`;
  }

  function serializeFormulaAssets() {
    return [...state.formulaAssets.values()].map((asset) => ({
      ...asset,
      metadata: asset.metadata && typeof asset.metadata === "object" ? { ...asset.metadata } : {},
    }));
  }

  function snapshot() {
    return { source: serializeDocument(), formulaAssets: serializeFormulaAssets(), selectedPath: state.selectedPath, selectedPaths: [...state.selectedPaths], referencePath: state.referencePath };
  }

  function signatureOf(value = snapshot()) {
    return JSON.stringify({ source: value.source, formulaAssets: value.formulaAssets });
  }

  function commitHistory() {
    const next = snapshot();
    if (state.historyIndex >= 0 && signatureOf(state.history[state.historyIndex]) === signatureOf(next)) return;
    state.history.splice(state.historyIndex + 1);
    state.history.push(next);
    if (state.history.length > 100) state.history.shift();
    state.historyIndex = state.history.length - 1;
    renderChrome();
  }

  function restoreSnapshot(value) {
    state.sourcePrefix = value.source.slice(0, Math.max(0, value.source.search(/<svg\b/i)));
    state.document = parseXml(value.source);
    state.formulaAssets = new Map((value.formulaAssets || []).map((asset) => [normalizeAssetKey(asset.path), { ...asset }]));
    state.selectedPath = value.selectedPath || "";
    state.selectedPaths = (value.selectedPaths || [state.selectedPath]).filter((path, index, array) => path && array.indexOf(path) === index);
    state.connectorPointIndex = -1;
    state.referencePath = value.referencePath || "";
    if (!nodeByPath(state.selectedPath)) state.selectedPath = "";
    state.selectedPaths = state.selectedPaths.filter((path) => nodeByPath(path));
    if (!nodeByPath(state.referencePath)) state.referencePath = "";
    renderAll();
  }

  function undo() {
    if (state.historyIndex <= 0 || state.saving) return;
    state.historyIndex -= 1;
    restoreSnapshot(state.history[state.historyIndex]);
    announce("Änderung rückgängig gemacht.");
  }

  function redo() {
    if (state.historyIndex >= state.history.length - 1 || state.saving) return;
    state.historyIndex += 1;
    restoreSnapshot(state.history[state.historyIndex]);
    announce("Änderung wiederhergestellt.");
  }

  function normalizeAssetKey(path) {
    return domain.normalizeWebPath(String(path || "").replace(/^\.\//, ""));
  }

  function elementChildren(node) {
    return [...(node?.children || [])].filter((child) => child instanceof Element);
  }

  function pathForNode(node) {
    const root = state.document?.documentElement;
    if (!root || !node || !(node instanceof Element)) return "";
    if (node === root) return "root";
    const parts = [];
    let current = node;
    while (current && current !== root) {
      const parent = current.parentElement;
      if (!parent) return "";
      parts.unshift(elementChildren(parent).indexOf(current));
      current = parent;
    }
    return current === root ? `root.${parts.join(".")}` : "";
  }

  function nodeByPath(path) {
    const root = state.document?.documentElement;
    if (!root || !path || !path.startsWith("root")) return null;
    if (path === "root") return root;
    let current = root;
    for (const part of path.slice(5).split(".")) {
      current = elementChildren(current)[Number(part)];
      if (!current) return null;
    }
    return current;
  }

  function displayNode(path = state.selectedPath) {
    const root = elements.canvasDocument.querySelector(":scope > svg");
    return path && root ? root.querySelector(`[data-svg-editor-path="${CSS.escape(path)}"]`) : null;
  }

  function referenceDisplayNode() { return displayNode(state.referencePath); }

  function selectedNode() { return nodeByPath(state.selectedPath); }

  function activeSelectionPaths() {
    const paths = state.selectedPaths.length ? state.selectedPaths : state.selectedPath ? [state.selectedPath] : [];
    return paths.filter((path, index, array) => path && array.indexOf(path) === index && nodeByPath(path));
  }

  function selectedNodes() { return activeSelectionPaths().map(nodeByPath).filter(Boolean); }

  function activateInspectorForSelection(node, count = 1) {
    state.activeTab = count > 1 ? "element" : formulaAtom(node) ? "formula" : node?.localName === "text" ? "text" : "element";
  }

  function setSelection(paths, primaryPath = paths.at(-1) || "", rerender = true) {
    const previousPath = state.selectedPath;
    const candidates = [...new Set(paths)].filter((path) => path && nodeByPath(path));
    const valid = candidates.filter((path) => {
      const node = nodeByPath(path);
      return !candidates.some((otherPath) => otherPath !== path && node.contains(nodeByPath(otherPath)));
    });
    state.selectedPaths = valid;
    state.selectedPath = valid.includes(primaryPath) ? primaryPath : valid.at(-1) || "";
    if (state.selectedPath !== previousPath) {
      activateInspectorForSelection(selectedNode(), valid.length);
    }
    state.connectorPointIndex = -1;
    if (rerender) renderAll();
    else { updateSelectionBox(); renderChrome(); renderLayers(); renderInspector(); renderBreadcrumb(); }
    if (state.activeTab === "text" && valid.length === 1) requestAnimationFrame(() => elements.textField.focus({ preventScroll: true }));
  }

  function isConnector(node = selectedNode()) {
    return node?.localName === "line" || node?.localName === "polyline" || node?.localName === "path" && domain.pathToConnectorPoints(node.getAttribute("d")).length >= 2;
  }

  function connectorPoints(node = selectedNode()) {
    if (node?.localName === "line") return [
      { x: domain.finiteNumber(node.getAttribute("x1")), y: domain.finiteNumber(node.getAttribute("y1")) },
      { x: domain.finiteNumber(node.getAttribute("x2")), y: domain.finiteNumber(node.getAttribute("y2")) },
    ];
    if (node?.localName === "polyline") return domain.parseConnectorPoints(node.getAttribute("points"));
    return node?.localName === "path" ? domain.pathToConnectorPoints(node.getAttribute("d")) : [];
  }

  function replaceConnectorWithPolyline(line, points) {
    const replacement = state.document.createElementNS(SVG_NS, "polyline");
    [...line.attributes].forEach((attribute) => {
      if (!["x1", "y1", "x2", "y2", "d"].includes(attribute.name)) replacement.setAttributeNS(attribute.namespaceURI, attribute.name, attribute.value);
    });
    replacement.setAttribute("points", domain.serializeConnectorPoints(points));
    replacement.setAttribute("fill", line.getAttribute("fill") || "none");
    line.replaceWith(replacement);
    state.selectedPath = pathForNode(replacement);
    return replacement;
  }

  function writeConnectorPoints(node, points) {
    if (node?.localName === "line" && points.length === 2) {
      node.setAttribute("x1", domain.formatNumber(points[0].x)); node.setAttribute("y1", domain.formatNumber(points[0].y));
      node.setAttribute("x2", domain.formatNumber(points[1].x)); node.setAttribute("y2", domain.formatNumber(points[1].y));
      return node;
    }
    const target = node?.localName === "line" || node?.localName === "path" ? replaceConnectorWithPolyline(node, points) : node;
    target?.setAttribute("points", domain.serializeConnectorPoints(points));
    return target;
  }

  function isHiddenDefinition(node) {
    return Boolean(node.closest("defs, symbol, clipPath, mask, marker, pattern, metadata")) || ["style", "title", "desc"].includes(node.localName);
  }

  function formulaAtom(node) {
    if (!node) return null;
    return node.closest?.("[data-formula-asset], [data-qc-role='formula']") || null;
  }

  function textAtom(node) {
    return node?.localName === "tspan" ? node.parentElement?.closest("text") || node : node;
  }

  function promoteAtomic(node) {
    return formulaAtom(node) || textAtom(node);
  }

  function nodeLabel(node) {
    if (!node) return "Element";
    const label = node.getAttribute("data-anim-label") || node.getAttribute("aria-label") || node.id;
    if (label) return label;
    if (node.localName === "text") {
      const text = (node.textContent || "").trim().replace(/\s+/g, " ");
      if (text) return text.slice(0, 42);
    }
    const names = { g: "Gruppe", rect: "Rechteck", text: "Text", image: "Bild", line: "Linie", path: "Pfad", circle: "Kreis", ellipse: "Ellipse", polygon: "Polygon", polyline: "Linienzug", use: "Symbol", svg: "SVG" };
    return names[node.localName] || node.localName;
  }

  function nodeIcon(node) {
    if (formulaAtom(node)) return "ƒ";
    return ({ g: "◇", rect: "□", text: "T", image: "▧", line: "╱", path: "⌁", circle: "○", ellipse: "○", polygon: "△", polyline: "⌁", use: "◆", svg: "▣" })[node.localName] || "·";
  }

  function sanitizeDisplayClone() {
    const sourceRoot = state.document.documentElement;
    const cloneDocument = parseXml(new XMLSerializer().serializeToString(sourceRoot));
    const root = cloneDocument.documentElement;
    root.querySelectorAll("script,foreignObject,iframe,object,embed").forEach((node) => node.remove());
    root.querySelectorAll("style").forEach((node) => {
      if (/@import|javascript:|url\(\s*['\"]?(?:https?:|\/\/)/i.test(node.textContent || "")) node.remove();
    });
    const walk = (modelNode, cloneNode, path) => {
      if (!(cloneNode instanceof Element)) return;
      cloneNode.setAttribute("data-svg-editor-path", path);
      [...cloneNode.attributes].forEach((attribute) => {
        const name = attribute.name.toLowerCase();
        if (name.startsWith("on")) cloneNode.removeAttribute(attribute.name);
        if (name === "style" && /javascript:|url\(\s*['\"]?(?:https?:|\/\/)/i.test(attribute.value)) cloneNode.removeAttribute(attribute.name);
      });
      for (const attrName of ["href", "xlink:href"]) {
        const value = cloneNode.getAttribute(attrName);
        if (!value) continue;
        if (/^(?:javascript:|vbscript:|data:text\/html|https?:|\/\/)/i.test(value)) cloneNode.removeAttribute(attrName);
        else if (domain.isRelativeReference(value)) cloneNode.setAttribute(attrName, domain.resolveAssetUrl(state.svgPath, value));
      }
      const assetPath = externalFormulaPath(modelNode);
      const draftAsset = assetPath ? state.formulaAssets.get(normalizeAssetKey(assetPath)) : null;
      if (draftAsset?.source && cloneNode.localName === "image") {
        cloneNode.setAttribute("href", `data:image/svg+xml;charset=utf-8,${encodeURIComponent(draftAsset.source)}`);
        cloneNode.removeAttributeNS(XLINK_NS, "href");
      }
      const modelChildren = elementChildren(modelNode);
      const cloneChildren = elementChildren(cloneNode);
      cloneChildren.forEach((child, index) => walk(modelChildren[index], child, `${path}.${index}`));
    };
    walk(sourceRoot, root, "root");
    root.removeAttribute("width");
    root.removeAttribute("height");
    root.setAttribute("preserveAspectRatio", root.getAttribute("preserveAspectRatio") || "xMidYMid meet");
    return document.importNode(root, true);
  }

  function rootDimensions() {
    const root = state.document?.documentElement;
    if (!root) return { width: 1920, height: 1080 };
    const viewBox = (root.getAttribute("viewBox") || "").trim().split(/[ ,]+/).map(Number);
    const width = viewBox.length === 4 && viewBox[2] > 0 ? viewBox[2] : domain.finiteNumber(root.getAttribute("width"), 1920);
    const height = viewBox.length === 4 && viewBox[3] > 0 ? viewBox[3] : domain.finiteNumber(root.getAttribute("height"), 1080);
    return { width, height };
  }

  function renderCanvas() {
    if (!state.document) return;
    let root;
    try { root = sanitizeDisplayClone(); }
    catch (error) { elements.canvasEmpty.textContent = error.message; return; }
    root.addEventListener("pointerdown", handleCanvasPointerDown);
    elements.canvasDocument.querySelector(":scope > svg")?.remove();
    elements.canvasEmpty.hidden = true;
    elements.canvasDocument.prepend(root);
    const dimensions = rootDimensions();
    state.baseCanvasHeight = state.baseCanvasWidth * dimensions.height / dimensions.width;
    elements.canvasDocument.style.width = `${state.baseCanvasWidth * state.zoom}px`;
    elements.canvasDocument.style.height = `${state.baseCanvasHeight * state.zoom}px`;
    updateSelectionBox();
    updateReferenceBox();
  }

  function geometryForDisplay(node = displayNode()) {
    const root = elements.canvasDocument.querySelector(":scope > svg");
    if (!node || !root) return null;
    const rootMatrix = root.getScreenCTM();
    const rect = node.getBoundingClientRect();
    if (!rootMatrix || !rect.width && !rect.height) return null;
    const inverse = rootMatrix.inverse();
    const points = [
      new DOMPoint(rect.left, rect.top).matrixTransform(inverse),
      new DOMPoint(rect.right, rect.top).matrixTransform(inverse),
      new DOMPoint(rect.right, rect.bottom).matrixTransform(inverse),
      new DOMPoint(rect.left, rect.bottom).matrixTransform(inverse),
    ];
    const xs = points.map((point) => point.x); const ys = points.map((point) => point.y);
    return { x: Math.min(...xs), y: Math.min(...ys), width: Math.max(...xs) - Math.min(...xs), height: Math.max(...ys) - Math.min(...ys) };
  }

  function updateSelectionBox() {
    const paths = activeSelectionPaths();
    const selected = displayNode();
    const displays = paths.map((path) => displayNode(path)).filter(Boolean);
    if (!selected || !displays.length) { elements.selectionBox.hidden = true; elements.connectorHandles.replaceChildren(); elements.multiSelectionBoxes.replaceChildren(); return; }
    const rectangles = displays.map((display) => display.getBoundingClientRect());
    const rect = paths.length > 1 ? {
      left: Math.min(...rectangles.map((item) => item.left)), top: Math.min(...rectangles.map((item) => item.top)),
      right: Math.max(...rectangles.map((item) => item.right)), bottom: Math.max(...rectangles.map((item) => item.bottom)),
      get width() { return this.right - this.left; }, get height() { return this.bottom - this.top; },
    } : rectangles[0];
    const parentRect = elements.canvasDocument.getBoundingClientRect();
    const lineSelected = selected.localName === "line";
    const multiSelected = paths.length > 1;
    const connectorSelected = !multiSelected && isConnector() && ["line", "polyline", "path"].includes(selected.localName);
    elements.selectionBox.hidden = false;
    elements.selectionBox.classList.toggle("line-selection", lineSelected);
    elements.selectionBox.classList.toggle("connector-selection", connectorSelected);
    elements.selectionBox.classList.toggle("multi-selection", multiSelected);
    Object.assign(elements.selectionBox.style, {
      left: `${rect.left - parentRect.left}px`, top: `${rect.top - parentRect.top}px`,
      width: `${Math.max(1, rect.width)}px`, height: `${Math.max(1, rect.height)}px`,
    });
    elements.connectorHandles.replaceChildren();
    if (connectorSelected) renderConnectorHandles(selected, rect);
    const fragment = document.createDocumentFragment();
    if (multiSelected) rectangles.forEach((item) => {
      const outline = document.createElement("i"); outline.className = "multi-selection-outline";
      Object.assign(outline.style, { left: `${item.left - parentRect.left}px`, top: `${item.top - parentRect.top}px`, width: `${Math.max(1, item.width)}px`, height: `${Math.max(1, item.height)}px` });
      fragment.append(outline);
    });
    elements.multiSelectionBoxes.replaceChildren(fragment);
  }

  function renderConnectorHandles(selected, selectionRect) {
    const matrix = selected.getScreenCTM();
    const points = connectorPoints();
    if (!matrix || points.length < 2) return;
    const fragment = document.createDocumentFragment();
    points.forEach((point, index) => {
      const screen = new DOMPoint(point.x, point.y).matrixTransform(matrix);
      const handle = document.createElement("i");
      handle.className = `connector-point${index === 0 || index === points.length - 1 ? " endpoint" : ""}${state.connectorPointIndex === index ? " active" : ""}`;
      handle.dataset.connectorPoint = String(index);
      handle.style.left = `${screen.x - selectionRect.left - (index === 0 || index === points.length - 1 ? 6.5 : 5.5)}px`;
      handle.style.top = `${screen.y - selectionRect.top - (index === 0 || index === points.length - 1 ? 6.5 : 5.5)}px`;
      handle.addEventListener("pointerdown", startConnectorPointDrag);
      fragment.append(handle);
      if (index >= points.length - 1) return;
      const next = new DOMPoint(points[index + 1].x, points[index + 1].y).matrixTransform(matrix);
      const segmentHandle = document.createElement("i");
      segmentHandle.className = "connector-segment-point";
      segmentHandle.dataset.connectorSegment = String(index);
      segmentHandle.title = "Ecke auf diesem Segment einfügen";
      segmentHandle.style.left = `${(screen.x + next.x) / 2 - selectionRect.left - 5}px`;
      segmentHandle.style.top = `${(screen.y + next.y) / 2 - selectionRect.top - 5}px`;
      segmentHandle.addEventListener("pointerdown", insertConnectorPointFromHandle);
      fragment.append(segmentHandle);
    });
    elements.connectorHandles.append(fragment);
  }

  function updateReferenceBox() {
    const reference = referenceDisplayNode();
    if (!reference || state.referencePath === state.selectedPath) { elements.referenceBox.hidden = true; return; }
    const rect = reference.getBoundingClientRect();
    const parentRect = elements.canvasDocument.getBoundingClientRect();
    elements.referenceBox.hidden = false;
    Object.assign(elements.referenceBox.style, {
      left: `${rect.left - parentRect.left}px`, top: `${rect.top - parentRect.top}px`,
      width: `${Math.max(1, rect.width)}px`, height: `${Math.max(1, rect.height)}px`,
    });
  }

  function selectableCandidates(target) {
    const root = elements.canvasDocument.querySelector(":scope > svg");
    const result = [];
    let current = target instanceof Element ? target : null;
    while (current && root?.contains(current)) {
      if (current.hasAttribute("data-svg-editor-path") && !isHiddenDefinition(current)) {
        const promoted = formulaAtom(current) || (current.localName === "tspan" ? current.parentElement : current);
        if (promoted && !result.includes(promoted)) result.push(promoted);
      }
      if (current === root) break;
      current = current.parentElement;
    }
    return result;
  }

  function pointInParent(event, parent) {
    const matrix = parent?.getScreenCTM();
    return matrix ? new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse()) : new DOMPoint(event.clientX, event.clientY);
  }

  function startMarquee(event) {
    state.marqueeSession = {
      startClientX: event.clientX, startClientY: event.clientY,
      currentClientX: event.clientX, currentClientY: event.clientY,
      additive: event.ctrlKey || event.metaKey || event.shiftKey,
      initialPaths: activeSelectionPaths(), moved: false,
    };
    elements.selectionMarquee.hidden = false;
    updateMarquee(event);
    event.preventDefault();
  }

  function updateMarquee(event) {
    const session = state.marqueeSession; if (!session) return;
    session.currentClientX = event.clientX; session.currentClientY = event.clientY;
    session.moved = Math.hypot(event.clientX - session.startClientX, event.clientY - session.startClientY) >= 3;
    const parentRect = elements.canvasDocument.getBoundingClientRect();
    const left = Math.min(session.startClientX, event.clientX); const top = Math.min(session.startClientY, event.clientY);
    const width = Math.abs(event.clientX - session.startClientX); const height = Math.abs(event.clientY - session.startClientY);
    Object.assign(elements.selectionMarquee.style, { left: `${left - parentRect.left}px`, top: `${top - parentRect.top}px`, width: `${width}px`, height: `${height}px` });
  }

  function marqueePaths(session) {
    const root = elements.canvasDocument.querySelector(":scope > svg");
    if (!root || !session.moved) return [];
    const bounds = {
      left: Math.min(session.startClientX, session.currentClientX), right: Math.max(session.startClientX, session.currentClientX),
      top: Math.min(session.startClientY, session.currentClientY), bottom: Math.max(session.startClientY, session.currentClientY),
    };
    const paths = [];
    root.querySelectorAll("[data-svg-editor-path]").forEach((display) => {
      if (["svg", "g", "tspan", "defs", "style", "metadata", "title", "desc"].includes(display.localName)) return;
      const model = nodeByPath(display.getAttribute("data-svg-editor-path"));
      if (!model || isHiddenDefinition(model)) return;
      const atom = promoteAtomic(model); const path = pathForNode(atom);
      if (!path || paths.includes(path)) return;
      const target = displayNode(path); const rect = target?.getBoundingClientRect();
      if (!rect || !rect.width && !rect.height) return;
      if (domain.rectMatchesMarquee(rect, bounds)) paths.push(path);
    });
    return paths;
  }

  function finishMarquee() {
    const session = state.marqueeSession; if (!session) return false;
    state.marqueeSession = null; elements.selectionMarquee.hidden = true;
    if (!session.moved) { if (!session.additive) selectPath(""); return true; }
    const paths = marqueePaths(session);
    setSelection(session.additive ? [...session.initialPaths, ...paths] : paths, paths.at(-1) || session.initialPaths.at(-1) || "");
    announce(paths.length ? `${activeSelectionPaths().length} Elemente ausgewählt.` : "Keine Elemente im Auswahlrahmen.");
    return true;
  }

  function handleCanvasPointerDown(event) {
    if (event.button !== 0) return;
    const canvasRoot = elements.canvasDocument.querySelector(":scope > svg");
    if (event.target === canvasRoot) { startMarquee(event); return; }
    const candidates = selectableCandidates(event.target);
    if (!candidates.length) { startMarquee(event); return; }
    const key = `${Math.round(event.clientX / 5)}:${Math.round(event.clientY / 5)}:${candidates.map((node) => node.getAttribute("data-svg-editor-path")).join("|")}`;
    const now = Date.now();
    if (state.clickCycle.key === key && now - state.clickCycle.time < 900) state.clickCycle.index = (state.clickCycle.index + 1) % candidates.length;
    else state.clickCycle = { key, time: now, index: 0 };
    state.clickCycle.time = now;
    const picked = candidates[state.clickCycle.index];
    const pickedPath = picked.getAttribute("data-svg-editor-path");
    if (state.referencePicking) {
      if (pickedPath === state.selectedPath) {
        announce("Bitte ein anderes Element als Referenz wählen.", true);
        return;
      }
      state.referencePath = pickedPath;
      state.referencePicking = false;
      renderAll();
      announce(`Referenz gewählt: ${nodeLabel(nodeByPath(pickedPath))}.`);
      event.preventDefault();
      return;
    }
    const currentPaths = activeSelectionPaths();
    if (event.ctrlKey || event.metaKey) {
      const nextPaths = currentPaths.includes(pickedPath) ? currentPaths.filter((path) => path !== pickedPath) : [...currentPaths, pickedPath];
      setSelection(nextPaths, nextPaths.includes(pickedPath) ? pickedPath : nextPaths.at(-1) || "", false);
      event.preventDefault();
      return;
    }
    if (event.shiftKey && !currentPaths.includes(pickedPath)) {
      const nextPaths = [...currentPaths, pickedPath]; setSelection(nextPaths, pickedPath, false); event.preventDefault(); return;
    }
    activateInspectorForSelection(nodeByPath(pickedPath), 1);
    const keepMultiple = currentPaths.length > 1 && currentPaths.includes(pickedPath);
    if (!keepMultiple) selectPath(pickedPath, false);
    else { state.selectedPath = pickedPath; updateSelectionBox(); renderInspector(); renderBreadcrumb(); renderChrome(); }
    if (state.readOnly || pickedPath === "root") return;
    const model = selectedNode();
    const display = displayNode();
    const parent = display?.parentElement;
    if (!model || !parent) return;
    state.pointerSession = activeSelectionPaths().length > 1
      ? createMultiMoveSession(event)
      : { startClientX: event.clientX, startClientY: event.clientY, startPoint: pointInParent(event, parent), parent, baseline: captureTransformBaseline(model), moved: false };
    if (state.pointerSession && event.shiftKey && currentPaths.includes(pickedPath)) state.pointerSession.toggleOnClick = pickedPath;
    event.preventDefault();
  }

  function createMultiMoveSession(event) {
    const root = elements.canvasDocument.querySelector(":scope > svg"); const rootMatrix = root?.getScreenCTM();
    if (!rootMatrix) return null;
    const startRoot = new DOMPoint(event.clientX, event.clientY).matrixTransform(rootMatrix.inverse());
    const items = activeSelectionPaths().map((path) => {
      const node = nodeByPath(path); const display = displayNode(path); const parentMatrix = display?.parentElement?.getScreenCTM();
      if (!node || !parentMatrix) return null;
      const rootToParent = parentMatrix.inverse().multiply(rootMatrix);
      return { node, baseline: captureTransformBaseline(node), a: rootToParent.a, b: rootToParent.b, c: rootToParent.c, d: rootToParent.d };
    }).filter(Boolean);
    return { multi: true, startClientX: event.clientX, startClientY: event.clientY, startRoot, items, moved: false };
  }

  function captureTransformBaseline(node) {
    const attributes = {};
    ["x", "y", "cx", "cy", "x1", "x2", "y1", "y2", "width", "height", "r", "rx", "ry", "transform"].forEach((name) => {
      attributes[name] = node.getAttribute(name);
    });
    return attributes;
  }

  function restoreAttributes(node, baseline) {
    Object.entries(baseline).forEach(([name, value]) => value == null ? node.removeAttribute(name) : node.setAttribute(name, value));
  }

  function moveFromBaseline(node, baseline, dx, dy) {
    restoreAttributes(node, baseline);
    const tag = node.localName;
    const add = (name, delta) => node.setAttribute(name, domain.formatNumber(domain.finiteNumber(baseline[name]) + delta));
    if (["rect", "image", "text", "use", "svg"].includes(tag) && (baseline.x != null || baseline.y != null)) { add("x", dx); add("y", dy); }
    else if (["circle", "ellipse"].includes(tag)) { add("cx", dx); add("cy", dy); }
    else if (tag === "line") { add("x1", dx); add("x2", dx); add("y1", dy); add("y2", dy); }
    else node.setAttribute("transform", domain.appendTransform(baseline.transform, `translate(${domain.formatNumber(dx)} ${domain.formatNumber(dy)})`));
  }

  function handlePointerMove(event) {
    if (state.marqueeSession) { updateMarquee(event); return; }
    if (state.connectorPointSession) { moveConnectorPointFromPointer(event); return; }
    if (state.pointerSession) {
      const session = state.pointerSession;
      const distance = Math.hypot(event.clientX - session.startClientX, event.clientY - session.startClientY);
      if (distance < 2 && !session.moved) return;
      session.moved = true;
      if (session.multi) {
        const root = elements.canvasDocument.querySelector(":scope > svg"); const rootMatrix = root?.getScreenCTM();
        if (!rootMatrix) return;
        const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(rootMatrix.inverse());
        const delta = domain.constrainDelta(point.x - session.startRoot.x, point.y - session.startRoot.y, event.shiftKey);
        session.items.forEach((item) => moveFromBaseline(item.node, item.baseline, item.a * delta.dx + item.c * delta.dy, item.b * delta.dx + item.d * delta.dy));
        renderCanvas(); renderInspector(false); renderBreadcrumb();
        return;
      }
      const point = pointInParent(event, session.parent);
      const delta = domain.constrainDelta(point.x - session.startPoint.x, point.y - session.startPoint.y, event.shiftKey);
      moveFromBaseline(selectedNode(), session.baseline, delta.dx, delta.dy);
      renderCanvas();
      session.parent = displayNode()?.parentElement || session.parent;
      renderInspector(false); renderBreadcrumb();
      return;
    }
    if (state.lineResizeSession) { resizeLineEndpointFromPointer(event); return; }
    if (state.resizeSession) resizeFromPointer(event);
  }

  function handlePointerUp() {
    if (state.marqueeSession) { finishMarquee(); return; }
    if (state.pointerSession?.toggleOnClick && !state.pointerSession.moved) {
      const path = state.pointerSession.toggleOnClick; const nextPaths = activeSelectionPaths().filter((item) => item !== path);
      state.pointerSession = null; setSelection(nextPaths, nextPaths.at(-1) || ""); return;
    }
    const changed = state.pointerSession?.moved || state.resizeSession?.moved || state.lineResizeSession?.moved || state.connectorPointSession?.moved;
    state.pointerSession = null; state.resizeSession = null; state.lineResizeSession = null; state.connectorPointSession = null;
    if (changed) { commitHistory(); renderAll(); announce("Element angepasst."); }
  }

  function parentBox(display, parent) {
    const rect = display.getBoundingClientRect();
    const inverse = parent.getScreenCTM().inverse();
    const a = new DOMPoint(rect.left, rect.top).matrixTransform(inverse);
    const b = new DOMPoint(rect.right, rect.bottom).matrixTransform(inverse);
    return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), width: Math.abs(b.x - a.x), height: Math.abs(b.y - a.y) };
  }

  function startResize(event) {
    if (state.readOnly || !selectedNode()) return;
    const display = displayNode(); const parent = display?.parentElement;
    if (!display || !parent?.getScreenCTM()) return;
    state.resizeSession = {
      handle: event.currentTarget.dataset.handle,
      start: pointInParent(event, parent), parent,
      box: parentBox(display, parent), baseline: captureTransformBaseline(selectedNode()), moved: false,
    };
    event.preventDefault(); event.stopPropagation();
  }

  function startLineEndpointResize(event) {
    const model = selectedNode(); const display = displayNode(); const parent = display?.parentElement;
    if (state.readOnly || model?.localName !== "line" || !parent?.getScreenCTM()) return;
    state.lineResizeSession = {
      endpoint: event.currentTarget.dataset.lineHandle,
      parent,
      baseline: captureTransformBaseline(model),
      moved: false,
    };
    event.preventDefault(); event.stopPropagation();
  }

  function startConnectorPointDrag(event) {
    const model = selectedNode(); const display = displayNode();
    if (state.readOnly || !isConnector(model) || !display?.getScreenCTM()) return;
    const index = Number(event.currentTarget.dataset.connectorPoint);
    const points = connectorPoints(model);
    if (!points[index]) return;
    state.connectorPointIndex = index;
    state.connectorPointSession = { index, baseline: points.map((point) => ({ ...point })), moved: false };
    renderInspector(false);
    event.preventDefault(); event.stopPropagation();
  }

  function insertConnectorPointFromHandle(event) {
    const model = selectedNode();
    if (state.readOnly || !isConnector(model)) return;
    const segmentIndex = Number(event.currentTarget.dataset.connectorSegment);
    const points = domain.insertConnectorPoint(connectorPoints(model), segmentIndex);
    const target = writeConnectorPoints(model, points);
    state.connectorPointIndex = segmentIndex + 1;
    state.connectorPointSession = { index: state.connectorPointIndex, baseline: points.map((point) => ({ ...point })), moved: true };
    state.selectedPath = pathForNode(target);
    renderCanvas(); renderInspector(false); renderBreadcrumb();
    event.preventDefault(); event.stopPropagation();
  }

  function moveConnectorPointFromPointer(event) {
    const session = state.connectorPointSession; const model = selectedNode(); const display = displayNode();
    if (!session || !isConnector(model) || !display?.getScreenCTM()) return;
    const localPoint = new DOMPoint(event.clientX, event.clientY).matrixTransform(display.getScreenCTM().inverse());
    const original = session.baseline[session.index];
    const delta = domain.constrainDelta(localPoint.x - original.x, localPoint.y - original.y, event.shiftKey);
    const points = session.baseline.map((point) => ({ ...point }));
    points[session.index] = { x: original.x + delta.dx, y: original.y + delta.dy };
    writeConnectorPoints(model, points);
    session.moved = true;
    renderCanvas(); renderInspector(false); renderBreadcrumb();
  }

  function resizeLineEndpointFromPointer(event) {
    const session = state.lineResizeSession; const line = selectedNode();
    if (!session || line?.localName !== "line") return;
    const point = pointInParent(event, session.parent);
    const endpoint = domain.constrainLineEndpoint({
      x1: session.baseline.x1, y1: session.baseline.y1,
      x2: session.baseline.x2, y2: session.baseline.y2,
    }, session.endpoint, point, event.shiftKey);
    restoreAttributes(line, session.baseline);
    const suffix = session.endpoint === "start" ? "1" : "2";
    line.setAttribute(`x${suffix}`, domain.formatNumber(endpoint.x));
    line.setAttribute(`y${suffix}`, domain.formatNumber(endpoint.y));
    session.moved = true;
    renderCanvas();
    session.parent = displayNode()?.parentElement || session.parent;
    renderInspector(false); renderBreadcrumb();
  }

  function resizedBounds(session, point) {
    let { x, y, width, height } = session.box;
    const dx = point.x - session.start.x; const dy = point.y - session.start.y;
    if (session.handle.includes("e")) width += dx;
    if (session.handle.includes("s")) height += dy;
    if (session.handle.includes("w")) { x += dx; width -= dx; }
    if (session.handle.includes("n")) { y += dy; height -= dy; }
    if (width < 2) { x -= 2 - width; width = 2; }
    if (height < 2) { y -= 2 - height; height = 2; }
    return { x, y, width, height };
  }

  function applyResize(node, baseline, oldBox, nextBox) {
    restoreAttributes(node, baseline);
    const sx = nextBox.width / Math.max(oldBox.width, 0.001); const sy = nextBox.height / Math.max(oldBox.height, 0.001);
    const native = ["rect", "image", "svg"].includes(node.localName) && !baseline.transform;
    if (native) {
      node.setAttribute("x", domain.formatNumber(nextBox.x)); node.setAttribute("y", domain.formatNumber(nextBox.y));
      node.setAttribute("width", domain.formatNumber(nextBox.width)); node.setAttribute("height", domain.formatNumber(nextBox.height));
    } else {
      const operation = `translate(${domain.formatNumber(nextBox.x)} ${domain.formatNumber(nextBox.y)}) scale(${domain.formatNumber(sx, 5)} ${domain.formatNumber(sy, 5)}) translate(${domain.formatNumber(-oldBox.x)} ${domain.formatNumber(-oldBox.y)})`;
      node.setAttribute("transform", domain.appendTransform(baseline.transform, operation));
    }
  }

  function resizeFromPointer(event) {
    const session = state.resizeSession;
    session.moved = true;
    applyResize(selectedNode(), session.baseline, session.box, resizedBounds(session, pointInParent(event, session.parent)));
    renderCanvas();
    session.parent = displayNode()?.parentElement || session.parent;
    renderInspector(false); renderBreadcrumb();
  }

  function selectPath(path, rerender = true) {
    if (path && !nodeByPath(path)) return;
    setSelection(path ? [path] : [], path, rerender);
  }

  function selectParent() {
    const node = selectedNode();
    if (!node?.parentElement) return;
    selectPath(pathForNode(promoteAtomic(node.parentElement)));
  }

  function mutate(action, message) {
    if (state.readOnly || state.saving) return;
    const referenceNode = nodeByPath(state.referencePath);
    action();
    state.referencePath = referenceNode?.isConnected ? pathForNode(referenceNode) : "";
    commitHistory(); renderAll();
    if (message) announce(message);
  }

  function paintableSiblings(node = selectedNode()) {
    return node?.parentElement ? elementChildren(node.parentElement).filter((item) => !isHiddenDefinition(item)) : [];
  }

  function layerOrderState(node = selectedNode()) {
    const siblings = paintableSiblings(node); const index = siblings.indexOf(node);
    return { siblings, index, count: siblings.length };
  }

  function moveLayer(action) {
    const node = selectedNode();
    if (!node || node === state.document.documentElement) return;
    const { siblings, index } = layerOrderState(node);
    if (index < 0 || siblings.length < 2) return;
    mutate(() => {
      if (action === "back" && index > 0) siblings[0].before(node);
      if (action === "backward" && index > 0) siblings[index - 1].before(node);
      if (action === "forward" && index < siblings.length - 1) siblings[index + 1].after(node);
      if (action === "front" && index < siblings.length - 1) siblings.at(-1).after(node);
      state.selectedPath = pathForNode(node); state.selectedPaths = [state.selectedPath];
    }, action === "back" ? "Element ganz nach hinten verschoben." : action === "backward" ? "Element eine Ebene nach hinten verschoben." : action === "forward" ? "Element eine Ebene nach vorn verschoben." : "Element ganz nach vorn verschoben.");
  }

  function moveNodeByRootDelta(node, dx, dy) {
    const display = displayNode(pathForNode(node));
    const parent = display?.parentElement;
    const root = elements.canvasDocument.querySelector(":scope > svg");
    const rootMatrix = root?.getScreenCTM(); const parentMatrix = parent?.getScreenCTM();
    if (!display || !rootMatrix || !parentMatrix) return false;
    const originScreen = new DOMPoint(0, 0).matrixTransform(rootMatrix);
    const targetScreen = new DOMPoint(dx, dy).matrixTransform(rootMatrix);
    const inverse = parentMatrix.inverse();
    const originParent = originScreen.matrixTransform(inverse); const targetParent = targetScreen.matrixTransform(inverse);
    moveFromBaseline(node, captureTransformBaseline(node), targetParent.x - originParent.x, targetParent.y - originParent.y);
    return true;
  }

  function alignToReference(mode) {
    const selected = selectedNode(); const reference = nodeByPath(state.referencePath);
    if (!selected || !reference || selected === reference) return;
    if (mode === "dock" && reference.localName !== "line") {
      announce("„An Linie“ benötigt eine Linie als Referenz.", true);
      return;
    }
    const selectedBox = geometryForDisplay(displayNode());
    const referenceBox = geometryForDisplay(referenceDisplayNode());
    if (!selectedBox || !referenceBox) return;
    const delta = domain.alignmentDelta(selectedBox, referenceBox, mode);
    mutate(() => { moveNodeByRootDelta(selected, delta.dx, delta.dy); }, mode === "dock" ? "Element an Linie angedockt." : "Element an Referenz ausgerichtet.");
  }

  function addConnectorCorner() {
    const node = selectedNode(); const points = connectorPoints(node);
    if (!isConnector(node) || points.length < 2) return;
    const segmentIndex = domain.longestConnectorSegment(points);
    mutate(() => {
      const target = writeConnectorPoints(node, domain.insertConnectorPoint(points, segmentIndex));
      state.selectedPath = pathForNode(target); state.connectorPointIndex = segmentIndex + 1;
    }, "Ecke hinzugefügt. Ziehe den neuen weißen Punkt an die gewünschte Position.");
  }

  function removeConnectorCorner() {
    const node = selectedNode(); const points = connectorPoints(node); const index = state.connectorPointIndex;
    if (!isConnector(node) || points.length <= 2 || index <= 0 || index >= points.length - 1) return;
    mutate(() => {
      points.splice(index, 1); writeConnectorPoints(node, points); state.connectorPointIndex = Math.min(index, points.length - 1);
    }, "Ecke entfernt.");
  }

  function straightenConnector(axis) {
    const node = selectedNode(); const points = connectorPoints(node);
    if (!isConnector(node) || points.length < 2) return;
    mutate(() => {
      const anchorIndex = state.connectorPointIndex >= 0 ? state.connectorPointIndex : 0;
      const anchor = points[Math.min(anchorIndex, points.length - 1)];
      const next = points.map((point) => axis === "horizontal" ? { x: point.x, y: anchor.y } : { x: anchor.x, y: point.y });
      writeConnectorPoints(node, next);
    }, axis === "horizontal" ? "Verbinder horizontal ausgerichtet." : "Verbinder vertikal ausgerichtet.");
  }

  function referenceBoundsInConnectorCoordinates() {
    const connector = displayNode(); const reference = referenceDisplayNode();
    const matrix = connector?.getScreenCTM(); const rect = reference?.getBoundingClientRect();
    if (!matrix || !reference || !rect) return null;
    const inverse = matrix.inverse();
    const points = [
      new DOMPoint(rect.left, rect.top).matrixTransform(inverse),
      new DOMPoint(rect.right, rect.top).matrixTransform(inverse),
      new DOMPoint(rect.right, rect.bottom).matrixTransform(inverse),
      new DOMPoint(rect.left, rect.bottom).matrixTransform(inverse),
    ];
    const xs = points.map((point) => point.x); const ys = points.map((point) => point.y);
    return { x: Math.min(...xs), y: Math.min(...ys), width: Math.max(...xs) - Math.min(...xs), height: Math.max(...ys) - Math.min(...ys) };
  }

  function dockConnectorToReference(side) {
    const node = selectedNode(); const reference = nodeByPath(state.referencePath); const points = connectorPoints(node);
    const box = referenceBoundsInConnectorCoordinates();
    if (!isConnector(node) || !reference || !box || points.length < 2) return;
    const endpointIndex = elements.connectorEndpoint.value === "start" ? 0 : points.length - 1;
    mutate(() => {
      points[endpointIndex] = domain.dockConnectorPoint(box, side);
      writeConnectorPoints(node, points); state.connectorPointIndex = endpointIndex;
    }, `Pfeil${endpointIndex === 0 ? "anfang" : "ende"} an ${side === "left" ? "linke" : side === "right" ? "rechte" : side === "top" ? "obere" : "untere"} Boxseite angedockt.`);
  }

  function duplicateSelection() {
    const nodes = selectedNodes().filter((node) => node !== state.document.documentElement);
    if (!nodes.length) return;
    mutate(() => {
      const clones = nodes.map((node) => {
        const clone = node.cloneNode(true);
        clone.removeAttribute("id"); clone.querySelectorAll?.("[id]").forEach((child) => child.removeAttribute("id"));
        clone.setAttribute("transform", domain.appendTransform(clone.getAttribute("transform"), "translate(20 20)"));
        node.after(clone); return clone;
      });
      state.selectedPaths = clones.map(pathForNode); state.selectedPath = state.selectedPaths.at(-1) || "";
    }, nodes.length > 1 ? `${nodes.length} Elemente dupliziert.` : "Element dupliziert.");
  }

  function deleteSelection() {
    const nodes = selectedNodes().filter((node) => node !== state.document.documentElement);
    if (!nodes.length) return;
    mutate(() => { nodes.forEach((node) => node.remove()); state.selectedPath = ""; state.selectedPaths = []; }, nodes.length > 1 ? `${nodes.length} Elemente gelöscht.` : "Element gelöscht.");
  }

  function nudgeSelection(dx, dy) {
    const nodes = selectedNodes().filter((node) => node !== state.document.documentElement);
    if (!nodes.length || state.readOnly) return;
    nodes.forEach((node) => moveNodeByRootDelta(node, dx, dy));
    commitHistory(); renderAll();
  }

  function layerNodes() {
    const root = state.document?.documentElement;
    if (!root) return [];
    const result = [];
    const walk = (node, depth) => {
      if (!(node instanceof Element) || isHiddenDefinition(node)) return;
      const atomic = promoteAtomic(node);
      if (atomic !== node) return;
      result.push({ node, path: pathForNode(node), depth });
      if (formulaAtom(node)) return;
      elementChildren(node).forEach((child) => walk(child, depth + 1));
    };
    walk(root, 0); return result;
  }

  function renderLayers() {
    const nodes = layerNodes(); const filter = elements.layerSearch.value.trim().toLocaleLowerCase("de");
    elements.layerCount.textContent = String(nodes.length);
    const fragment = document.createDocumentFragment();
    const visiblePaths = filter ? new Set(nodes.filter((item) => `${nodeLabel(item.node)} ${item.node.id}`.toLocaleLowerCase("de").includes(filter)).flatMap((item) => {
      const paths = []; let current = item.node;
      while (current) { paths.push(pathForNode(current)); current = current.parentElement; }
      return paths;
    })) : null;
    for (const item of nodes) {
      if (visiblePaths && !visiblePaths.has(item.path)) continue;
      if (!filter && state.layersCollapsed && item.depth > 1) continue;
      let parent = item.node.parentElement; let blocked = false;
      while (parent && parent !== state.document.documentElement) {
        if (state.collapsed.has(pathForNode(parent))) blocked = true;
        parent = parent.parentElement;
      }
      if (blocked && !filter) continue;
      const selected = activeSelectionPaths().includes(item.path);
      const row = document.createElement("div"); row.className = `layer-row${selected ? " selected" : ""}${item.path === state.referencePath ? " reference" : ""}`;
      row.style.setProperty("--depth", item.depth); row.tabIndex = 0; row.setAttribute("role", "treeitem"); row.setAttribute("aria-selected", String(selected));
      const hasChildren = !formulaAtom(item.node) && elementChildren(item.node).some((child) => !isHiddenDefinition(child));
      const disclosure = document.createElement("button"); disclosure.type = "button"; disclosure.className = `disclosure${!state.collapsed.has(item.path) ? " open" : ""}`; disclosure.textContent = hasChildren ? "›" : ""; disclosure.disabled = !hasChildren;
      disclosure.addEventListener("click", (event) => { event.stopPropagation(); state.collapsed.has(item.path) ? state.collapsed.delete(item.path) : state.collapsed.add(item.path); renderLayers(); });
      const icon = document.createElement("span"); icon.className = "layer-icon"; icon.textContent = nodeIcon(item.node);
      const label = document.createElement("span"); label.className = "layer-name"; label.textContent = nodeLabel(item.node);
      const tag = document.createElement("small"); tag.textContent = item.node.localName; label.append(tag);
      const activate = () => {
        if (state.referencePicking) {
          if (item.path === state.selectedPath) { announce("Bitte ein anderes Element als Referenz wählen.", true); return; }
          state.referencePath = item.path; state.referencePicking = false; renderAll(); announce(`Referenz gewählt: ${nodeLabel(item.node)}.`); return;
        }
        selectPath(item.path);
      };
      row.append(disclosure, icon, label); row.addEventListener("click", activate);
      row.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); activate(); } });
      fragment.append(row);
    }
    elements.layerTree.replaceChildren(fragment);
    elements.collapseLayersButton.textContent = state.layersCollapsed ? "+" : "−";
  }

  function renderBreadcrumb() {
    const node = selectedNode();
    if (!node) { elements.breadcrumb.innerHTML = "<span>Kein Element ausgewählt</span>"; return; }
    const ancestors = []; let current = node;
    while (current) { ancestors.unshift(current); if (current === state.document.documentElement) break; current = current.parentElement; }
    const fragment = document.createDocumentFragment();
    ancestors.slice(-4).forEach((item, index, array) => {
      const button = document.createElement("button"); button.type = "button"; button.textContent = nodeLabel(item); button.title = nodeLabel(item); button.addEventListener("click", () => selectPath(pathForNode(item))); fragment.append(button);
      if (index < array.length - 1) { const separator = document.createElement("i"); separator.textContent = "›"; fragment.append(separator); }
    });
    elements.breadcrumb.replaceChildren(fragment);
  }

  function renderGeometryFields() {
    const geometry = geometryForDisplay();
    const rootSelected = selectedNode() === state.document?.documentElement;
    const multiSelected = activeSelectionPaths().length > 1;
    elements.measureFields.forEach((input) => {
      input.disabled = !geometry || rootSelected || multiSelected || state.readOnly;
      input.value = geometry ? domain.formatNumber(geometry[input.dataset.geometry], 1) : "";
    });
  }

  function selectedTextNode() {
    const node = selectedNode();
    return node?.localName === "text" ? node : null;
  }

  function textLines(node) {
    const tspans = node ? [...node.children].filter((child) => child.localName === "tspan") : [];
    return tspans.length ? tspans.map((item) => {
      const clone = item.cloneNode(true);
      clone.querySelectorAll("[data-editor-bullet]").forEach((bullet) => bullet.remove());
      return clone.textContent || "";
    }) : [node?.textContent || ""];
  }

  function bulletMarker(style) { return ({ dash: "–", round: "●", square: "■", arrow: "→" })[style] || ""; }

  function textFontFamily(text) {
    if (!text) return '"Archivo", Arial, Helvetica, sans-serif';
    return text.style?.fontFamily || text.getAttribute("font-family") || (text.classList.contains("display") ? '"Oxanium", "Archivo", Arial, sans-serif' : '"Archivo", Arial, Helvetica, sans-serif');
  }

  function selectValueWithCustomOption(select, value) {
    select.querySelector('option[data-current-font="true"]')?.remove();
    if (![...select.options].some((option) => option.value === value) && value) {
      const option = document.createElement("option"); option.value = value; option.textContent = `Aktuell · ${value}`; option.dataset.currentFont = "true"; select.prepend(option);
    }
    select.value = value;
  }

  function attributeValue(node, name, fallback = "") {
    return node?.getAttribute(name) ?? fallback;
  }

  function safeColor(value, fallback) { return /^#[0-9a-f]{6}$/i.test(value || "") ? value : fallback; }

  function paletteFromTokens(tokens) {
    const colors = tokens?.colors || {};
    const entries = [
      ["Marineblau", colors.navy, "Basis"], ["Tiefes Marineblau", colors.navyDeep, "Basis"], ["Dunkles Marineblau", colors.navyDark, "Basis"],
      ["Marineblau 80 %", colors.navy80, "Basis"], ["Marineblau 60 %", colors.navy60, "Basis"], ["Marineblau 40 %", colors.navy40, "Basis"],
      ["Marineblau 20 %", colors.navy20, "Basis"], ["Marineblau 10 %", colors.navy10, "Basis"], ["Weiß", colors.surface, "Neutral"],
      ["Fläche hell", colors.surfaceSoft, "Neutral"], ["Education-Grün", colors.educationGreen, "Akzent"], ["Education-Grün hell", colors.educationGreen10, "Akzent"],
      ["Goldgelb", colors.educationGold, "Diagramm"], ["Koralle", colors.educationCoral, "Diagramm"], ["Stahlcyan", colors.educationSteelCyan, "Diagramm"],
      ["Graphitblau", colors.educationGraphiteBlue, "Diagramm"],
    ].filter(([, value]) => /^#[0-9a-f]{6}$/i.test(value || ""));
    return entries.length >= 12 ? entries.map(([name, value, role]) => ({ name, value: value.toUpperCase(), role })).concat({ name: "Keine Farbe", value: "none", role: "Neutral" }) : FALLBACK_BRAND_PALETTE;
  }

  async function loadBrandPalette() {
    state.brandPalette = FALLBACK_BRAND_PALETTE;
    try {
      const response = await fetch("/files/brand/reltest-education-slide-design-tokens.json");
      if (response.ok) state.brandPalette = paletteFromTokens(await response.json());
    } catch { /* Die fest eingebaute CI-Palette bleibt als Offline-Fallback aktiv. */ }
    renderBrandPalettes();
  }

  function paletteValue(panel) {
    const node = selectedNode();
    if (panel.dataset.paletteTarget === "text-fill") return selectedTextNode()?.getAttribute("fill") || "#142452";
    if (panel.dataset.paletteTarget === "bullet-color") return selectedTextNode()?.getAttribute("data-list-color") || "#142452";
    return node?.getAttribute(panel.dataset.paletteTarget) || "none";
  }

  function applyBrandColor(panel, color) {
    const target = panel.dataset.paletteTarget;
    if (target === "text-fill") {
      const text = selectedTextNode(); if (!text || color === "none") return;
      mutate(() => text.setAttribute("fill", color), `Textfarbe ${color} angewendet.`);
      return;
    }
    if (target === "bullet-color") {
      const text = selectedTextNode(); if (!text || color === "none") return;
      mutate(() => { text.setAttribute("data-list-color", color); applyTextContent(elements.textField.value); }, `Stichpunktfarbe ${color} angewendet.`);
      return;
    }
    const nodes = selectedNodes(); if (!nodes.length) return;
    mutate(() => nodes.forEach((node) => node.setAttribute(target, color)), `${target === "stroke" ? "Kontur" : "Füllung"} ${color} angewendet.`);
  }

  function renderBrandPalettes() {
    elements.brandPalettes.forEach((panel) => {
      const swatches = panel.querySelector(".brand-swatches"); if (!swatches) return;
      const current = String(paletteValue(panel)).toUpperCase();
      const palette = ["text-fill", "bullet-color"].includes(panel.dataset.paletteTarget) ? state.brandPalette.filter((color) => color.value !== "none") : state.brandPalette;
      const fragment = document.createDocumentFragment();
      palette.forEach((color) => {
        const button = document.createElement("button"); button.type = "button"; button.className = `brand-swatch${color.value === "none" ? " none" : ""}`;
        button.style.setProperty("--swatch", color.value === "none" ? "#FFFFFF" : color.value); button.title = `${color.name} · ${color.value} · ${color.role}`;
        button.setAttribute("aria-label", button.title); button.classList.toggle("active", color.value.toUpperCase() === current);
        button.disabled = state.readOnly || (["text-fill", "bullet-color"].includes(panel.dataset.paletteTarget) && !selectedTextNode());
        button.addEventListener("click", () => applyBrandColor(panel, color.value)); fragment.append(button);
      });
      swatches.replaceChildren(fragment);
    });
  }

  function renderInspector(switchTabForType = true) {
    const node = selectedNode(); const text = selectedTextNode(); const formula = formulaInfo();
    const selectionCount = activeSelectionPaths().length;
    if (!node) {
      elements.emptyInspector.hidden = false;
      $$(".inspector-content").forEach((panel) => { panel.hidden = true; });
      return;
    }
    elements.emptyInspector.hidden = true;
    if (switchTabForType && formula && state.activeTab === "element") state.activeTab = "formula";
    $$(".inspector-tab").forEach((tab) => { const active = tab.dataset.tab === state.activeTab; tab.classList.toggle("active", active); tab.setAttribute("aria-selected", String(active)); });
    $$(".inspector-content").forEach((panel) => { panel.hidden = panel.dataset.panel !== state.activeTab; });
    elements.elementType.textContent = selectionCount > 1 ? `${selectionCount} Elemente` : `${node.localName}${node.id ? ` · #${node.id}` : ""}`;
    const fill = attributeValue(node, "fill", "none"); const stroke = attributeValue(node, "stroke", "none");
    elements.fillTextField.value = fill; elements.fillField.value = safeColor(fill, "#ffffff");
    elements.strokeTextField.value = stroke; elements.strokeField.value = safeColor(stroke, "#142452");
    elements.strokeWidthField.value = attributeValue(node, "stroke-width", ""); elements.opacityField.value = attributeValue(node, "opacity", "1");
    const order = layerOrderState(node); const rootSelected = node === state.document.documentElement;
    elements.layerPosition.textContent = rootSelected || order.index < 0 ? "—" : `${order.index + 1} / ${order.count}`;
    $$('[data-layer-action]').forEach((button) => {
      const toBack = button.dataset.layerAction === "back" || button.dataset.layerAction === "backward";
      button.disabled = selectionCount > 1 || rootSelected || state.readOnly || order.count < 2 || (toBack ? order.index <= 0 : order.index >= order.count - 1);
    });
    const reference = nodeByPath(state.referencePath);
    elements.referenceStatus.textContent = reference ? nodeLabel(reference) : "Keine Referenz";
    elements.pickReferenceButton.disabled = selectionCount > 1 || rootSelected || state.readOnly;
    elements.pickReferenceButton.classList.toggle("active", state.referencePicking);
    elements.pickReferenceButton.textContent = state.referencePicking ? "Jetzt Referenz anklicken …" : "Referenz wählen";
    elements.clearReferenceButton.disabled = !reference;
    $$('[data-align]').forEach((button) => {
      button.disabled = selectionCount > 1 || rootSelected || state.readOnly || !reference || reference === node || (button.dataset.align === "dock" && reference.localName !== "line");
    });
    const connector = selectionCount === 1 && isConnector(node); const points = connectorPoints(node);
    elements.connectorSection.hidden = !connector;
    elements.connectorPointStatus.textContent = state.connectorPointIndex >= 0 && points[state.connectorPointIndex] ? `Punkt ${state.connectorPointIndex + 1} / ${points.length}` : `${points.length || 0} Punkte`;
    elements.addConnectorCorner.disabled = !connector || state.readOnly;
    elements.removeConnectorCorner.disabled = !connector || state.readOnly || points.length <= 2 || state.connectorPointIndex <= 0 || state.connectorPointIndex >= points.length - 1;
    elements.straightenConnectorHorizontal.disabled = !connector || state.readOnly;
    elements.straightenConnectorVertical.disabled = !connector || state.readOnly;
    $$('[data-connector-dock]').forEach((button) => { button.disabled = !connector || state.readOnly || !reference || reference === node || isConnector(reference); });
    const textDisabled = !text;
    elements.textField.disabled = textDisabled || state.readOnly; elements.textField.value = text ? textLines(text).join("\n") : "";
    elements.textTargetHint.textContent = text ? (text.id ? `#${text.id}` : "Text") : "Kein Text";
    elements.fontFamilyField.disabled = textDisabled || state.readOnly; selectValueWithCustomOption(elements.fontFamilyField, textFontFamily(text));
    elements.fontSizeField.disabled = textDisabled || state.readOnly; elements.fontSizeField.value = text ? attributeValue(text, "font-size", "") : "";
    elements.lineHeightField.disabled = textDisabled || state.readOnly; elements.lineHeightField.value = text ? attributeValue(text, "data-line-height", "1.25") : "";
    elements.fontWeightField.disabled = textDisabled || state.readOnly; elements.fontWeightField.value = text ? attributeValue(text, "font-weight", "400") : "400";
    elements.textFillField.disabled = textDisabled || state.readOnly; elements.textFillField.value = safeColor(text ? attributeValue(text, "fill", "#142452") : "", "#142452");
    elements.bulletStyleField.disabled = textDisabled || state.readOnly; elements.bulletStyleField.value = text ? attributeValue(text, "data-list-style", "none") : "none";
    elements.bulletColorField.disabled = textDisabled || state.readOnly; elements.bulletColorField.value = safeColor(text ? attributeValue(text, "data-list-color", "#142452") : "", "#142452");
    $$("[data-anchor]").forEach((button) => { button.disabled = textDisabled || state.readOnly; button.classList.toggle("active", text?.getAttribute("text-anchor") === button.dataset.anchor || (!text?.hasAttribute("text-anchor") && button.dataset.anchor === "start")); });
    renderFormulaInspector(formula);
    renderBrandPalettes();
  }

  function renderChrome() {
    const node = selectedNode(); const selectionCount = activeSelectionPaths().length; const dirty = state.document && signatureOf() !== state.savedSignature;
    elements.undoButton.disabled = state.historyIndex <= 0 || state.saving || state.readOnly;
    elements.redoButton.disabled = state.historyIndex >= state.history.length - 1 || state.saving || state.readOnly;
    elements.parentButton.disabled = !node?.parentElement;
    [elements.duplicateButton, elements.deleteButton, elements.inspectorDuplicate, elements.inspectorDelete].forEach((button) => { button.disabled = !node || node === state.document?.documentElement || state.readOnly || state.saving; });
    elements.saveButton.disabled = !dirty || state.readOnly || state.saving;
    elements.saveState.className = `save-state ${state.readOnly ? "error" : dirty ? "dirty" : "ok"}`;
    elements.saveState.textContent = state.saving ? "Speichert …" : state.readOnly ? "Schreibgeschützt" : dirty ? "Ungespeicherte Änderungen" : "Gespeichert";
    elements.zoomValue.textContent = `${Math.round(state.zoom * 100)}%`;
    elements.selectedStatus.textContent = state.referencePicking ? "Referenzmodus: Ziel anklicken" : selectionCount > 1 ? `${selectionCount} Elemente ausgewählt` : node ? `Ausgewählt: ${nodeLabel(node)} (${node.localName})` : "Nichts ausgewählt";
    elements.statusMessage.innerHTML = `<i class="status-dot"></i>${state.readOnly ? "Nur lesen" : dirty ? "Nicht gespeichert" : "Bereit"}`;
    const dimensions = rootDimensions(); elements.documentDimensions.textContent = `${domain.formatNumber(dimensions.width)} × ${domain.formatNumber(dimensions.height)} SVG-Einheiten`;
    renderGeometryFields();
  }

  function renderAll() { renderCanvas(); renderLayers(); renderBreadcrumb(); renderInspector(); renderVersions(); renderChrome(); }

  function startFieldTransaction(input) {
    if (state.fieldTransaction) return;
    state.fieldTransaction = { input, before: signatureOf() };
  }

  function finishFieldTransaction() {
    if (!state.fieldTransaction) return;
    state.fieldTransaction = null; commitHistory(); renderAll();
  }

  function applyGeometryField(input) {
    const geometry = geometryForDisplay(); const node = selectedNode(); const display = displayNode(); const parent = display?.parentElement;
    if (!geometry || !node || !parent) return;
    const target = Math.max(input.dataset.geometry === "width" || input.dataset.geometry === "height" ? 1 : -Infinity, domain.finiteNumber(input.value, geometry[input.dataset.geometry]));
    if (input.dataset.geometry === "x" || input.dataset.geometry === "y") {
      const root = elements.canvasDocument.querySelector(":scope > svg"); const rootMatrix = root.getScreenCTM(); const parentMatrix = parent.getScreenCTM();
      const originScreen = new DOMPoint(geometry.x, geometry.y).matrixTransform(rootMatrix);
      const desiredRoot = { x: geometry.x, y: geometry.y }; desiredRoot[input.dataset.geometry] = target;
      const desiredScreen = new DOMPoint(desiredRoot.x, desiredRoot.y).matrixTransform(rootMatrix);
      const inverse = parentMatrix.inverse(); const a = originScreen.matrixTransform(inverse); const b = desiredScreen.matrixTransform(inverse);
      const baseline = captureTransformBaseline(node); moveFromBaseline(node, baseline, b.x - a.x, b.y - a.y);
    } else {
      const oldBox = parentBox(display, parent); const next = { ...oldBox };
      next[input.dataset.geometry] = oldBox[input.dataset.geometry] * target / Math.max(geometry[input.dataset.geometry], .001);
      applyResize(node, captureTransformBaseline(node), oldBox, next);
    }
    renderCanvas(); renderInspector(false); renderChrome();
  }

  function setAttributeFromField(name, value) {
    const node = selectedNode(); if (!node) return;
    mutate(() => { if (value === "") node.removeAttribute(name); else node.setAttribute(name, value); }, "Darstellung aktualisiert.");
  }

  function applyTextContent(value) {
    const text = selectedTextNode(); if (!text) return;
    const lines = String(value).replace(/\r/g, "").split("\n");
    const firstTspan = [...text.children].find((child) => child.localName === "tspan");
    const x = text.getAttribute("x") || firstTspan?.getAttribute("x") || "0";
    const fontSize = domain.finiteNumber(text.getAttribute("font-size") || firstTspan?.getAttribute("font-size"), 24);
    const lineHeight = domain.normalizeLineHeight(text.getAttribute("data-line-height") || 1.25);
    const marker = bulletMarker(text.getAttribute("data-list-style") || "none");
    const markerColor = text.getAttribute("data-list-color") || "#142452";
    while (text.firstChild) text.firstChild.remove();
    lines.forEach((line, index) => {
      const tspan = state.document.createElementNS(SVG_NS, "tspan");
      tspan.setAttribute("x", x); tspan.setAttribute("dy", index === 0 ? "0" : domain.formatNumber(fontSize * lineHeight));
      if (marker && line.trim()) {
        const bullet = state.document.createElementNS(SVG_NS, "tspan"); bullet.setAttribute("data-editor-bullet", "true"); bullet.setAttribute("fill", markerColor); bullet.textContent = `${marker} `;
        tspan.append(bullet, state.document.createTextNode(line));
      } else tspan.textContent = line || " ";
      text.append(tspan);
    });
    text.setAttribute("data-line-height", domain.formatNumber(lineHeight));
  }

  function applyBulletStyle() {
    const text = selectedTextNode(); if (!text) return;
    mutate(() => {
      const style = elements.bulletStyleField.value;
      if (style === "none") { text.removeAttribute("data-list-style"); text.removeAttribute("data-list-color"); }
      else { text.setAttribute("data-list-style", style); text.setAttribute("data-list-color", elements.bulletColorField.value || "#142452"); }
      applyTextContent(elements.textField.value);
    }, "Stichpunkte aktualisiert.");
  }

  function externalFormulaPath(node) {
    if (!node) return "";
    const marker = node.getAttribute("data-formula-asset");
    if (marker && marker !== "true") return marker;
    if (node.localName === "image" && marker) return node.getAttribute("href") || node.getAttributeNS(XLINK_NS, "href") || "";
    return "";
  }

  function formulaInfo() {
    const node = selectedNode(); const atom = formulaAtom(node);
    if (!atom) return null;
    const path = externalFormulaPath(atom);
    if (path) {
      const asset = state.formulaAssets.get(normalizeAssetKey(path));
      return { type: "external", node: atom, path, asset, source: domain.extractFormulaSource(asset?.source || "", asset?.metadata) };
    }
    const source = atom.getAttribute("data-formula-source") || domain.extractFormulaSource(new XMLSerializer().serializeToString(atom));
    return { type: "nested", node: atom, source };
  }

  function renderFormulaInspector(info = formulaInfo()) {
    const source = info?.source || (state.activeTab === "formula" ? elements.formulaSourceField.value : "");
    if (document.activeElement !== elements.formulaSourceField || info) elements.formulaSourceField.value = source;
    elements.formulaMode.textContent = info ? (info.type === "external" ? "Externe Formel · MathJax-Pfade" : "Eingebettet · MathJax-Pfade") : "MathJax SVG-Pfadrenderer";
    elements.formulaHelp.textContent = info?.type === "external" ? `Formeldatei: ${info.path}. Vorschau und gespeicherte Datei verwenden exakt dasselbe Pfad-SVG.` : info ? "Die eingebettete Formel wird atomar durch echte mathematische SVG-Pfade ersetzt." : "Wähle zuerst eine vorhandene Formel. Eine normale Box oder Grafik wird nicht automatisch als Formel ersetzt.";
    elements.applyFormulaButton.disabled = true;
    updateFormulaPreview();
  }

  function formulaPreviewInput() {
    const dimensions = generatedFormulaDimensions(formulaInfo());
    return {
      formula: elements.formulaSourceField.value.trim() || "x",
      fontSize: domain.finiteNumber(elements.formulaFontSize.value, 34),
      color: elements.formulaColor.value || "#142452",
      width: dimensions.width,
      height: dimensions.height,
    };
  }

  async function requestFormulaPreview(input) {
    const key = JSON.stringify(input);
    if (state.formulaPreview && state.formulaPreviewKey === key) return state.formulaPreview;
    const requestId = ++state.formulaPreviewRequest;
    elements.applyFormulaButton.disabled = true;
    elements.formulaPreview.textContent = "Mathematische Vorschau wird gesetzt …";
    try {
      const response = await fetch("/api/svg-editor/formula-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const payload = await responseJson(response);
      if (requestId !== state.formulaPreviewRequest) return null;
      state.formulaPreview = payload.formula;
      state.formulaPreviewKey = key;
      const root = parseXml(payload.formula.source).documentElement;
      elements.formulaPreview.replaceChildren(document.importNode(root, true));
      elements.applyFormulaButton.disabled = state.readOnly || !formulaInfo();
      return payload.formula;
    } catch (error) {
      if (requestId === state.formulaPreviewRequest) {
        state.formulaPreview = null;
        state.formulaPreviewKey = "";
        elements.formulaPreview.textContent = `Vorschau nicht verfügbar: ${error.message}`;
        elements.applyFormulaButton.disabled = true;
      }
      return null;
    }
  }

  function updateFormulaPreview() {
    window.clearTimeout(state.formulaPreviewTimer);
    state.formulaPreviewTimer = window.setTimeout(() => requestFormulaPreview(formulaPreviewInput()), 140);
  }

  function generatedFormulaDimensions(info) {
    if (info?.type === "external" && info.asset?.source) {
      try { const root = parseXml(info.asset.source).documentElement; return { width: domain.finiteNumber(root.getAttribute("width"), 480), height: domain.finiteNumber(root.getAttribute("height"), 80) }; } catch { /* use fallback */ }
    }
    const geometry = geometryForDisplay(); return { width: geometry?.width || 480, height: geometry?.height || 80 };
  }

  async function applyFormula() {
    const selected = selectedNode(); const info = formulaInfo(); if (!selected || !info || state.readOnly) return;
    const rendered = await requestFormulaPreview(formulaPreviewInput());
    if (!rendered || selected !== selectedNode()) return;
    const { formula, source } = rendered;
    const dimensions = { width: rendered.width, height: rendered.height };
    mutate(() => {
      if (info?.type === "external") {
        const key = normalizeAssetKey(info.path);
        state.formulaAssets.set(key, { ...(info.asset || {}), path: info.path, source, metadata: { ...(info.asset?.metadata || {}), formula, tex: rendered.tex, fontSize: rendered.fontSize, renderer: rendered.renderer } });
        return;
      }
      const generated = parseXml(source).documentElement;
      const replacement = state.document.createElementNS(SVG_NS, "svg");
      const preserve = ["id", "class", "x", "y", "width", "height", "transform", "aria-label", "data-anim-target", "data-anim-label", "data-qc-role", "data-qc-group", "data-qc-layer", "data-qc-allow-overlap"];
      preserve.forEach((name) => { if (selected.hasAttribute(name)) replacement.setAttribute(name, selected.getAttribute(name)); });
      if (!replacement.hasAttribute("width")) replacement.setAttribute("width", domain.formatNumber(dimensions.width));
      if (!replacement.hasAttribute("height")) replacement.setAttribute("height", domain.formatNumber(dimensions.height));
      replacement.setAttribute("viewBox", generated.getAttribute("viewBox") || `0 0 ${dimensions.width} ${dimensions.height}`);
      replacement.setAttribute("data-formula-asset", "true"); replacement.setAttribute("data-formula-source", formula); replacement.setAttribute("data-renderer", rendered.renderer); replacement.setAttribute("data-qc-role", "formula");
      [...generated.childNodes].forEach((child) => replacement.append(state.document.importNode(child, true)));
      selected.replaceWith(replacement); state.selectedPath = pathForNode(replacement);
    }, "Formel übernommen.");
  }

  function renderVersions() {
    const versions = Array.isArray(state.data?.versions) ? state.data.versions : [];
    elements.versionCount.textContent = String(versions.length);
    const fragment = document.createDocumentFragment();
    versions.forEach((version) => {
      const row = document.createElement("div"); row.className = "version-row";
      const first = document.createElement("div"); const label = document.createElement("strong"); label.textContent = version.label || version.id || "Gespeicherte Version";
      const button = document.createElement("button"); button.type = "button"; button.textContent = "Wiederherstellen"; button.disabled = state.readOnly; button.addEventListener("click", () => restoreVersion(version)); first.append(label, button);
      const date = document.createElement("span"); const stamp = version.createdAt || version.timestamp; date.textContent = stamp ? new Date(stamp).toLocaleString("de-DE") : "";
      row.append(first, date); fragment.append(row);
    });
    if (!versions.length) { const empty = document.createElement("div"); empty.className = "version-row"; empty.textContent = "Noch keine Versionen."; fragment.append(empty); }
    elements.versionList.replaceChildren(fragment);
  }

  async function responseJson(response) {
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || payload.message || `HTTP ${response.status}`);
    return payload;
  }

  async function loadEditorData(payload, resetHistory = true) {
    const data = payload.svgEditor || payload;
    if (!data?.svg?.source) throw new Error("Die API hat keine SVG-Quelldatei geliefert.");
    state.data = data; state.svgPath = data.svg.path || ""; state.expectedSha256 = data.svg.documentSha256 || data.svg.sha256 || "";
    state.sourcePrefix = data.svg.source.slice(0, Math.max(0, data.svg.source.search(/<svg\b/i))); state.document = parseXml(data.svg.source);
    state.formulaAssets = new Map((data.formulaAssets || []).map((asset) => [normalizeAssetKey(asset.path), { ...asset }]));
    state.readOnly = Boolean(data.readOnly); state.selectedPath = ""; state.selectedPaths = []; state.connectorPointIndex = -1;
    if (resetHistory) { state.history = [snapshot()]; state.historyIndex = 0; state.savedSignature = signatureOf(); }
    const slide = data.slide || {}; elements.moduleLabel.textContent = slide.moduleTitle || slide.moduleId || "SVG-Editor"; elements.slideTitle.textContent = slide.title || slide.slideId || slide.id || state.slideId;
    document.title = `${elements.slideTitle.textContent} · SVG-Editor`;
    const sharedSlides = slide.sharedSlides || data.affectedSlides || [];
    const apiWarnings = Array.isArray(data.warnings) ? data.warnings.map((warning) => typeof warning === "string" ? warning : warning.message || warning.code).filter(Boolean) : [];
    const sharedFileWarning = sharedSlides.length > 1
      ? `Geteilte Datei – betroffen: ${sharedSlides.map((item) => typeof item === "string" ? item : item.slideId || item.id).filter(Boolean).join(", ")}`
      : "";
    const warning = [...new Set([data.sharedWarning, sharedFileWarning, ...apiWarnings].filter(Boolean))].join(" · ");
    elements.sharedWarning.hidden = !warning; elements.sharedWarning.textContent = typeof warning === "string" ? warning : warning.message || "Diese SVG-Datei wird mehrfach verwendet.";
    if (state.readOnly && data.readOnlyReason) announce(data.readOnlyReason, true);
    renderAll(); elements.app.setAttribute("aria-busy", "false");
  }

  async function initialize() {
    if (!domain) throw new Error("Die SVG-Editor-Domain konnte nicht geladen werden.");
    if (!state.slideId) throw new Error("In der URL fehlt die Folien-ID.");
    await loadBrandPalette();
    const response = await fetch(`/api/svg-editor?id=${encodeURIComponent(state.slideId)}&v=${Date.now()}`);
    await loadEditorData(await responseJson(response));
    requestAnimationFrame(fitZoom);
  }

  async function save() {
    if (elements.saveButton.disabled) return;
    finishFieldTransaction(); state.saving = true; renderChrome();
    try {
      const response = await fetch("/api/svg-editor/save", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: state.slideId, source: serializeDocument(), expectedSha256: state.expectedSha256, label: `Manuelle Bearbeitung ${new Date().toLocaleString("de-DE")}`, formulaAssets: serializeFormulaAssets() }),
      });
      const payload = await responseJson(response);
      state.saving = false;
      if (payload.svgEditor?.svg?.source || payload.svg?.source) await loadEditorData(payload);
      else { const fresh = await fetch(`/api/svg-editor?id=${encodeURIComponent(state.slideId)}&v=${Date.now()}`); await loadEditorData(await responseJson(fresh)); }
      announce("SVG und Formeln wurden gespeichert.");
    } catch (error) { state.saving = false; renderChrome(); announce(error.message, true); }
  }

  async function restoreVersion(version) {
    if (state.readOnly || !window.confirm(`Version „${version.label || version.id}“ wiederherstellen? Die aktuelle Fassung wird zuvor archiviert.`)) return;
    try {
      const response = await fetch("/api/svg-editor/restore", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: state.slideId, versionId: version.id || version.versionId, expectedSha256: state.expectedSha256 }) });
      await loadEditorData(await responseJson(response)); announce("Version wiederhergestellt.");
    } catch (error) { announce(error.message, true); }
  }

  function viewportCenterAnchor() {
    const rect = elements.canvasViewport.getBoundingClientRect();
    return { clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 };
  }

  function setZoom(value, anchor = null, autoFit = false) {
    const before = elements.canvasDocument.getBoundingClientRect();
    const anchorX = anchor?.clientX ?? before.left + before.width / 2;
    const anchorY = anchor?.clientY ?? before.top + before.height / 2;
    const relativeX = before.width ? domain.clamp((anchorX - before.left) / before.width, 0, 1) : .5;
    const relativeY = before.height ? domain.clamp((anchorY - before.top) / before.height, 0, 1) : .5;
    state.autoFit = autoFit; state.zoom = domain.clamp(value, .2, 4); renderCanvas(); renderChrome();
    if (anchor) {
      const after = elements.canvasDocument.getBoundingClientRect();
      elements.canvasViewport.scrollLeft += after.left + after.width * relativeX - anchorX;
      elements.canvasViewport.scrollTop += after.top + after.height * relativeY - anchorY;
    }
  }

  function normalizedWheel(event) {
    const factor = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? Math.max(1, elements.canvasViewport.clientHeight) : 1;
    return { deltaX: event.deltaX * factor, deltaY: event.deltaY * factor };
  }

  function handleCanvasWheel(event) {
    const wheel = normalizedWheel(event);
    event.preventDefault(); event.stopPropagation();
    if (event.ctrlKey || event.metaKey) {
      const delta = Math.abs(wheel.deltaY) >= Math.abs(wheel.deltaX) ? wheel.deltaY : wheel.deltaX;
      setZoom(domain.zoomFromWheel(state.zoom, delta), { clientX: event.clientX, clientY: event.clientY }, false);
      return;
    }
    const pan = domain.panFromWheel(wheel.deltaX, wheel.deltaY, event.shiftKey);
    elements.canvasViewport.scrollLeft += pan.dx;
    elements.canvasViewport.scrollTop += pan.dy;
  }

  function fitZoom() {
    const width = elements.canvasViewport.clientWidth - 36; const height = elements.canvasViewport.clientHeight - 36;
    if (width <= 0 || height <= 0) return;
    setZoom(Math.min(4, width / state.baseCanvasWidth, height / state.baseCanvasHeight), null, true);
  }

  function returnToViewer() {
    if (signatureOf() !== state.savedSignature && !window.confirm("Ungespeicherte Änderungen verwerfen und zum Viewer zurückkehren?")) return;
    location.href = state.slideId ? `/#${encodeURIComponent(state.slideId)}` : "/";
  }

  function announce(message, error = false) {
    clearTimeout(state.toastTimer); elements.toast.hidden = false; elements.toast.className = `toast${error ? " error" : ""}`; elements.toast.textContent = message;
    state.toastTimer = window.setTimeout(() => { elements.toast.hidden = true; }, 3600);
  }

  function showFatal(error) {
    elements.app.hidden = true; elements.fatalError.hidden = false; elements.fatalErrorText.textContent = error.message || String(error);
  }

  function bindImmediate(input, name, transform = (value) => value) {
    input.addEventListener("change", () => setAttributeFromField(name, transform(input.value)));
  }

  elements.undoButton.addEventListener("click", undo); elements.redoButton.addEventListener("click", redo); elements.parentButton.addEventListener("click", selectParent);
  elements.zoomOutButton.addEventListener("click", () => setZoom(state.zoom - .1, viewportCenterAnchor(), false)); elements.zoomInButton.addEventListener("click", () => setZoom(state.zoom + .1, viewportCenterAnchor(), false)); elements.zoomValue.addEventListener("click", fitZoom);
  elements.saveButton.addEventListener("click", save); elements.viewerButton.addEventListener("click", returnToViewer); elements.fatalBackButton.addEventListener("click", returnToViewer);
  [elements.duplicateButton, elements.inspectorDuplicate].forEach((button) => button.addEventListener("click", duplicateSelection));
  [elements.deleteButton, elements.inspectorDelete].forEach((button) => button.addEventListener("click", deleteSelection));
  elements.layerSearch.addEventListener("input", renderLayers); elements.collapseLayersButton.addEventListener("click", () => { state.layersCollapsed = !state.layersCollapsed; renderLayers(); });
  $$('[data-layer-action]').forEach((button) => button.addEventListener("click", () => moveLayer(button.dataset.layerAction)));
  elements.pickReferenceButton.addEventListener("click", () => {
    state.referencePicking = !state.referencePicking;
    renderAll();
    announce(state.referencePicking ? "Jetzt eine Linie oder ein anderes Element als Referenz anklicken." : "Referenzauswahl beendet.");
  });
  elements.clearReferenceButton.addEventListener("click", () => { state.referencePath = ""; state.referencePicking = false; renderAll(); announce("Referenz entfernt."); });
  $$('[data-align]').forEach((button) => button.addEventListener("click", () => alignToReference(button.dataset.align)));
  elements.addConnectorCorner.addEventListener("click", addConnectorCorner);
  elements.removeConnectorCorner.addEventListener("click", removeConnectorCorner);
  elements.straightenConnectorHorizontal.addEventListener("click", () => straightenConnector("horizontal"));
  elements.straightenConnectorVertical.addEventListener("click", () => straightenConnector("vertical"));
  $$('[data-connector-dock]').forEach((button) => button.addEventListener("click", () => dockConnectorToReference(button.dataset.connectorDock)));
  elements.versionsToggle.addEventListener("click", () => { const expanded = elements.versionsToggle.getAttribute("aria-expanded") !== "true"; elements.versionsToggle.setAttribute("aria-expanded", String(expanded)); elements.versionList.hidden = !expanded; });
  $$(".inspector-tab").forEach((tab) => tab.addEventListener("click", () => { state.activeTab = tab.dataset.tab; renderInspector(false); }));
  elements.formulaButton.addEventListener("click", () => { state.activeTab = "formula"; renderInspector(false); elements.formulaSourceField.focus(); });
  elements.measureFields.forEach((input) => { input.addEventListener("focus", () => startFieldTransaction(input)); input.addEventListener("input", () => applyGeometryField(input)); input.addEventListener("change", finishFieldTransaction); input.addEventListener("blur", finishFieldTransaction); });
  bindImmediate(elements.fillTextField, "fill"); bindImmediate(elements.strokeTextField, "stroke"); bindImmediate(elements.strokeWidthField, "stroke-width"); bindImmediate(elements.opacityField, "opacity");
  elements.fillField.addEventListener("input", () => { elements.fillTextField.value = elements.fillField.value; }); elements.fillField.addEventListener("change", () => setAttributeFromField("fill", elements.fillField.value));
  elements.strokeField.addEventListener("input", () => { elements.strokeTextField.value = elements.strokeField.value; }); elements.strokeField.addEventListener("change", () => setAttributeFromField("stroke", elements.strokeField.value));
  $$("[data-palette-target-button]").forEach((button) => button.addEventListener("click", () => {
    const panel = button.closest("[data-brand-palette]"); if (!panel) return;
    panel.dataset.paletteTarget = button.dataset.paletteTargetButton;
    panel.querySelectorAll("[data-palette-target-button]").forEach((candidate) => candidate.classList.toggle("active", candidate === button));
    renderBrandPalettes();
  }));
  elements.textField.addEventListener("focus", () => startFieldTransaction(elements.textField)); elements.textField.addEventListener("input", () => { applyTextContent(elements.textField.value); renderCanvas(); renderChrome(); }); elements.textField.addEventListener("blur", finishFieldTransaction);
  elements.fontFamilyField.addEventListener("change", () => mutate(() => {
    const text = selectedTextNode(); if (!text) return;
    text.setAttribute("font-family", elements.fontFamilyField.value); text.style.setProperty("font-family", elements.fontFamilyField.value);
  }, "Schriftart geändert."));
  elements.fontSizeField.addEventListener("change", () => mutate(() => selectedTextNode()?.setAttribute("font-size", domain.formatNumber(Math.max(1, domain.finiteNumber(elements.fontSizeField.value, 24)))), "Schriftgröße geändert."));
  elements.lineHeightField.addEventListener("change", () => mutate(() => { const text = selectedTextNode(); if (!text) return; text.setAttribute("data-line-height", domain.formatNumber(domain.normalizeLineHeight(elements.lineHeightField.value))); applyTextContent(elements.textField.value); }, "Zeilenhöhe geändert."));
  elements.fontWeightField.addEventListener("change", () => mutate(() => selectedTextNode()?.setAttribute("font-weight", elements.fontWeightField.value), "Schriftstärke geändert."));
  elements.textFillField.addEventListener("change", () => mutate(() => selectedTextNode()?.setAttribute("fill", elements.textFillField.value), "Textfarbe geändert."));
  elements.bulletStyleField.addEventListener("change", applyBulletStyle);
  elements.bulletColorField.addEventListener("change", () => { if (elements.bulletStyleField.value !== "none") applyBulletStyle(); });
  $$("[data-anchor]").forEach((button) => button.addEventListener("click", () => mutate(() => selectedTextNode()?.setAttribute("text-anchor", button.dataset.anchor), "Text ausgerichtet.")));
  [elements.formulaSourceField, elements.formulaFontSize, elements.formulaColor].forEach((input) => input.addEventListener("input", updateFormulaPreview));
  $$("[data-insert]").forEach((button) => button.addEventListener("click", () => {
    const input = elements.formulaSourceField; const start = input.selectionStart; const end = input.selectionEnd;
    const prepared = domain.prepareFormulaInsertion(button.dataset.insert, input.value.slice(start, end));
    input.setRangeText(prepared.text, start, end, "end"); input.setSelectionRange(start + prepared.selectionStart, start + prepared.selectionEnd); input.focus(); updateFormulaPreview();
  }));
  elements.applyFormulaButton.addEventListener("click", applyFormula);
  $$("#selectionBox [data-handle]").forEach((handle) => handle.addEventListener("pointerdown", startResize));
  $$("#selectionBox [data-line-handle]").forEach((handle) => handle.addEventListener("pointerdown", startLineEndpointResize));
  window.addEventListener("pointermove", handlePointerMove); window.addEventListener("pointerup", handlePointerUp);
  elements.canvasViewport.addEventListener("wheel", handleCanvasWheel, { passive: false });
  window.addEventListener("resize", () => { if (state.autoFit) requestAnimationFrame(fitZoom); else updateSelectionBox(); });
  window.addEventListener("beforeunload", (event) => { if (!state.document || signatureOf() === state.savedSignature) return; event.preventDefault(); event.returnValue = ""; });
  window.addEventListener("keydown", (event) => {
    const editing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || ""); const modifier = event.ctrlKey || event.metaKey;
    if (modifier && event.key.toLowerCase() === "s") { event.preventDefault(); save(); return; }
    if (modifier && !event.shiftKey && event.key.toLowerCase() === "z") { event.preventDefault(); undo(); return; }
    if (modifier && (event.key.toLowerCase() === "y" || event.shiftKey && event.key.toLowerCase() === "z")) { event.preventDefault(); redo(); return; }
    if (modifier && event.key.toLowerCase() === "d" && !editing) { event.preventDefault(); duplicateSelection(); return; }
    if (modifier && event.key === "[" && !editing) { event.preventDefault(); moveLayer(event.shiftKey ? "back" : "backward"); return; }
    if (modifier && event.key === "]" && !editing) { event.preventDefault(); moveLayer(event.shiftKey ? "front" : "forward"); return; }
    if (editing) return;
    if (event.key === "Delete" || event.key === "Backspace") { event.preventDefault(); deleteSelection(); return; }
    if (event.key === "Escape") { event.preventDefault(); selectParent(); return; }
    const amount = event.shiftKey || event.altKey ? 10 : 1;
    const directions = { ArrowLeft: [-amount, 0], ArrowRight: [amount, 0], ArrowUp: [0, -amount], ArrowDown: [0, amount] };
    if (directions[event.key]) { event.preventDefault(); nudgeSelection(...directions[event.key]); }
  });

  initialize().catch(showFatal);
})();

"use strict";

function buildCollectSvgLayoutExpression(params = {}) {
  return `(${collectSvgLayout.toString()})(${JSON.stringify(params)})`;
}

function collectSvgLayout(params) {
  const svg = document.querySelector("svg");
  if (!svg) {
    return {
      ok: false,
      error: "No SVG root found.",
      elements: [],
      markerDefs: [],
      viewBox: null,
    };
  }

  const viewBoxBase = svg.viewBox && svg.viewBox.baseVal
    ? {
        x: svg.viewBox.baseVal.x,
        y: svg.viewBox.baseVal.y,
        width: svg.viewBox.baseVal.width,
        height: svg.viewBox.baseVal.height,
      }
    : null;

  let runtimeCounter = 0;
  const runtimeAttr = "data-svg-qa-runtime-id";
  const allElements = [...svg.querySelectorAll("*")];

  for (const element of [svg, ...allElements]) {
    if (!element.getAttribute(runtimeAttr)) {
      runtimeCounter += 1;
      element.setAttribute(runtimeAttr, `qc_runtime_${runtimeCounter}`);
    }
  }

  function attr(element, name) {
    return element.getAttribute(name) || "";
  }

  function numberAttr(element, name) {
    const value = Number(attr(element, name));
    return Number.isFinite(value) ? value : null;
  }

  function inDefs(element) {
    return Boolean(element.closest("defs, marker, symbol"));
  }

  function hasVisiblePaint(style) {
    return style.fill !== "none" || style.stroke !== "none";
  }

  function roleFor(element) {
    const explicit = attr(element, "data-qc-role");
    if (explicit) return explicit;

    const tag = element.tagName.toLowerCase();
    const className = attr(element, "class");
    const id = attr(element, "id");
    const href = attr(element, "href") || attr(element, "xlink:href");

    if (tag === "svg") return "svg-root";
    if (tag === "text" || tag === "tspan") {
      if (/axis-label/.test(className)) return "axis-label";
      if (/legend/i.test(id) || /legend/i.test(className)) return "legend-text";
      if (/timeline/i.test(id)) return "timeline-label";
      return "text";
    }
    if (tag === "image" && attr(element, "data-formula-asset")) return "formula";
    if (tag === "rect") {
      if (/background/i.test(id)) return "slide-background";
      if (/legend/i.test(id) || /legend/i.test(className)) return "legend-background";
      if (/surface|soft|note|muted-panel|chip/.test(className)) return "background-box";
      return "shape";
    }
    if ((tag === "line" || tag === "path") && /grid/.test(className)) return "grid-line";
    if ((tag === "line" || tag === "path") && /axis/.test(className)) return "axis-line";
    if ((tag === "line" || tag === "path") && /failure/.test(className)) return "cross-marker-part";
    if ((tag === "line" || tag === "path") && (attr(element, "marker-end") || attr(element, "marker-start"))) return "arrow";
    if (tag === "polygon" && /arrow|head|axis/i.test(id + " " + className)) return "arrow-head";
    if (tag === "use" && /symbol_failure/i.test(href)) return "cross-marker";
    if (tag === "use" && /symbol_censored/i.test(href)) return "timeline-marker";
    if (tag === "circle" && /marker|point/i.test(id + " " + className)) return "data-point";
    if (tag === "g" && /axis/i.test(id)) return "axis";
    if (tag === "g" && /legend/i.test(id)) return "legend";
    if (tag === "g" && /callout/i.test(id)) return "callout";
    return tag;
  }

  function layerFor(role, element) {
    const explicit = attr(element, "data-qc-layer");
    if (explicit) return explicit;
    if (/background/.test(role)) return "background";
    if (role === "grid-line") return "grid";
    if (role === "axis-line" || role === "axis") return "axis";
    if (role === "data-point") return "data";
    if (role === "cross-marker" || role === "timeline-marker") return "marker";
    if (/arrow/.test(role)) return "arrow";
    if (/box|shape/.test(role)) return "box";
    if (/label/.test(role)) return "label";
    if (/text|formula/.test(role)) return "text";
    return "";
  }

  function clientToSvg(clientX, clientY) {
    const matrix = svg.getScreenCTM();
    if (!matrix) return { x: clientX, y: clientY };
    const point = svg.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    const mapped = point.matrixTransform(matrix.inverse());
    return { x: mapped.x, y: mapped.y };
  }

  function svgToClient(x, y) {
    const matrix = svg.getScreenCTM();
    if (!matrix) return { x, y };
    const point = svg.createSVGPoint();
    point.x = x;
    point.y = y;
    const mapped = point.matrixTransform(matrix);
    return { x: mapped.x, y: mapped.y };
  }

  function rectToSvg(rect) {
    const p1 = clientToSvg(rect.left, rect.top);
    const p2 = clientToSvg(rect.right, rect.bottom);
    const left = Math.min(p1.x, p2.x);
    const right = Math.max(p1.x, p2.x);
    const top = Math.min(p1.y, p2.y);
    const bottom = Math.max(p1.y, p2.y);
    return {
      left,
      top,
      right,
      bottom,
      width: Math.max(0, right - left),
      height: Math.max(0, bottom - top),
    };
  }

  function clientRect(element) {
    const rect = element.getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height,
    };
  }

  function bboxFor(element) {
    const rect = clientRect(element);
    let svgBBox = null;
    try {
      if (typeof element.getBBox === "function") {
        const box = element.getBBox();
        svgBBox = {
          left: box.x,
          top: box.y,
          right: box.x + box.width,
          bottom: box.y + box.height,
          width: box.width,
          height: box.height,
        };
      }
    } catch {
      svgBBox = null;
    }
    return {
      client: rect,
      svg: rectToSvg(rect),
      local: svgBBox,
    };
  }

  function samplePoints(svgRect) {
    if (!svgRect || svgRect.width <= 0 || svgRect.height <= 0) return [];
    const insetX = Math.min(svgRect.width * 0.18, 8);
    const insetY = Math.min(svgRect.height * 0.18, 8);
    const points = [
      { x: svgRect.left + svgRect.width / 2, y: svgRect.top + svgRect.height / 2, name: "center" },
      { x: svgRect.left + insetX, y: svgRect.top + insetY, name: "top_left" },
      { x: svgRect.right - insetX, y: svgRect.top + insetY, name: "top_right" },
      { x: svgRect.left + insetX, y: svgRect.bottom - insetY, name: "bottom_left" },
      { x: svgRect.right - insetX, y: svgRect.bottom - insetY, name: "bottom_right" },
    ];
    return points.filter((point) =>
      Number.isFinite(point.x) &&
      Number.isFinite(point.y) &&
      point.x >= (viewBoxBase?.x ?? -Infinity) - 100 &&
      point.y >= (viewBoxBase?.y ?? -Infinity) - 100
    );
  }

  function stackAt(svgPoint) {
    const client = svgToClient(svgPoint.x, svgPoint.y);
    const stack = document.elementsFromPoint(client.x, client.y)
      .filter((element) => svg.contains(element) && !inDefs(element))
      .slice(0, 12)
      .map((element) => ({
        id: attr(element, "id"),
        runtimeId: attr(element, runtimeAttr),
        tag: element.tagName.toLowerCase(),
        role: roleFor(element),
      }));
    return {
      point: svgPoint,
      client,
      stack,
    };
  }

  function ancestorIds(element) {
    const ancestors = [];
    let current = element.parentElement;
    while (current && current !== svg.parentElement) {
      if (svg.contains(current)) {
        ancestors.push({
          id: attr(current, "id"),
          runtimeId: attr(current, runtimeAttr),
          tag: current.tagName.toLowerCase(),
        });
      }
      current = current.parentElement;
    }
    return ancestors;
  }

  const elements = [];
  let domIndex = 0;
  for (const element of [svg, ...allElements]) {
    if (inDefs(element) || ["defs", "style", "title", "desc", "metadata"].includes(element.tagName.toLowerCase())) {
      continue;
    }

    domIndex += 1;
    const style = getComputedStyle(element);
    const role = roleFor(element);
    const bbox = bboxFor(element);
    const opacity = Number(style.opacity);
    const visible =
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      Number.isFinite(opacity) &&
      opacity > 0 &&
      hasVisiblePaint(style) &&
      (bbox.client.width > 0 || bbox.client.height > 0 || ["line", "path"].includes(element.tagName.toLowerCase()));
    const dataQcAttributes = [...element.attributes]
      .filter((item) => item.name.startsWith("data-qc-"))
      .reduce((result, item) => ({ ...result, [item.name]: item.value }), {});

    const points = samplePoints(bbox.svg);
    elements.push({
      id: attr(element, "id"),
      runtimeId: attr(element, runtimeAttr),
      tag: element.tagName.toLowerCase(),
      role,
      layer: layerFor(role, element),
      domIndex,
      parentRuntimeId: element.parentElement ? attr(element.parentElement, runtimeAttr) : "",
      parentId: element.parentElement ? attr(element.parentElement, "id") : "",
      ancestors: ancestorIds(element),
      bbox,
      visible,
      animationHidden: Boolean(element.closest("[data-svg-qa-animation-hidden='true']")),
      text: element.textContent ? element.textContent.replace(/\s+/g, " ").trim() : "",
      computedStyle: {
        display: style.display,
        visibility: style.visibility,
        opacity: Number.isFinite(opacity) ? opacity : null,
        fill: style.fill,
        stroke: style.stroke,
        strokeWidth: style.strokeWidth,
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        pointerEvents: style.pointerEvents,
        clipPath: style.clipPath,
        mask: style.mask,
      },
      qc: {
        role: attr(element, "data-qc-role"),
        group: attr(element, "data-qc-group"),
        box: attr(element, "data-qc-box"),
        padding: attr(element, "data-qc-padding"),
        layer: attr(element, "data-qc-layer"),
        important: attr(element, "data-qc-important") === "true",
        allowHidden: attr(element, "data-qc-allow-hidden") === "true" || Boolean(element.closest("[data-qc-allow-hidden='true']")),
        above: attr(element, "data-qc-above"),
        below: attr(element, "data-qc-below"),
        allowOverlap: attr(element, "data-qc-allow-overlap") === "true" || Boolean(element.closest("[data-qc-allow-overlap='true']")),
        expectedTop: attr(element, "data-qc-expected-top") === "true",
        plot: attr(element, "data-qc-plot"),
        axis: attr(element, "data-qc-axis"),
      },
      attributes: {
        class: attr(element, "class"),
        href: attr(element, "href") || attr(element, "xlink:href"),
        markerStart: attr(element, "marker-start"),
        markerMid: attr(element, "marker-mid"),
        markerEnd: attr(element, "marker-end"),
        x1: numberAttr(element, "x1"),
        y1: numberAttr(element, "y1"),
        x2: numberAttr(element, "x2"),
        y2: numberAttr(element, "y2"),
        points: attr(element, "points"),
        d: attr(element, "d"),
        ...dataQcAttributes,
      },
      hitTests: points.map(stackAt),
    });
  }

  const markerDefs = [...svg.querySelectorAll("marker")].map((marker) => ({
    id: attr(marker, "id"),
    role: attr(marker, "data-qc-role") || "arrow-head-def",
    viewBox: attr(marker, "viewBox"),
    refX: numberAttr(marker, "refX"),
    refY: numberAttr(marker, "refY"),
    markerWidth: numberAttr(marker, "markerWidth"),
    markerHeight: numberAttr(marker, "markerHeight"),
    orient: attr(marker, "orient"),
    childCount: marker.children.length,
    hasPaintedChild: Boolean(marker.querySelector("path, polygon, polyline, line, circle, rect")),
  }));

  const elementsWithDataQc = elements.filter((element) =>
    Object.keys(element.attributes).some((name) => name.startsWith("data-qc-"))
  ).length;

  return {
    ok: true,
    file: params.file || "",
    state: params.state || null,
    viewBox: viewBoxBase,
    svgClientRect: clientRect(svg),
    elements,
    markerDefs,
    qcStats: {
      elementsWithDataQc,
      totalElements: elements.length,
    },
    fonts: {
      status: document.fonts ? document.fonts.status : "unavailable",
      archivoCheck: document.fonts ? document.fonts.check("16px Archivo") : null,
      oxaniumCheck: document.fonts ? document.fonts.check("16px Oxanium") : null,
    },
  };
}

module.exports = {
  buildCollectSvgLayoutExpression,
};

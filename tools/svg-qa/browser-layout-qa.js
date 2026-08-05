"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const { pathToFileURL } = require("url");
const { spawn } = require("child_process");

const { buildAnimationStates, buildApplyAnimationStateExpression } = require("./animation-layout-rules");
const { buildCollectSvgLayoutExpression } = require("./collect-svg-layout");
const { defaultLayoutQaConfig, normalizeLayoutOptions } = require("./layout-config");
const { makeLayoutIssue, summarizeLayout } = require("./layout-report");
const { runLayoutRules } = require("./layout-rules");
const { runLayerRules } = require("./layer-rules");
const { runArrowRules } = require("./arrow-rules");
const { runAxisRules } = require("./axis-rules");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isInside(parent, child) {
  const relative = path.relative(parent, child);
  return !relative.startsWith("..") && !path.isAbsolute(relative);
}

function toPosixPath(root, filePath) {
  return path.relative(root, filePath).split(path.sep).join("/");
}

function parseSlideNumber(filePath) {
  const match = path.basename(filePath).match(/(?:slide|folie|page)[_-]?(\d+)/i) ||
    path.dirname(filePath).match(/(?:slide|folie|page)[_-]?(\d+)/i);
  return match ? match[1].padStart(3, "0") : "";
}

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function findBrowserExecutable() {
  const candidates = [
    process.env.SVG_QA_BROWSER,
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  ].filter(Boolean);

  return candidates.find((candidate) => fs.existsSync(candidate)) || "";
}

function randomPort() {
  return 4800 + Math.floor(Math.random() * 1200);
}

class CdpClient {
  constructor(webSocketUrl) {
    this.webSocketUrl = webSocketUrl;
    this.socket = null;
    this.nextId = 1;
    this.pending = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(this.webSocketUrl);
      const cleanup = () => {
        this.socket.removeEventListener("open", handleOpen);
        this.socket.removeEventListener("error", handleError);
      };
      const handleOpen = () => {
        cleanup();
        this.socket.addEventListener("message", (event) => this.handleMessage(event));
        this.socket.addEventListener("close", () => this.rejectAll(new Error("CDP socket closed.")));
        resolve();
      };
      const handleError = (event) => {
        cleanup();
        reject(new Error(`CDP socket error: ${event.message || "unknown error"}`));
      };
      this.socket.addEventListener("open", handleOpen);
      this.socket.addEventListener("error", handleError);
    });
  }

  handleMessage(event) {
    let payload;
    try {
      payload = JSON.parse(event.data);
    } catch {
      return;
    }
    if (!payload.id || !this.pending.has(payload.id)) return;
    const { resolve, reject } = this.pending.get(payload.id);
    this.pending.delete(payload.id);
    if (payload.error) {
      reject(new Error(payload.error.message || JSON.stringify(payload.error)));
    } else {
      resolve(payload.result || {});
    }
  }

  rejectAll(error) {
    for (const { reject } of this.pending.values()) reject(error);
    this.pending.clear();
  }

  send(method, params = {}) {
    const id = this.nextId;
    this.nextId += 1;
    const payload = JSON.stringify({ id, method, params });
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(payload);
    });
  }

  close() {
    if (this.socket) this.socket.close();
  }
}

async function waitForBrowser(port) {
  const url = `http://127.0.0.1:${port}/json/version`;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch {
      // Retry while Chromium starts.
    }
    await sleep(125);
  }
  throw new Error("Headless browser remote debugging endpoint did not start.");
}

async function createPage(port) {
  const response = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" });
  if (!response.ok) throw new Error(`Could not create browser page: HTTP ${response.status}`);
  const target = await response.json();
  const client = new CdpClient(target.webSocketDebuggerUrl);
  await client.connect();
  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 2200,
    height: 1400,
    deviceScaleFactor: 1,
    mobile: false,
  });
  return { client, targetId: target.id };
}

async function closePage(port, page) {
  try {
    page.client.close();
  } catch {
    // Best effort cleanup.
  }
  if (page.targetId) {
    try {
      await fetch(`http://127.0.0.1:${port}/json/close/${page.targetId}`);
    } catch {
      // Best effort cleanup.
    }
  }
}

async function launchBrowser() {
  const executable = findBrowserExecutable();
  if (!executable) {
    throw new Error("No Chromium-based browser found. Set SVG_QA_BROWSER to an Edge/Chrome executable.");
  }

  const port = randomPort();
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "svg-layout-qa-"));
  const child = spawn(executable, [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--run-all-compositor-stages-before-draw",
    "--disable-extensions",
    "--disable-background-networking",
    "--disable-default-apps",
    "--no-first-run",
    "--no-default-browser-check",
    "--allow-file-access-from-files",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    "about:blank",
  ], {
    windowsHide: true,
    stdio: "ignore",
  });

  try {
    await waitForBrowser(port);
    return { executable, port, userDataDir, child };
  } catch (error) {
    child.kill();
    throw error;
  }
}

function stopBrowser(browser) {
  if (!browser) return;
  try {
    browser.child.kill();
  } catch {
    // Best effort cleanup.
  }
  if (browser.userDataDir && isInside(os.tmpdir(), browser.userDataDir)) {
    try {
      fs.rmSync(browser.userDataDir, { recursive: true, force: true });
    } catch {
      // Best effort cleanup.
    }
  }
}

function extractViewBox(svgText) {
  const match = svgText.match(/\bviewBox\s*=\s*["']([^"']+)["']/i);
  if (!match) return { width: 1920, height: 1080 };
  const parts = match[1].trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isFinite(part))) {
    return { width: 1920, height: 1080 };
  }
  return { x: parts[0], y: parts[1], width: parts[2], height: parts[3] };
}

async function evaluate(client, expression, options = {}) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise: Boolean(options.awaitPromise),
    returnByValue: true,
    timeout: options.timeout || 10000,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || "Browser evaluation failed.");
  }
  return result.result ? result.result.value : null;
}

async function loadSvg(client, svgPath) {
  const svgText = fs.readFileSync(svgPath, "utf8").replace(/^\uFEFF/, "");
  const viewBox = extractViewBox(svgText);
  const baseUrl = pathToFileURL(path.dirname(svgPath) + path.sep).href;
  const html = [
    "<!doctype html><html><head><meta charset=\"utf-8\">",
    `<base href="${baseUrl}">`,
    "<style>",
    "html,body{margin:0;padding:0;background:white;}",
    "#stage{position:relative;display:block;margin:0;padding:0;}",
    `#stage>svg{display:block;width:${viewBox.width}px;height:${viewBox.height}px;}`,
    "</style></head><body><div id=\"stage\"></div></body></html>",
  ].join("");

  await evaluate(client, `(() => {
    document.open();
    document.write(${JSON.stringify(html)});
    document.close();
    const stage = document.getElementById("stage");
    stage.innerHTML = ${JSON.stringify(svgText)};
    const svg = document.querySelector("svg");
    if (!svg) throw new Error("SVG root missing after injection.");
    svg.style.width = ${JSON.stringify(`${viewBox.width}px`)};
    svg.style.height = ${JSON.stringify(`${viewBox.height}px`)};
    window.__svgQaOriginalStyles = {};
    for (const target of svg.querySelectorAll("[id]")) {
      window.__svgQaOriginalStyles[target.id] = target.getAttribute("style");
    }
    return true;
  })()`, { awaitPromise: true });

  await evaluate(client, `Promise.all([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    ...Array.from(document.images || []).map((image) => image.decode ? image.decode().catch(() => null) : Promise.resolve())
  ]).then(() => true)`, { awaitPromise: true });
}

async function collectLayout(client, params) {
  return evaluate(client, buildCollectSvgLayoutExpression(params), { awaitPromise: true, timeout: 20000 });
}

function runRules(layout, context, config) {
  return [
    ...runLayoutRules(layout, context, config),
    ...runLayerRules(layout, context, config),
    ...runArrowRules(layout, context, config),
    ...runAxisRules(layout, context, config),
  ];
}

async function runSvgLayoutQa(page, svgPath, repoRoot, options, config) {
  const relativeFile = toPosixPath(repoRoot, svgPath);
  const internalManifestPath = path.join(path.dirname(svgPath), "scene.animation.v1.json");
  const handoffManifestPath = path.join(
    path.dirname(svgPath),
    `${path.basename(svgPath, path.extname(svgPath))}.animation.v1.json`,
  );
  const manifestPath = fs.existsSync(internalManifestPath)
    ? internalManifestPath
    : handoffManifestPath;
  const manifest = readJsonIfExists(manifestPath);
  const animation = buildAnimationStates(manifest, {
    timesSeconds: options.timesSeconds,
    includeEndState: config.animation.includeEndState,
  });
  const fileResult = {
    path: relativeFile,
    slide: parseSlideNumber(svgPath),
    states_checked: 0,
    browser_rendered: true,
  };
  const issues = [];

  await loadSvg(page.client, svgPath);

  for (let stateIndex = 0; stateIndex < animation.states.length; stateIndex += 1) {
    const state = animation.states[stateIndex];
    if (manifest) {
      await evaluate(
        page.client,
        buildApplyAnimationStateExpression(animation.manifest, animation.timeline, state),
        { awaitPromise: true },
      );
    }

    const layout = await collectLayout(page.client, {
      file: relativeFile,
      state,
    });
    fileResult.states_checked += 1;

    if (!layout || !layout.ok) {
      issues.push(makeLayoutIssue({
        ...options,
        file: relativeFile,
        slide: fileResult.slide,
        stateIndex,
        stateLabel: state.label,
        timeSeconds: state.timeSeconds,
      }, {
        rule: "layout_collect",
        message: "Browser layout collection failed.",
        actual: layout || null,
        recommendation: "Check whether the SVG can be rendered by Chromium.",
      }));
      continue;
    }

    issues.push(...runRules(layout, {
      ...options,
      file: relativeFile,
      slide: fileResult.slide,
      stateIndex,
      stateLabel: state.label,
      timeSeconds: state.timeSeconds,
    }, config));
  }

  return { fileResult, issues };
}

async function runBrowserLayoutQa({ svgFiles, repoRoot, options = {}, config = defaultLayoutQaConfig }) {
  const layoutOptions = normalizeLayoutOptions(options);
  const layout = {
    checked: true,
    strict: layoutOptions.strict,
    warnOnly: layoutOptions.warnOnly,
    browser: null,
    files: [],
    issues: [],
  };

  let browser = null;
  let page = null;
  try {
    browser = await launchBrowser();
    layout.browser = {
      executable: browser.executable,
      port: browser.port,
    };
    page = await createPage(browser.port);

    for (const svgPath of svgFiles) {
      try {
        const result = await runSvgLayoutQa(page, svgPath, repoRoot, layoutOptions, config);
        layout.files.push(result.fileResult);
        layout.issues.push(...result.issues);
      } catch (error) {
        const relativeFile = toPosixPath(repoRoot, svgPath);
        layout.files.push({
          path: relativeFile,
          slide: parseSlideNumber(svgPath),
          states_checked: 0,
          browser_rendered: false,
        });
        layout.issues.push(makeLayoutIssue({
          ...layoutOptions,
          file: relativeFile,
          slide: parseSlideNumber(svgPath),
          stateIndex: 0,
          stateLabel: "",
          timeSeconds: null,
        }, {
          rule: "layout_browser_render",
          message: "SVG layout QA failed for this file.",
          actual: error.message,
          recommendation: "Check SVG syntax, external references, and browser-renderability.",
        }));
      }
    }
  } catch (error) {
    layout.issues.push(makeLayoutIssue(layoutOptions, {
      rule: "layout_browser_unavailable",
      message: "Browser-based layout QA could not start.",
      actual: error.message,
      recommendation: "Install Edge/Chrome or set SVG_QA_BROWSER to a Chromium executable.",
    }));
  } finally {
    if (page && browser) await closePage(browser.port, page);
    stopBrowser(browser);
  }

  layout.summary = summarizeLayout(layout);
  return layout;
}

module.exports = {
  closePage,
  createPage,
  launchBrowser,
  runBrowserLayoutQa,
  stopBrowser,
};

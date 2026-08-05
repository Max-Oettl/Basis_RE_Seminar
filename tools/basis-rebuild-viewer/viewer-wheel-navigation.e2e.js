"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const viewerUrl = process.argv[2] || "http://127.0.0.1:4174/";
const testStructure = process.argv.includes("--structure-test");
const trainingStructurePath = path.resolve(__dirname, "..", "..", "analysis", "viewer-notes", "training-structure.json");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function browserExecutable() {
  return [
    process.env.SVG_QA_BROWSER,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  ].filter(Boolean).find((candidate) => fs.existsSync(candidate));
}

class CdpClient {
  constructor(webSocketUrl) {
    this.webSocketUrl = webSocketUrl;
    this.nextId = 1;
    this.pending = new Map();
    this.events = [];
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(this.webSocketUrl);
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
      this.socket.addEventListener("message", (event) => this.handleMessage(event));
    });
  }

  handleMessage(event) {
    const payload = JSON.parse(event.data);
    if (!payload.id) {
      this.events.push(payload);
      return;
    }
    const pending = this.pending.get(payload.id);
    if (!pending) return;
    this.pending.delete(payload.id);
    if (payload.error) pending.reject(new Error(payload.error.message));
    else pending.resolve(payload.result || {});
  }

  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.socket?.close();
  }
}

async function waitForBrowser(port) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) return;
    } catch {
      // Browser is still starting.
    }
    await sleep(100);
  }
  throw new Error("Headless browser did not start.");
}

async function evaluate(client, expression) {
  const response = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (response.exceptionDetails) {
    throw new Error(response.exceptionDetails.text || "Browser evaluation failed.");
  }
  return response.result?.value;
}

async function waitFor(client, expression, message) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (await evaluate(client, expression)) return;
    await sleep(100);
  }
  throw new Error(message);
}

async function activeSlide(client) {
  return evaluate(client, `document.querySelector(".slide-item.active .slide-meta")?.textContent.trim() || ""`);
}

async function wheelOnComparison(client, deltaY) {
  const point = await evaluate(client, `(() => {
    const rect = document.querySelector(".compare-grid").getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: Math.min(innerHeight - 20, rect.top + rect.height / 2) };
  })()`);
  await client.send("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x: point.x,
    y: point.y,
  });
  await client.send("Input.dispatchMouseEvent", {
    type: "mouseWheel",
    x: point.x,
    y: point.y,
    deltaX: 0,
    deltaY,
  });
}

async function postStructure(action, values = {}) {
  const response = await fetch(new URL("/api/training-structure", viewerUrl), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...values }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || `HTTP ${response.status}`);
  return payload.result;
}

async function main() {
  const executable = browserExecutable();
  assert.ok(executable, "Edge or Chrome is required for the viewer E2E test.");
  const port = 6200 + Math.floor(Math.random() * 500);
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "viewer-wheel-e2e-"));
  const browser = spawn(executable, [
    "--headless=new",
    "--disable-gpu",
    "--disable-extensions",
    "--no-first-run",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    "about:blank",
  ], { windowsHide: true, stdio: "ignore" });

  let client;
  let originalTrainingStructure = null;
  try {
    if (testStructure) {
      originalTrainingStructure = fs.readFileSync(trainingStructurePath, "utf8");
      const chapter = await postStructure("create_chapter", {
        moduleId: "RE1",
        title: "E2E Kapitel",
      });
      const lesson = await postStructure("create_lesson", {
        moduleId: "RE1",
        chapterId: chapter.chapter.id,
        title: "E2E Lektion",
      });
      await postStructure("assign_scene", {
        moduleId: "RE1",
        slideId: "RE1::1",
        chapterId: chapter.chapter.id,
        lessonId: lesson.lesson.id,
      });
    }
    await waitForBrowser(port);
    const pageResponse = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" });
    const page = await pageResponse.json();
    client = new CdpClient(page.webSocketDebuggerUrl);
    await client.connect();
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Log.enable");
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: 1600,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await client.send("Page.navigate", { url: viewerUrl });
    await waitFor(
      client,
      `document.readyState === "complete" && document.querySelectorAll(".slide-item").length > 1 && Boolean(document.querySelector(".slide-item.active"))`,
      "Viewer did not render a selectable slide list.",
    );

    assert.equal(await evaluate(client, "document.title"), "Basis Rebuild Viewer");
    const initial = await activeSlide(client);
    assert.ok(initial, "No active slide before wheel navigation.");

    if (testStructure) {
      const structureState = await evaluate(client, `(() => ({
        moduleValues: [...document.querySelectorAll("#moduleFilter option")].map((option) => option.value),
        chapterVisible: [...document.querySelectorAll(".structure-heading strong")].some((node) => node.textContent === "E2E Kapitel"),
        lessonVisible: [...document.querySelectorAll(".structure-heading strong")].some((node) => node.textContent === "E2E Lektion"),
        selectedChapter: document.querySelector("#sceneChapter")?.selectedOptions[0]?.textContent || "",
        selectedLesson: document.querySelector("#sceneLesson")?.selectedOptions[0]?.textContent || "",
      }))()`);
      assert.ok(structureState.moduleValues.length >= 1, "Module selector is empty.");
      assert.ok(structureState.moduleValues.every(Boolean), "Module selector still contains an all-modules option.");
      assert.equal(structureState.chapterVisible, true, "Chapter is missing in the sidebar hierarchy.");
      assert.equal(structureState.lessonVisible, true, "Lesson is missing in the sidebar hierarchy.");
      assert.equal(structureState.selectedChapter, "E2E Kapitel");
      assert.equal(structureState.selectedLesson, "E2E Lektion");

      await evaluate(client, `(() => {
        const label = [...document.querySelectorAll(".structure-heading strong")]
          .find((node) => node.textContent === "E2E Kapitel");
        label?.closest(".structure-heading")?.querySelector(".structure-toggle")?.click();
        return true;
      })()`);
      await sleep(100);
      assert.equal(
        await evaluate(client, `[...document.querySelectorAll(".structure-heading strong")].some((node) => node.textContent === "E2E Lektion")`),
        false,
        "Collapsing a chapter did not hide its lessons.",
      );
    }

    await wheelOnComparison(client, 120);
    await wheelOnComparison(client, 120);
    await wheelOnComparison(client, 120);
    await sleep(350);
    const next = await activeSlide(client);
    assert.notEqual(next, initial, "Wheel down did not move to the next slide.");

    await wheelOnComparison(client, -120);
    await sleep(350);
    assert.equal(await activeSlide(client), initial, "Wheel up did not return to the previous slide.");

    const relevantErrors = client.events.filter((event) =>
      event.method === "Runtime.exceptionThrown" || (
        event.method === "Log.entryAdded" &&
        event.params?.entry?.level === "error" &&
        !String(event.params?.entry?.url || "").endsWith("/favicon.ico")
      )
    );
    assert.deepEqual(relevantErrors, [], "Viewer emitted browser errors during wheel navigation.");
    console.log(`Viewer wheel navigation: OK (${initial} -> ${next} -> ${initial})`);
  } finally {
    if (originalTrainingStructure !== null) {
      fs.writeFileSync(trainingStructurePath, originalTrainingStructure, "utf8");
    }
    client?.close();
    browser.kill();
    await sleep(500);
    try {
      fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    } catch {
      // Edge can keep profile files locked briefly after a successful test.
    }
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const APP_GLOBALS = path.join(ROOT, "app", "globals.css");
const WORKSPACE = path.join(ROOT, "app", "components", "vault-core-workspace.jsx");
const SYSTEM_CSS = path.join(ROOT, "design-system", "components", "styles", "system.css");

test("agent cards use constrained grid layout instead of full-width stretching", () => {
  const globals = fs.readFileSync(APP_GLOBALS, "utf8");
  const workspace = fs.readFileSync(WORKSPACE, "utf8");

  assert.match(workspace, /className="vc-agent-grid"/);
  assert.match(globals, /\.vc-agent-grid\s*\{/);
  assert.match(globals, /grid-template-columns:\s*repeat\(auto-fill,\s*minmax\(var\(--ds-layout-agent-min\),\s*var\(--ds-layout-agent-max\)\)\)/);
  assert.match(globals, /justify-content:\s*start/);
});

test("vault-core component styles keep dashboard composition blocks", () => {
  const globals = fs.readFileSync(APP_GLOBALS, "utf8");
  const system = fs.readFileSync(SYSTEM_CSS, "utf8");

  assert.match(globals, /\.vc-dashboard-metrics-grid\s*\{/);
  assert.match(globals, /\.vc-dashboard-lower-grid\s*\{/);
  assert.match(system, /\.ds-agent-card__avatar\s*\{/);
  assert.match(system, /\.ds-gate-panel__header-left\s*\{/);
  assert.match(system, /\.ds-log-viewer__row\s*\{/);
  assert.match(system, /\.ds-memory-viewer__row\s*\{/);
});

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SYSTEM_CSS = path.join(ROOT, "design-system", "components", "styles", "system.css");
const AGENT_CARD = path.join(ROOT, "design-system", "components", "vault-core", "AgentCard.tsx");
const GATE_PANEL = path.join(ROOT, "design-system", "components", "vault-core", "GatePanel.tsx");
const TIMELINE = path.join(ROOT, "design-system", "components", "vault-core", "Timeline.tsx");
const MEMORY_VIEWER = path.join(ROOT, "design-system", "components", "vault-core", "MemoryViewer.tsx");

test("agent card keeps dedicated processing style (not generic info tone)", () => {
  const source = fs.readFileSync(AGENT_CARD, "utf8");
  assert.doesNotMatch(source, /"info"/);

  const css = fs.readFileSync(SYSTEM_CSS, "utf8");
  assert.match(css, /\.ds-agent-card--processing\s+\.ds-agent-card__track\s*>\s*span\s*\{/);
});

test("gate panel uses source-like status chip instead of generic badge", () => {
  const source = fs.readFileSync(GATE_PANEL, "utf8");
  assert.doesNotMatch(source, /import\s+\{\s*Badge\s*\}\s+from/);
  assert.match(source, /ds-gate-panel__status-chip/);
});

test("timeline keeps source composition without card border shell", () => {
  const css = fs.readFileSync(SYSTEM_CSS, "utf8");
  const match = css.match(/\.ds-timeline\s*\{([\s\S]*?)\}/);
  assert.ok(match, "missing .ds-timeline rule");
  const rule = match[1];

  assert.doesNotMatch(rule, /border:/);
  assert.doesNotMatch(rule, /background:/);

  const timelineComponent = fs.readFileSync(TIMELINE, "utf8");
  assert.match(timelineComponent, /ds-timeline__status-chip/);
});

test("memory viewer relevance bar color follows threshold mapping", () => {
  const source = fs.readFileSync(MEMORY_VIEWER, "utf8");
  assert.match(source, /relevance\s*>\s*80/);
  assert.match(source, /relevance\s*>\s*50/);
  assert.match(source, /ds-memory-viewer__relevance-fill/);
});

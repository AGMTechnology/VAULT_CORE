import test from "node:test";
import assert from "node:assert/strict";

import { agentControlButtons, iconSpecification } from "../tokens/agent-controls.ts";

test("agent control buttons include all required variants", () => {
  const labels = Object.keys(agentControlButtons);
  assert.deepEqual(labels, ["Execute", "Pause", "Retry", "Approve", "Reject", "Review"]);
});

test("agent control icon spec matches design screenshot", () => {
  assert.equal(iconSpecification.LIBRARY, "Lucide React");
  assert.equal(iconSpecification["STROKE WEIGHT"], "1.75px");
  assert.equal(iconSpecification["DEFAULT SIZE"], "16px (w-4 h-4)");
  assert.equal(iconSpecification.STYLE, "Outlined, geometric");
});

test("each button has an icon and semantic color references", () => {
  for (const button of Object.values(agentControlButtons)) {
    assert.ok(button.icon.length > 0);
    assert.ok(button.tokens.text.length > 0);
    assert.ok(button.tokens.border.length > 0);
    assert.ok(button.tokens.background.length > 0);
  }
});

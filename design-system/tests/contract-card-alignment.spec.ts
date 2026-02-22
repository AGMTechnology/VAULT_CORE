import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SYSTEM_CSS = path.join(ROOT, "design-system", "components", "styles", "system.css");

test("contract card header keeps title and badge on opposite sides", () => {
  assert.equal(fs.existsSync(SYSTEM_CSS), true, "system.css must exist");
  const css = fs.readFileSync(SYSTEM_CSS, "utf8");
  const match = css.match(/\.ds-contract-card__header\s*\{([\s\S]*?)\}/);
  assert.ok(match, "missing .ds-contract-card__header rule");
  const rule = match[1];

  assert.match(rule, /display:\s*flex/);
  assert.match(rule, /justify-content:\s*space-between/);
  assert.match(rule, /align-items:\s*center/);
});

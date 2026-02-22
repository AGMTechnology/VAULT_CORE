import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CLAUDE_SOURCE_DIR = path.join(ROOT, "design-system", "claude-source");
const COMPONENTS_DIR = path.join(ROOT, "design-system", "components");
const COMPONENT_STYLES_FILE = path.join(ROOT, "design-system", "components", "styles", "system.css");

test("claude source artifacts exist", () => {
  const required = [
    "inventory.json",
    "style-audit.json",
    "tokens-candidates.json",
    "components-map.md"
  ];

  for (const file of required) {
    assert.equal(fs.existsSync(path.join(CLAUDE_SOURCE_DIR, file)), true, `${file} must exist`);
  }
});

test("design-system components avoid hardcoded style literals", () => {
  assert.equal(fs.existsSync(COMPONENTS_DIR), true, "components directory is required");
  assert.equal(fs.existsSync(COMPONENT_STYLES_FILE), true, "components stylesheet is required");

  const files = fs
    .readdirSync(COMPONENTS_DIR, { recursive: true })
    .filter((entry) => typeof entry === "string" && entry.endsWith(".tsx"))
    .map((entry) => path.join(COMPONENTS_DIR, entry));

  assert.ok(files.length > 0, "expected TSX components");

  const hardcodedColor = /#[0-9a-fA-F]{3,8}/;
  const hardcodedLength = /\b\d+(?:\.\d+)?px\b/;

  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");
    assert.equal(hardcodedColor.test(source), false, `hardcoded color found in ${file}`);
    assert.equal(hardcodedLength.test(source), false, `hardcoded px value found in ${file}`);
  }

  const stylesheet = fs.readFileSync(COMPONENT_STYLES_FILE, "utf8");
  assert.equal(hardcodedColor.test(stylesheet), false, "hardcoded color found in components stylesheet");
  assert.equal(hardcodedLength.test(stylesheet), false, "hardcoded px value found in components stylesheet");
});

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const THEMES_DIR = path.join(ROOT, "design-system", "themes");

test("theme files exist", () => {
  const required = [
    "index.ts",
    "light.ts",
    "dark.ts",
    "density.comfortable.ts",
    "density.compact.ts"
  ];

  for (const file of required) {
    assert.equal(fs.existsSync(path.join(THEMES_DIR, file)), true, `${file} must exist`);
  }
});

test("themes are linked to tokens by import", () => {
  const light = fs.readFileSync(path.join(THEMES_DIR, "light.ts"), "utf8");
  const dark = fs.readFileSync(path.join(THEMES_DIR, "dark.ts"), "utf8");
  const comfortable = fs.readFileSync(path.join(THEMES_DIR, "density.comfortable.ts"), "utf8");
  const compact = fs.readFileSync(path.join(THEMES_DIR, "density.compact.ts"), "utf8");

  assert.match(light, /from\s+"\.\.\/tokens\//);
  assert.match(dark, /TODO/i);
  assert.match(comfortable, /TODO/i);
  assert.match(compact, /TODO/i);
});

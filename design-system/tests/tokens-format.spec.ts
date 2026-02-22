import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const TOKENS_DIR = path.join(ROOT, "design-system", "tokens");

const tokenFiles = [
  "index.ts",
  "colors.core.ts",
  "colors.semantic.ts",
  "typography.ts",
  "spacing.ts",
  "radii.ts",
  "shadows.ts",
  "zIndex.ts",
  "motion.ts",
  "breakpoints.ts"
] as const;

test("required token files exist", () => {
  for (const file of tokenFiles) {
    const absolute = path.join(TOKENS_DIR, file);
    assert.equal(fs.existsSync(absolute), true, `${file} must exist`);
  }
});

test("token files expose structured exports", () => {
  const indexPath = path.join(TOKENS_DIR, "index.ts");
  const source = fs.readFileSync(indexPath, "utf8");

  assert.match(source, /export\s+\*\s+from\s+"\.\/colors\.core"/);
  assert.match(source, /export\s+\*\s+from\s+"\.\/colors\.semantic"/);
  assert.match(source, /export\s+\*\s+from\s+"\.\/typography"/);
  assert.match(source, /export\s+\*\s+from\s+"\.\/spacing"/);
  assert.match(source, /export\s+\*\s+from\s+"\.\/radii"/);
  assert.match(source, /export\s+\*\s+from\s+"\.\/shadows"/);
  assert.match(source, /export\s+\*\s+from\s+"\.\/zIndex"/);
  assert.match(source, /export\s+\*\s+from\s+"\.\/motion"/);
  assert.match(source, /export\s+\*\s+from\s+"\.\/breakpoints"/);
});

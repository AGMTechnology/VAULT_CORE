import test from "node:test";
import assert from "node:assert/strict";

import { flattenTokenObject, isValidColorTokenValue } from "../utils/guards.ts";
import { colorsCore } from "../tokens/colors.core.ts";
import { typography } from "../tokens/typography.ts";
import { spacing } from "../tokens/spacing.ts";

test("all color tokens are valid css colors", () => {
  for (const [path, value] of flattenTokenObject(colorsCore)) {
    assert.ok(isValidColorTokenValue(value), `Invalid color token ${path}: ${value}`);
  }
});

test("typography tokens have required fields", () => {
  for (const [name, token] of Object.entries(typography.scale)) {
    assert.ok(typeof token.size === "string" && token.size.length > 0, `${name} missing size`);
    assert.ok(typeof token.weight === "number", `${name} missing weight`);
    assert.ok(typeof token.lineHeight === "number", `${name} missing lineHeight`);
    assert.ok(typeof token.letterSpacing === "string", `${name} missing letterSpacing`);
  }
});

test("spacing scale is sorted ascending by value", () => {
  const values = spacing.order.map((key) => spacing.scale[key]);
  const sorted = [...values].sort((a, b) => a - b);
  assert.deepEqual(values, sorted);
});

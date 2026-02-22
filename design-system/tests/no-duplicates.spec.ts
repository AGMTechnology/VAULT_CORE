import test from "node:test";
import assert from "node:assert/strict";

import { flattenTokenObject } from "../utils/guards.ts";
import { colorsCore } from "../tokens/colors.core.ts";

test("no duplicated color values in core tokens", () => {
  const pairs = flattenTokenObject(colorsCore);
  const seen = new Map<string, string[]>();

  for (const [path, value] of pairs) {
    if (!seen.has(value)) {
      seen.set(value, []);
    }
    seen.get(value)!.push(path);
  }

  const duplicates = [...seen.entries()].filter(([, paths]) => paths.length > 1);
  assert.equal(duplicates.length, 0, `Duplicated color values found: ${JSON.stringify(duplicates)}`);
});

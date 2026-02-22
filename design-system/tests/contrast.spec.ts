import test from "node:test";
import assert from "node:assert/strict";

import { contrastRatio } from "../utils/color.ts";
import { lightTheme } from "../themes/light.ts";
import { darkTheme } from "../themes/dark.ts";

test("light theme text contrast on surface meets AA for body text", () => {
  const ratio = contrastRatio(lightTheme.colors.textDefault, lightTheme.colors.surface0);
  assert.ok(ratio >= 4.5, `contrast too low: ${ratio.toFixed(2)}`);
});

test("dark theme text contrast on surface meets AA for body text", () => {
  const ratio = contrastRatio(darkTheme.colors.textDefault, darkTheme.colors.surface0);
  assert.ok(ratio >= 4.5, `contrast too low: ${ratio.toFixed(2)}`);
});

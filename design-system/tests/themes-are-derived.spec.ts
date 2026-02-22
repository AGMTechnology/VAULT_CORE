import test from "node:test";
import assert from "node:assert/strict";

import { lightTheme } from "../themes/light.ts";
import { darkTheme } from "../themes/dark.ts";
import { tokenValueSet } from "../utils/guards.ts";
import { colorsCore } from "../tokens/colors.core.ts";

test("themes color values are derived from core tokens", () => {
  const allowed = tokenValueSet(colorsCore);

  for (const [themeName, theme] of Object.entries({ lightTheme, darkTheme })) {
    for (const [slot, value] of Object.entries(theme.colors)) {
      assert.ok(allowed.has(value), `${themeName}.${slot} is not derived from core token: ${value}`);
    }
  }
});

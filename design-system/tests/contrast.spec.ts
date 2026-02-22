import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CSS_VARIABLES_FILE = path.join(ROOT, "design-system", "exports", "css", "variables.css");

function luminance(hex: string): number {
  const value = hex.replace("#", "");
  const normalized = value.length === 3
    ? value
      .split("")
      .map((char) => `${char}${char}`)
      .join("")
    : value;

  const channels = [0, 2, 4]
    .map((idx) => parseInt(normalized.slice(idx, idx + 2), 16) / 255)
    .map((channel) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));

  return (channels[0] * 0.2126) + (channels[1] * 0.7152) + (channels[2] * 0.0722);
}

function contrastRatio(foreground: string, background: string): number {
  const l1 = luminance(foreground);
  const l2 = luminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

test("core text contrast remains readable", () => {
  assert.equal(fs.existsSync(CSS_VARIABLES_FILE), true, "variables.css must exist");
  const css = fs.readFileSync(CSS_VARIABLES_FILE, "utf8");

  const bg = css.match(/--ds-color-surface-0:\s*(#[0-9a-fA-F]{6})/);
  const fg = css.match(/--ds-color-text-default:\s*(#[0-9a-fA-F]{6})/);
  assert.ok(bg, "surface token is missing");
  assert.ok(fg, "text token is missing");

  const ratio = contrastRatio(fg[1], bg[1]);
  assert.ok(ratio >= 4.5, `contrast ratio must be >= 4.5, received ${ratio.toFixed(2)}`);
});

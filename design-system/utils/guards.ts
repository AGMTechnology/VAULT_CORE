import type { CssColor } from "./tokenTypes.ts";

const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;
const RGB_COLOR_PATTERN = /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/;
const RGBA_COLOR_PATTERN = /^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*(0(\.\d+)?|1(\.0+)?)\s*\)$/;

export function isValidColorTokenValue(value: string): value is CssColor {
  return HEX_COLOR_PATTERN.test(value) || RGB_COLOR_PATTERN.test(value) || RGBA_COLOR_PATTERN.test(value);
}

export function flattenTokenObject(
  input: unknown,
  parentPath = ""
): Array<[string, string]> {
  if (typeof input === "string") {
    return [[parentPath, input]];
  }

  if (input === null || typeof input !== "object") {
    return [];
  }

  const entries: Array<[string, string]> = [];
  for (const [key, value] of Object.entries(input)) {
    const nextPath = parentPath ? `${parentPath}.${key}` : key;
    entries.push(...flattenTokenObject(value, nextPath));
  }

  return entries;
}

export function tokenValueSet(input: unknown): Set<string> {
  return new Set(flattenTokenObject(input).map(([, value]) => value));
}

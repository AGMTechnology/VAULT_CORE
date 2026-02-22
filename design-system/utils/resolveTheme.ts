import { colorsCore } from "../tokens/colors.core.ts";
import { colorsSemantic } from "../tokens/colors.semantic.ts";
import type { CssColor } from "./tokenTypes.ts";

function resolvePath(input: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc === null || typeof acc !== "object") {
      throw new Error(`Cannot resolve token path ${path}`);
    }

    const next = (acc as Record<string, unknown>)[key];
    if (next === undefined) {
      throw new Error(`Unknown token path segment ${key} in ${path}`);
    }

    return next;
  }, input);
}

export function resolveCoreColor(path: string): CssColor {
  const value = resolvePath(colorsCore, path);
  if (typeof value !== "string") {
    throw new Error(`Core token path ${path} did not resolve to a color`);
  }
  return value as CssColor;
}

export function resolveSemanticColor(path: string): CssColor {
  const reference = resolvePath(colorsSemantic, path);
  if (typeof reference !== "string") {
    throw new Error(`Semantic token path ${path} did not resolve to a token reference`);
  }
  return resolveCoreColor(reference);
}

export function resolveThemeColorRefs<T extends Record<string, string>>(
  refs: T
): { [K in keyof T]: CssColor } {
  const output = {} as { [K in keyof T]: CssColor };

  for (const [slot, path] of Object.entries(refs)) {
    output[slot as keyof T] = resolveSemanticColor(path);
  }

  return output;
}

import { isValidColorTokenValue } from "./guards.ts";

type RGB = { r: number; g: number; b: number };

function clampChannel(value: number): number {
  return Math.max(0, Math.min(255, value));
}

function hexToRgb(value: string): RGB {
  const raw = value.replace("#", "");
  return {
    r: parseInt(raw.slice(0, 2), 16),
    g: parseInt(raw.slice(2, 4), 16),
    b: parseInt(raw.slice(4, 6), 16)
  };
}

function parseRgbList(value: string): RGB {
  const numbers = value
    .replace(/rgba?\(/, "")
    .replace(")", "")
    .split(",")
    .slice(0, 3)
    .map((part) => clampChannel(Number.parseFloat(part.trim())));

  return {
    r: numbers[0] ?? 0,
    g: numbers[1] ?? 0,
    b: numbers[2] ?? 0
  };
}

export function parseColor(value: string): RGB {
  if (!isValidColorTokenValue(value)) {
    throw new Error(`Unsupported color token value: ${value}`);
  }

  if (value.startsWith("#")) {
    return hexToRgb(value);
  }

  return parseRgbList(value);
}

function linearizeChannel(channel: number): number {
  const normalized = channel / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(color: string): number {
  const { r, g, b } = parseColor(color);
  const [lr, lg, lb] = [r, g, b].map(linearizeChannel);
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

export function contrastRatio(foreground: string, background: string): number {
  const l1 = relativeLuminance(foreground);
  const l2 = relativeLuminance(background);
  const light = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
}

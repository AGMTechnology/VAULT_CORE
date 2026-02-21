import fs from "node:fs";
import path from "node:path";

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  const raw = fs.readFileSync(filePath, "utf8").trim();
  if (!raw) {
    return fallback;
  }
  return JSON.parse(raw);
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function getStorePaths(dataDir) {
  ensureDir(dataDir);
  return {
    entries: path.join(dataDir, "entries.json"),
  };
}

export function loadMemoryEntries(dataDir) {
  const { entries } = getStorePaths(dataDir);
  const rows = readJson(entries, []);
  return Array.isArray(rows) ? rows : [];
}

export function saveMemoryEntries(dataDir, rows) {
  const { entries } = getStorePaths(dataDir);
  writeJson(entries, rows);
}

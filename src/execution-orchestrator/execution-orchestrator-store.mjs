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

function getStorePath(dataDir) {
  ensureDir(dataDir);
  return path.join(dataDir, "execution-packages.json");
}

export function loadExecutionPackages(dataDir) {
  const filePath = getStorePath(dataDir);
  const rows = readJson(filePath, []);
  return Array.isArray(rows) ? rows : [];
}

export function saveExecutionPackages(dataDir, rows) {
  const filePath = getStorePath(dataDir);
  writeJson(filePath, rows);
}

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
    intakes: path.join(dataDir, "intakes.json"),
  };
}

export function loadIntakes(dataDir) {
  const { intakes } = getStorePaths(dataDir);
  const rows = readJson(intakes, []);
  return Array.isArray(rows) ? rows : [];
}

export function saveIntakes(dataDir, intakes) {
  const { intakes: intakesFile } = getStorePaths(dataDir);
  writeJson(intakesFile, intakes);
}

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
    profiles: path.join(dataDir, "agent-profiles.json"),
  };
}

export function loadAgentProfiles(dataDir) {
  const { profiles } = getStorePaths(dataDir);
  const rows = readJson(profiles, []);
  return Array.isArray(rows) ? rows : [];
}

export function saveAgentProfiles(dataDir, rows) {
  const { profiles } = getStorePaths(dataDir);
  writeJson(profiles, rows);
}

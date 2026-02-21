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
    contracts: path.join(dataDir, "contracts.json"),
    audits: path.join(dataDir, "audits.json"),
  };
}

export function loadContracts(dataDir) {
  const { contracts } = getStorePaths(dataDir);
  const rows = readJson(contracts, []);
  return Array.isArray(rows) ? rows : [];
}

export function saveContracts(dataDir, contracts) {
  const { contracts: contractsFile } = getStorePaths(dataDir);
  writeJson(contractsFile, contracts);
}

export function loadAudits(dataDir) {
  const { audits } = getStorePaths(dataDir);
  const rows = readJson(audits, []);
  return Array.isArray(rows) ? rows : [];
}

export function saveAudits(dataDir, audits) {
  const { audits: auditsFile } = getStorePaths(dataDir);
  writeJson(auditsFile, audits);
}

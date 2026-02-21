import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const failures = [];

function requireFile(relativePath) {
  const filePath = path.join(process.cwd(), relativePath);
  if (!fs.existsSync(filePath)) {
    failures.push(`Missing required file: ${relativePath}`);
    return null;
  }
  return filePath;
}

function readJson(relativePath) {
  const filePath = requireFile(relativePath);
  if (!filePath) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    failures.push(`Invalid JSON in ${relativePath}: ${String(error.message ?? error)}`);
    return null;
  }
}

const pkg = readJson("package.json");
if (pkg) {
  if (pkg.engines?.node !== ">=20.20.0 <21") {
    failures.push("package.json engines.node must be \">=20.20.0 <21\"");
  }
  if (pkg.engines?.npm !== ">=10.8.2 <11") {
    failures.push("package.json engines.npm must be \">=10.8.2 <11\"");
  }
  if (pkg.packageManager !== "npm@10.8.2") {
    failures.push("package.json packageManager must be \"npm@10.8.2\"");
  }
}

const expectedNodeVersion = "20.20.0";
const nodeVersion = process.versions.node;
if (nodeVersion !== expectedNodeVersion) {
  failures.push(`Node version mismatch: expected ${expectedNodeVersion}, got ${nodeVersion}`);
}

const nvmrcPath = requireFile(".nvmrc");
if (nvmrcPath) {
  const nvmrc = fs.readFileSync(nvmrcPath, "utf8").trim();
  if (nvmrc !== expectedNodeVersion) {
    failures.push(`.nvmrc must equal ${expectedNodeVersion}`);
  }
}

const requiredPolicyFiles = [
  "docs/ai/VAULT_CORE_STACK_MATRIX.md",
  "docs/ai/adr/ADR-0002-stack-exception-process.md",
  "docs/ai/templates/stack-exception-template.yaml"
];

for (const file of requiredPolicyFiles) {
  requireFile(file);
}

if (failures.length > 0) {
  console.error("STACK_VERIFICATION_FAILED");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("STACK_VERIFICATION_OK");

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const expectedFiles = [
  "ui/screenshots/README.md",
  "ui/screenshots/manifest.json",
  "ui/screen-specs/DashboardScreen.md",
  "ui/screen-specs/DashboardScreen.json",
  "ui/screen-specs/ExecutionScreen.md",
  "ui/screen-specs/ExecutionScreen.json",
  "ui/screen-specs/ContractScreen.md",
  "ui/screen-specs/ContractScreen.json",
  "ui/screen-specs/MonitoringScreen.md",
  "ui/screen-specs/MonitoringScreen.json",
  "ui/screen-specs/LearningScreen.md",
  "ui/screen-specs/LearningScreen.json",
  "src/screens/index.ts",
  "src/screens/Dashboard/DashboardScreen.tsx",
  "src/screens/Execution/ExecutionScreen.tsx",
  "src/screens/Contract/ContractScreen.tsx",
  "src/screens/Monitoring/MonitoringScreen.tsx",
  "src/screens/Learning/LearningScreen.tsx"
];

test("generated UI screenshot assets and specs exist", () => {
  for (const relativeFile of expectedFiles) {
    const absoluteFile = path.join(root, relativeFile);
    assert.ok(fs.existsSync(absoluteFile), `missing generated file: ${relativeFile}`);
  }
});

test("screen specs json files are valid and include tokenRefs", () => {
  const specs = [
    "ui/screen-specs/DashboardScreen.json",
    "ui/screen-specs/ExecutionScreen.json",
    "ui/screen-specs/ContractScreen.json",
    "ui/screen-specs/MonitoringScreen.json",
    "ui/screen-specs/LearningScreen.json"
  ];

  for (const relativeFile of specs) {
    const parsed = JSON.parse(fs.readFileSync(path.join(root, relativeFile), "utf8"));
    assert.ok(parsed.screenName, `${relativeFile} missing screenName`);
    assert.ok(parsed.tokenRefs, `${relativeFile} missing tokenRefs`);
    assert.ok(Array.isArray(parsed.tokenRefs.colors), `${relativeFile} missing tokenRefs.colors`);
  }
});

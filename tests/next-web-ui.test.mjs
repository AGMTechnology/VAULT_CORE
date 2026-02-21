import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function read(filePath) {
  return fs.readFileSync(path.join(process.cwd(), filePath), "utf8");
}

test("next web scripts are configured", () => {
  const packageJson = JSON.parse(read("package.json"));
  assert.equal(typeof packageJson.scripts?.dev, "string");
  assert.equal(typeof packageJson.scripts?.build, "string");
  assert.equal(typeof packageJson.scripts?.start, "string");
  assert.ok(packageJson.scripts.dev.includes("next dev"));
  assert.ok(packageJson.scripts.build.includes("next build"));
  assert.ok(packageJson.scripts.start.includes("next start"));
});

test("react workspace entrypoint exists and references hub UI", () => {
  const page = read("app/page.js");
  const workspace = read("app/components/vault-core-workspace.jsx");
  assert.ok(page.includes("VaultCoreWorkspace"));
  assert.ok(workspace.includes("\"use client\""));
  assert.ok(workspace.includes("Dashboard"));
  assert.ok(workspace.includes("Memory Hub"));
  assert.ok(workspace.includes("Docs Hub"));
});

test("next API routes for core hubs exist", () => {
  const routes = [
    "app/api/overview/route.js",
    "app/api/contracts/route.js",
    "app/api/memory/route.js",
    "app/api/agents/route.js",
    "app/api/skills/route.js",
    "app/api/rules/route.js",
    "app/api/docs/checklist/route.js",
  ];
  for (const routePath of routes) {
    assert.equal(fs.existsSync(path.join(process.cwd(), routePath)), true, `${routePath} should exist`);
  }
});

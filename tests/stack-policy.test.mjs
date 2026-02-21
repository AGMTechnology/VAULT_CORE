import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

test("pins runtime/tooling and exposes stack verification command", () => {
  const pkgPath = path.join(process.cwd(), "package.json");
  assert.equal(fs.existsSync(pkgPath), true, "Missing package.json");
  const pkg = readJson(pkgPath);

  assert.equal(typeof pkg.engines?.node, "string", "package.json must define engines.node");
  assert.equal(typeof pkg.packageManager, "string", "package.json must define packageManager");
  assert.equal(typeof pkg.scripts?.["verify:stack"], "string", "Missing npm script verify:stack");

  assert.equal(fs.existsSync(path.join(process.cwd(), ".nvmrc")), true, "Missing .nvmrc");
  assert.equal(fs.existsSync(path.join(process.cwd(), ".npmrc")), true, "Missing .npmrc");
  assert.equal(fs.existsSync(path.join(process.cwd(), "scripts", "verify-stack.mjs")), true, "Missing scripts/verify-stack.mjs");
  assert.equal(fs.existsSync(path.join(process.cwd(), "package-lock.json")), true, "Missing package-lock.json lockfile");
});

test("documents stack exception workflow through ADR and template", () => {
  const adrPath = path.join(process.cwd(), "docs", "ai", "adr", "ADR-0002-stack-exception-process.md");
  const templatePath = path.join(
    process.cwd(),
    "docs",
    "ai",
    "templates",
    "stack-exception-template.yaml",
  );

  assert.equal(fs.existsSync(adrPath), true, "Missing ADR-0002 stack exception process");
  assert.equal(fs.existsSync(templatePath), true, "Missing stack exception template");

  const adrContent = fs.readFileSync(adrPath, "utf8");
  assert.equal(adrContent.includes("time box"), true, "ADR must define time-boxed exceptions");
  assert.equal(adrContent.includes("rollback"), true, "ADR must define rollback requirements");
});

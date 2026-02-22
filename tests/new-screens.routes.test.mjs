import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const MONITORING_COMPONENT = path.join(ROOT, "app", "components", "monitoring-screen.tsx");
const LEARNING_COMPONENT = path.join(ROOT, "app", "components", "learning-screen.tsx");
const GIT_COMPONENT = path.join(ROOT, "app", "components", "git-connect-screen.tsx");

const MONITORING_PAGE = path.join(ROOT, "app", "monitoring", "page.tsx");
const LEARNING_PAGE = path.join(ROOT, "app", "learning", "page.tsx");
const GIT_PAGE = path.join(ROOT, "app", "git", "page.tsx");

const WORKSPACE_COMPONENT = path.join(ROOT, "app", "components", "vault-core-workspace.jsx");

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

test("monitoring, learning, and git route/page files exist", () => {
  assert.equal(fs.existsSync(MONITORING_COMPONENT), true, "missing app/components/monitoring-screen.tsx");
  assert.equal(fs.existsSync(LEARNING_COMPONENT), true, "missing app/components/learning-screen.tsx");
  assert.equal(fs.existsSync(GIT_COMPONENT), true, "missing app/components/git-connect-screen.tsx");
  assert.equal(fs.existsSync(MONITORING_PAGE), true, "missing app/monitoring/page.tsx");
  assert.equal(fs.existsSync(LEARNING_PAGE), true, "missing app/learning/page.tsx");
  assert.equal(fs.existsSync(GIT_PAGE), true, "missing app/git/page.tsx");
});

test("monitoring, learning, and git pages are integrated in shared shell layout", () => {
  const monitoringPage = read(MONITORING_PAGE);
  const learningPage = read(LEARNING_PAGE);
  const gitPage = read(GIT_PAGE);

  assert.match(monitoringPage, /VaultShellLayout/);
  assert.match(monitoringPage, /activeHub=\"monitoring\"/);
  assert.match(monitoringPage, /embeddedInLayout/);

  assert.match(learningPage, /VaultShellLayout/);
  assert.match(learningPage, /activeHub=\"learning\"/);
  assert.match(learningPage, /embeddedInLayout/);

  assert.match(gitPage, /VaultShellLayout/);
  assert.match(gitPage, /activeHub=\"git\"/);
  assert.match(gitPage, /embeddedInLayout/);
});

test("monitoring screen uses contract audit API with canonical fallback logs", () => {
  const source = read(MONITORING_COMPONENT);
  assert.match(source, /\/api\/contracts/);
  assert.match(source, /\/api\/contracts\/\$\{/);
  assert.match(source, /System Audit Trail/);
  assert.match(source, /vc-monitoring-screen/);
  assert.match(source, /Contract CTR-2026-0221-A7F3 initialized/);
  assert.match(source, /Documentation gate: PASSED/);
});

test("learning screen uses memory API and renders lessons + memory viewer", () => {
  const source = read(LEARNING_COMPONENT);
  assert.match(source, /\/api\/memory\?projectId=all/);
  assert.match(source, /LESSONS CAPTURED/);
  assert.match(source, /API retry requires exponential backoff/);
  assert.match(source, /MemoryViewer/);
  assert.match(source, /vc-learning-grid/);
});

test("git connect screen includes three-step state and connected flow controls", () => {
  const source = read(GIT_COMPONENT);
  assert.match(source, /"input"\s*\|\s*"scanning"\s*\|\s*"connected"/);
  assert.match(source, /vc-git-step-scanning/);
  assert.match(source, /vc-git-step-connected/);
  assert.match(source, /Activate Monitoring/);
  assert.match(source, /AI Agent Assignment/);
});

test("workspace dashboard exposes links to monitoring, learning, and git routes", () => {
  const source = read(WORKSPACE_COMPONENT);
  assert.match(source, /href="\/monitoring"/);
  assert.match(source, /href="\/learning"/);
  assert.match(source, /href="\/git"/);
  assert.match(source, /Screen Shortcuts/);
});

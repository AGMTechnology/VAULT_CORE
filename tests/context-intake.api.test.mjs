import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";

import { createContextIntakeApi } from "../src/api/context-intake-api.mjs";

const REQUIRED_BOOTSTRAP_FILES = [
  ".vault-core/project.context.yaml",
  ".vault-core/rules.global.yaml",
  ".vault-core/skills.recommended.yaml",
  ".vault-core/docs.index.md",
  ".vault-core/contract.template.md",
  ".vault-core/agent.execution.checklist.md",
];

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function createFixtureProject(rootDir) {
  fs.mkdirSync(rootDir, { recursive: true });
  fs.mkdirSync(path.join(rootDir, "src"), { recursive: true });
  fs.mkdirSync(path.join(rootDir, "docs"), { recursive: true });
  fs.mkdirSync(path.join(rootDir, ".github", "workflows"), { recursive: true });

  writeJson(path.join(rootDir, "package.json"), {
    name: "fixture-project",
    private: true,
    dependencies: {
      next: "15.0.0",
      react: "19.0.0",
    },
    devDependencies: {
      vitest: "2.0.0",
      typescript: "5.6.3",
    },
    scripts: {
      test: "vitest run",
    },
  });
  fs.writeFileSync(path.join(rootDir, "package-lock.json"), "{}\n", "utf8");
  fs.writeFileSync(path.join(rootDir, "README.md"), "# Fixture\n", "utf8");
  fs.writeFileSync(path.join(rootDir, "docs", "ARCHITECTURE.md"), "# Architecture\n", "utf8");
  fs.writeFileSync(path.join(rootDir, ".github", "workflows", "ci.yml"), "name: ci\n", "utf8");
  fs.writeFileSync(path.join(rootDir, "src", "index.ts"), "export const ready = true;\n", "utf8");
}

function createTempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function hasGit() {
  const result = spawnSync("git", ["--version"], { stdio: "ignore" });
  return result.status === 0;
}

test("imports a local path, scans context, generates .vault-core artifacts, and seeds traceable memory", async () => {
  const projectRoot = createTempDir("vault-core-context-path-");
  const dataDir = createTempDir("vault-core-context-data-");
  createFixtureProject(projectRoot);

  const api = createContextIntakeApi({ dataDir });
  const response = await api.postContextIntake({
    projectId: "vault-core",
    source: {
      type: "path",
      path: projectRoot,
    },
    actor: "vault-core-architect",
  });

  assert.equal(response.status, 201);
  const intake = response.body.intake;
  assert.equal(intake.projectId, "vault-core");
  assert.equal(intake.source.type, "path");
  assert.equal(path.resolve(intake.workspacePath), path.resolve(projectRoot));

  assert.equal(intake.analysis.frameworks.includes("Next.js"), true);
  assert.equal(intake.analysis.frameworks.includes("React"), true);
  assert.equal(intake.analysis.packageManagers.includes("npm"), true);
  assert.equal(intake.analysis.testTooling.includes("Vitest"), true);
  assert.equal(intake.analysis.ciFiles.includes(".github/workflows/ci.yml"), true);
  assert.equal(intake.analysis.docs.includes("README.md"), true);

  for (const relativePath of REQUIRED_BOOTSTRAP_FILES) {
    assert.equal(
      fs.existsSync(path.join(projectRoot, relativePath)),
      true,
      `Missing bootstrap file ${relativePath}`,
    );
  }

  assert.equal(Array.isArray(intake.memorySeed), true);
  assert.equal(intake.memorySeed.length >= 2, true);
  for (const entry of intake.memorySeed) {
    assert.equal(Array.isArray(entry.sourceRefs), true);
    assert.equal(entry.sourceRefs.length > 0, true);
  }
});

test(
  "imports a git source into a dedicated workspace and bootstraps it",
  { skip: !hasGit() },
  async () => {
    const sourceRepo = createTempDir("vault-core-context-git-src-");
    const dataDir = createTempDir("vault-core-context-git-data-");
    const importRoot = createTempDir("vault-core-context-git-import-");
    createFixtureProject(sourceRepo);

    execFileSync("git", ["init"], { cwd: sourceRepo, stdio: "ignore" });
    execFileSync("git", ["add", "."], { cwd: sourceRepo, stdio: "ignore" });
    execFileSync(
      "git",
      ["-c", "user.email=vault-core@test.local", "-c", "user.name=Vault Core", "commit", "-m", "init"],
      { cwd: sourceRepo, stdio: "ignore" },
    );

    const api = createContextIntakeApi({ dataDir, importRoot });
    const response = await api.postContextIntake({
      projectId: "vault-core",
      source: {
        type: "git",
        url: sourceRepo,
      },
      actor: "vault-core-architect",
    });

    assert.equal(response.status, 201);
    const intake = response.body.intake;
    assert.equal(intake.source.type, "git");
    assert.notEqual(path.resolve(intake.workspacePath), path.resolve(sourceRepo));
    assert.equal(
      fs.existsSync(path.join(intake.workspacePath, ".vault-core", "project.context.yaml")),
      true,
      "Git intake should generate bootstrap folder in cloned workspace",
    );
  },
);

test("returns actionable validation errors for invalid context-intake payloads", async () => {
  const dataDir = createTempDir("vault-core-context-errors-");
  const api = createContextIntakeApi({ dataDir });

  const missingSource = await api.postContextIntake({
    projectId: "vault-core",
    actor: "vault-core-architect",
  });
  assert.equal(missingSource.status, 400);
  assert.equal(missingSource.body.error, "Invalid context intake payload");
  assert.equal(missingSource.body.details.some((detail) => detail.includes("source")), true);

  const missingPath = await api.postContextIntake({
    projectId: "vault-core",
    source: {
      type: "path",
      path: "C:/definitely/not/found",
    },
    actor: "vault-core-architect",
  });
  assert.equal(missingPath.status, 404);
  assert.equal(missingPath.body.error, "Workspace path not found");
});

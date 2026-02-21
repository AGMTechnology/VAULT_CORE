import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const requiredFiles = [
  "README.md",
  "docs/ai/README.md",
  "docs/ai/VAULT_CORE_TECH_SPEC.md",
  "docs/ai/VAULT_CORE_STACK_MATRIX.md",
  "docs/ai/VAULT_CORE_MIGRATION_ROADMAP.md",
  "docs/ai/MEMORY_HUB_POLICY.md",
  "docs/ai/adr/ADR-0001-vault-core-architecture.md",
  "docs/ai/contracts/vault-core-contract-v1.schema.json",
  "docs/ai/ONBOARDING_CHECKLIST.md"
];

test("bootstrap includes required VAULT_CORE artifacts", () => {
  const missing = requiredFiles.filter((file) => {
    const target = path.join(process.cwd(), file);
    return !fs.existsSync(target);
  });

  assert.deepEqual(missing, [], `Missing required files: ${missing.join(", ")}`);
});

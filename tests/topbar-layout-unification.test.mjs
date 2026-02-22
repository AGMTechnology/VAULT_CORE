import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const TOPBAR_COMPONENT = path.join(ROOT, "app", "components", "vault-breadcrumb-topbar.tsx");
const CONTRACT_SHELL = path.join(ROOT, "app", "components", "contract-screen-shell.tsx");
const WORKSPACE = path.join(ROOT, "app", "components", "vault-core-workspace.jsx");
const VAULT_LAYOUT = path.join(ROOT, "app", "components", "vault-shell-layout.tsx");
const SHARED_NAVBAR = path.join(ROOT, "app", "components", "vault-core-sidebar.tsx");

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

test("breadcrumb topbar reusable component is defined", () => {
  assert.equal(fs.existsSync(TOPBAR_COMPONENT), true, "missing app/components/vault-breadcrumb-topbar.tsx");
  const source = read(TOPBAR_COMPONENT);
  assert.match(source, /export function VaultBreadcrumbTopbar/);
  assert.match(source, /vc-contract-shell-topbar/);
  assert.match(source, /Ctrl\+K/);
});

test("topbar component is used by contract shell, workspace shell, and vault layout", () => {
  const contractShell = read(CONTRACT_SHELL);
  const workspace = read(WORKSPACE);
  const vaultLayout = read(VAULT_LAYOUT);

  assert.match(contractShell, /VaultBreadcrumbTopbar/);
  assert.match(workspace, /VaultBreadcrumbTopbar/);
  assert.match(vaultLayout, /VaultBreadcrumbTopbar/);
  assert.match(vaultLayout, /flat/);
});

test("contracts layout and workspace use the same shared navbar component", () => {
  assert.equal(fs.existsSync(SHARED_NAVBAR), true, "missing app/components/vault-core-sidebar.tsx");
  const sharedNavbar = read(SHARED_NAVBAR);
  const workspace = read(WORKSPACE);
  const vaultLayout = read(VAULT_LAYOUT);

  assert.match(sharedNavbar, /export function VaultCoreSidebar/);
  assert.match(sharedNavbar, /Monitoring/);
  assert.match(sharedNavbar, /Learning/);
  assert.match(sharedNavbar, /Git Connect/);
  assert.match(workspace, /VaultCoreSidebar/);
  assert.match(vaultLayout, /VaultCoreSidebar/);
  assert.match(vaultLayout, /monitoring: \"\/monitoring\"/);
  assert.match(vaultLayout, /learning: \"\/learning\"/);
  assert.match(vaultLayout, /git: \"\/git\"/);
});

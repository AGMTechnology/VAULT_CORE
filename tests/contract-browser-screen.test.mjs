import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const BROWSER_ROUTE = path.join(ROOT, "app", "contracts", "page.tsx");
const DETAIL_ROUTE = path.join(ROOT, "app", "contracts", "[contractId]", "page.tsx");
const CONTRACTS_LAYOUT = path.join(ROOT, "app", "contracts", "layout.tsx");
const BROWSER_COMPONENT = path.join(ROOT, "app", "components", "contract-browser-screen.tsx");
const DETAIL_COMPONENT = path.join(ROOT, "app", "components", "contract-detail-screen.tsx");
const CONTRACTS_SEGMENT_SHELL = path.join(ROOT, "app", "components", "contracts-segment-shell.tsx");

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

test("contract browser and detail routes exist", () => {
  assert.equal(fs.existsSync(BROWSER_ROUTE), true, "missing app/contracts/page.tsx");
  assert.equal(fs.existsSync(DETAIL_ROUTE), true, "missing app/contracts/[contractId]/page.tsx");
  assert.equal(fs.existsSync(CONTRACTS_LAYOUT), true, "missing app/contracts/layout.tsx");
  assert.equal(fs.existsSync(BROWSER_COMPONENT), true, "missing app/components/contract-browser-screen.tsx");
  assert.equal(fs.existsSync(DETAIL_COMPONENT), true, "missing app/components/contract-detail-screen.tsx");
  assert.equal(fs.existsSync(CONTRACTS_SEGMENT_SHELL), true, "missing app/components/contracts-segment-shell.tsx");
});

test("contract browser route is integrated in left-sidebar layout", () => {
  const routeSource = read(BROWSER_ROUTE);
  const layoutSource = read(CONTRACTS_LAYOUT);
  const browserSource = read(BROWSER_COMPONENT);
  const segmentShellSource = read(CONTRACTS_SEGMENT_SHELL);

  assert.match(routeSource, /embeddedInLayout/);
  assert.match(layoutSource, /ContractsSegmentShell/);
  assert.match(segmentShellSource, /VaultShellLayout/);
  assert.match(segmentShellSource, /activeHub=\"contracts\"/);
  assert.match(segmentShellSource, /usePathname/);
  assert.match(browserSource, /ContractBrowserScreen\(\{ embeddedInLayout = false \}/);
  assert.match(browserSource, /vc-contract-shell-body/);
});

test("contract browser uses real contracts API and handles loading/empty/error states", () => {
  const source = read(BROWSER_COMPONENT);
  assert.match(source, /\/api\/contracts/);
  assert.match(source, /loading/i);
  assert.match(source, /No contracts available/);
  assert.match(source, /Unable to load contracts/);
  assert.match(source, /Retry/);
});

test("contract browser follows compact showcase layout instead of hero header", () => {
  const source = read(BROWSER_COMPONENT);
  assert.match(source, /Contracts .* Browse & Select/);
  assert.match(source, /vc-contract-browser-screen/);
  assert.match(source, /vc-contract-browser-main/);
  assert.match(source, /vc-contract-browser-detail/);
  assert.match(source, /Total/);
  assert.match(source, /Active/);
  assert.match(source, /Completed/);
  assert.match(source, /Failed/);
  assert.doesNotMatch(source, /Contract Browser<\/Text>/);
});

test("contract browser navigates to contract detail route on contract click", () => {
  const source = read(BROWSER_COMPONENT);
  assert.match(source, /useRouter/);
  assert.match(source, /router\.push\(`\/contracts\/\$\{/);
});

test("contract detail reads route params and renders contract + memory + dependencies layout", () => {
  const routeSource = read(DETAIL_ROUTE);
  assert.match(routeSource, /params/);
  assert.match(routeSource, /contractId/);
  assert.match(routeSource, /embeddedInLayout/);

  const detailSource = read(DETAIL_COMPONENT);
  assert.match(detailSource, /Contract -/);
  assert.match(detailSource, /vc-contract-detail-screen/);
  assert.match(detailSource, /vc-contract-detail-main/);
  assert.match(detailSource, /ContractCard/);
  assert.match(detailSource, /MemoryViewer/);
  assert.match(detailSource, /DEPENDENCIES/i);
  assert.match(detailSource, /\/api\/contracts\/\$\{/);
  assert.doesNotMatch(detailSource, /Contract Screen<\/Text>/);
});

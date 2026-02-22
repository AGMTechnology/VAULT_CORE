import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const showcaseRoot = path.join(root, "Design System for VAULT_CORE");
const outputRoot = path.join(root, "design-system", "claude-source");

function walk(dir, acc = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(absolute, acc);
    } else {
      acc.push(absolute);
    }
  }
  return acc;
}

function toRelative(absolutePath) {
  return path.relative(root, absolutePath).replace(/\\/g, "/");
}

function toShowcaseRelative(absolutePath) {
  return path.relative(showcaseRoot, absolutePath).replace(/\\/g, "/");
}

function countMatches(pattern, source) {
  const counts = new Map();
  for (const match of source.matchAll(pattern)) {
    const value = match[0];
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}

function mergeCounts(target, source, file) {
  for (const [value, count] of source.entries()) {
    const previous = target.get(value) ?? { count: 0, files: new Set() };
    previous.count += count;
    previous.files.add(file);
    target.set(value, previous);
  }
}

function mapToSerializable(map) {
  return [...map.entries()]
    .map(([value, meta]) => ({
      value,
      count: meta.count,
      files: [...meta.files].sort()
    }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

if (!fs.existsSync(showcaseRoot)) {
  throw new Error(`Showcase directory is missing: ${toRelative(showcaseRoot)}`);
}

fs.mkdirSync(outputRoot, { recursive: true });

const allFiles = walk(showcaseRoot);
const codeFiles = allFiles.filter((file) => /\.(tsx?|css|md|json)$/i.test(file));

const componentsUi = allFiles
  .filter((file) => file.includes(`${path.sep}src${path.sep}app${path.sep}components${path.sep}ui${path.sep}`) && file.endsWith(".tsx"))
  .map((file) => ({
    name: path.basename(file, ".tsx"),
    canonicalName: path.basename(file, ".tsx")
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(""),
    file: toShowcaseRelative(file),
    category: "ui"
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const componentsVault = allFiles
  .filter((file) => file.includes(`${path.sep}src${path.sep}app${path.sep}components${path.sep}vault${path.sep}`) && file.endsWith(".tsx"))
  .map((file) => ({
    name: path.basename(file, ".tsx"),
    canonicalName: path.basename(file, ".tsx"),
    file: toShowcaseRelative(file),
    category: "vault"
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const componentsLayout = allFiles
  .filter((file) => file.includes(`${path.sep}src${path.sep}app${path.sep}components${path.sep}layout${path.sep}`) && file.endsWith(".tsx"))
  .map((file) => ({
    name: path.basename(file, ".tsx"),
    canonicalName: path.basename(file, ".tsx"),
    file: toShowcaseRelative(file),
    category: "layout"
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const pages = allFiles
  .filter((file) => file.includes(`${path.sep}src${path.sep}app${path.sep}pages${path.sep}`) && file.endsWith(".tsx"))
  .map((file) => ({
    name: path.basename(file, ".tsx"),
    file: toShowcaseRelative(file)
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const packageJsonPath = path.join(showcaseRoot, "package.json");
const showcasePackage = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

const inventory = {
  generatedAt: new Date().toISOString(),
  sourceRoot: toRelative(showcaseRoot),
  stack: {
    framework: "Vite + React",
    styling: "Tailwind v4 + CSS variables",
    uiLibraries: Object.keys(showcasePackage.dependencies ?? {})
      .filter((dep) => dep.startsWith("@radix-ui/") || dep === "lucide-react" || dep.includes("tailwind") || dep.includes("motion"))
      .sort()
  },
  files: {
    total: allFiles.length,
    code: codeFiles.length
  },
  components: {
    ui: componentsUi,
    vault: componentsVault,
    layout: componentsLayout
  },
  pages,
  dependencies: {
    dependencies: showcasePackage.dependencies ?? {},
    devDependencies: showcasePackage.devDependencies ?? {}
  }
};

const colors = new Map();
const lengths = new Map();
const radii = new Map();
const shadows = new Map();
const fontSizes = new Map();
const fontWeights = new Map();
const lineHeights = new Map();
const letterSpacings = new Map();
const zIndexes = new Map();
const durations = new Map();
const easings = new Map();

for (const file of codeFiles) {
  const relative = toShowcaseRelative(file);
  const source = fs.readFileSync(file, "utf8");

  mergeCounts(colors, countMatches(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]+\)|hsla?\([^)]+\)/g, source), relative);
  mergeCounts(lengths, countMatches(/\b\d*\.?\d+(?:px|rem|em|%)\b/g, source), relative);
  mergeCounts(radii, countMatches(/(?:border-radius|rounded(?:-[a-z0-9]+)?)[^;\n}]*/gi, source), relative);
  mergeCounts(shadows, countMatches(/(?:box-shadow|shadow(?:-[a-z0-9]+)?)[^;\n}]*/gi, source), relative);
  mergeCounts(fontSizes, countMatches(/font-size:\s*[^;\n}]+/gi, source), relative);
  mergeCounts(fontWeights, countMatches(/font-weight:\s*[^;\n}]+/gi, source), relative);
  mergeCounts(lineHeights, countMatches(/line-height:\s*[^;\n}]+/gi, source), relative);
  mergeCounts(letterSpacings, countMatches(/letter-spacing:\s*[^;\n}]+/gi, source), relative);
  mergeCounts(zIndexes, countMatches(/z-index:\s*[^;\n}]+/gi, source), relative);
  mergeCounts(durations, countMatches(/\b\d+(?:\.\d+)?ms\b/g, source), relative);
  mergeCounts(easings, countMatches(/cubic-bezier\([^)]+\)|ease-in-out|ease-in|ease-out|linear/g, source), relative);
}

const styleAudit = {
  generatedAt: new Date().toISOString(),
  sourceRoot: toRelative(showcaseRoot),
  colors: mapToSerializable(colors),
  lengths: mapToSerializable(lengths),
  radii: mapToSerializable(radii),
  shadows: mapToSerializable(shadows),
  typography: {
    fontSizes: mapToSerializable(fontSizes),
    fontWeights: mapToSerializable(fontWeights),
    lineHeights: mapToSerializable(lineHeights),
    letterSpacings: mapToSerializable(letterSpacings)
  },
  zIndex: mapToSerializable(zIndexes),
  motion: {
    durations: mapToSerializable(durations),
    easings: mapToSerializable(easings)
  }
};

const themeCssPath = path.join(showcaseRoot, "src", "styles", "theme.css");
const themeCss = fs.readFileSync(themeCssPath, "utf8");
const cssVariables = [...themeCss.matchAll(/--([a-z0-9-]+):\s*([^;]+);/gi)].map((match) => ({
  name: match[1],
  value: match[2].trim()
}));

const groupedCandidates = cssVariables.reduce((acc, variable) => {
  const group = variable.name.includes("color") || variable.name.startsWith("vc-")
    ? "colors"
    : variable.name.includes("font")
      ? "typography"
      : variable.name.includes("radius")
        ? "radii"
        : variable.name.includes("chart")
          ? "charts"
          : "misc";
  (acc[group] ||= []).push(variable);
  return acc;
}, {});

const dedupedValues = cssVariables.reduce((acc, variable) => {
  (acc[variable.value] ||= []).push(variable.name);
  return acc;
}, {});

const tokensCandidates = {
  generatedAt: new Date().toISOString(),
  source: [
    toRelative(themeCssPath),
    toRelative(path.join(showcaseRoot, "src", "app", "lib", "tokens.ts"))
  ],
  groups: groupedCandidates,
  dedupedValues: Object.entries(dedupedValues)
    .map(([value, aliases]) => ({ value, aliases: aliases.sort(), aliasCount: aliases.length }))
    .sort((a, b) => b.aliasCount - a.aliasCount || a.value.localeCompare(b.value))
};

const componentsMap = `# Claude -> Canonical DS Map

| Claude source | Canonical DS target | Notes |
|---|---|---|
| layout/AppLayout, layout/Sidebar, layout/Section | patterns/SidebarLayout, patterns/Topbar, primitives/Card | Canonicalized as layout primitives + patterns for VAULT_CORE shell |
| ui/button, ui/input, ui/textarea, ui/select, ui/badge, ui/card, ui/separator | primitives/Button, primitives/Input, primitives/TextArea, primitives/Select, primitives/Badge, primitives/Card, primitives/Divider | Direct primitives mapping |
| ui/table, ui/tabs, ui/pagination | patterns/DataTable + primitives/TableLike elements | Simplified minimal coherent mapping |
| ui/dialog, ui/alert-dialog, ui/drawer, ui/sheet, ui/popover, ui/tooltip | patterns/Modal + overlay aliases | Minimal coherent overlay API with TODO for advanced behaviors |
| ui/accordion, ui/collapsible, ui/navigation-menu, ui/menubar, ui/dropdown-menu, ui/context-menu | primitives/Claude UI alias components | TODO: advanced keyboard interactions parity when required |
| ui/checkbox, ui/radio-group, ui/switch, ui/toggle, ui/toggle-group, ui/slider | primitives form controls + aliases | Unified states via semantic tokens |
| ui/skeleton, ui/progress, ui/chart, ui/carousel | primitives/Skeleton, primitives/Progress, primitives/Chart, primitives/Carousel aliases | TODO for rich data visualization variants |
| vault/ContractCard | vault-core/ContractCard | Product card with scope, criteria, dependency/test metrics |
| vault/AgentCard | vault-core/AgentCard | Agent status card with progress and quality |
| vault/QualityGate | vault-core/GatePanel | Gate checklist + progress strip |
| vault/WorkflowTimeline | vault-core/Timeline | Execution timeline with state badges |
| vault/MemoryViewer | vault-core/MemoryItem list + patterns/DataTable | Read-only memory stream pattern |
| vault/LogViewer | vault-core/AuditTrail + LogRow | Operational logs and audit events |
| vault/MetricCard | primitives/Card + vault-core KPI composition | Reused in dashboard metrics |
`;

fs.writeFileSync(path.join(outputRoot, "inventory.json"), `${JSON.stringify(inventory, null, 2)}\n`, "utf8");
fs.writeFileSync(path.join(outputRoot, "style-audit.json"), `${JSON.stringify(styleAudit, null, 2)}\n`, "utf8");
fs.writeFileSync(path.join(outputRoot, "tokens-candidates.json"), `${JSON.stringify(tokensCandidates, null, 2)}\n`, "utf8");
fs.writeFileSync(path.join(outputRoot, "components-map.md"), componentsMap, "utf8");

console.log(`Generated claude-source artifacts in ${toRelative(outputRoot)}`);

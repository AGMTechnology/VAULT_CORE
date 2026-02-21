import fs from "node:fs";
import path from "node:path";

const IGNORED_DIRS = new Set([
  ".git",
  "node_modules",
  ".next",
  "dist",
  "build",
  "coverage",
  ".turbo",
  ".cache",
  "out",
  ".idea",
  ".vscode",
]);

const LANGUAGE_BY_EXTENSION = new Map([
  [".ts", "TypeScript"],
  [".tsx", "TypeScript"],
  [".js", "JavaScript"],
  [".jsx", "JavaScript"],
  [".mjs", "JavaScript"],
  [".cjs", "JavaScript"],
  [".py", "Python"],
  [".go", "Go"],
  [".rs", "Rust"],
  [".java", "Java"],
  [".kt", "Kotlin"],
  [".swift", "Swift"],
  [".dart", "Dart"],
  [".cs", "C#"],
]);

const FRAMEWORK_SIGNALS = new Map([
  ["next", "Next.js"],
  ["react", "React"],
  ["react-native", "React Native"],
  ["expo", "Expo"],
  ["electron", "Electron"],
  ["vite", "Vite"],
  ["@nestjs/core", "NestJS"],
  ["express", "Express"],
  ["fastify", "Fastify"],
  ["vue", "Vue"],
  ["svelte", "Svelte"],
]);

const TEST_TOOLING_SIGNALS = new Map([
  ["vitest", "Vitest"],
  ["jest", "Jest"],
  ["playwright", "Playwright"],
  ["@playwright/test", "Playwright"],
  ["cypress", "Cypress"],
  ["mocha", "Mocha"],
  ["pytest", "Pytest"],
]);

function toPosixPath(value) {
  return value.split(path.sep).join("/");
}

function uniqueSorted(values) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

function walkFiles(rootDir, currentDir, files, limit) {
  if (files.length >= limit) {
    return;
  }

  const entries = fs.readdirSync(currentDir, { withFileTypes: true });
  for (const entry of entries) {
    if (files.length >= limit) {
      break;
    }
    if (entry.name.startsWith(".") && entry.name !== ".github") {
      if (entry.isDirectory() && IGNORED_DIRS.has(entry.name)) {
        continue;
      }
    }

    const absolutePath = path.join(currentDir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) {
        continue;
      }
      walkFiles(rootDir, absolutePath, files, limit);
      continue;
    }

    const relative = toPosixPath(path.relative(rootDir, absolutePath));
    files.push(relative);
  }
}

function readPackageJson(workspacePath) {
  const packageJsonPath = path.join(workspacePath, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    return null;
  }
  try {
    const raw = fs.readFileSync(packageJsonPath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function detectPackageManagers(workspacePath, files) {
  const managers = [];
  if (files.includes("package-lock.json")) managers.push("npm");
  if (files.includes("pnpm-lock.yaml")) managers.push("pnpm");
  if (files.includes("yarn.lock")) managers.push("yarn");
  if (files.includes("bun.lockb") || files.includes("bun.lock")) managers.push("bun");
  if (files.includes("Cargo.toml")) managers.push("cargo");
  if (files.includes("pyproject.toml") || files.includes("requirements.txt")) managers.push("pip");

  if (managers.length === 0 && fs.existsSync(path.join(workspacePath, "package.json"))) {
    managers.push("npm");
  }
  return uniqueSorted(managers);
}

function detectLanguages(files) {
  const languages = [];
  for (const relativePath of files) {
    const extension = path.extname(relativePath).toLowerCase();
    const language = LANGUAGE_BY_EXTENSION.get(extension);
    if (language) {
      languages.push(language);
    }
  }
  return uniqueSorted(languages);
}

function detectFrameworksAndTests(packageJson) {
  const dependencies = {
    ...(packageJson?.dependencies ?? {}),
    ...(packageJson?.devDependencies ?? {}),
  };
  const dependencyNames = Object.keys(dependencies);

  const frameworks = [];
  const testTooling = [];
  for (const depName of dependencyNames) {
    const framework = FRAMEWORK_SIGNALS.get(depName);
    if (framework) frameworks.push(framework);
    const testTool = TEST_TOOLING_SIGNALS.get(depName);
    if (testTool) testTooling.push(testTool);
  }

  const testScript = String(packageJson?.scripts?.test ?? "").toLowerCase();
  if (testScript.includes("vitest")) testTooling.push("Vitest");
  if (testScript.includes("jest")) testTooling.push("Jest");
  if (testScript.includes("playwright")) testTooling.push("Playwright");
  if (testScript.includes("cypress")) testTooling.push("Cypress");

  return {
    frameworks: uniqueSorted(frameworks),
    testTooling: uniqueSorted(testTooling),
    dependencyNames: uniqueSorted(dependencyNames),
  };
}

function detectCiFiles(files) {
  return files
    .filter((filePath) => {
      if (filePath.startsWith(".github/workflows/")) return true;
      if (filePath === ".gitlab-ci.yml") return true;
      if (filePath === "azure-pipelines.yml") return true;
      if (filePath === ".circleci/config.yml") return true;
      return false;
    })
    .sort((a, b) => a.localeCompare(b));
}

function detectDocs(files) {
  return files
    .filter((filePath) => {
      const normalized = filePath.toLowerCase();
      const filename = path.posix.basename(normalized);
      if (filename.startsWith("readme")) return true;
      if (normalized.startsWith("docs/")) return true;
      if (filename.endsWith(".md")) return true;
      return false;
    })
    .sort((a, b) => a.localeCompare(b))
    .slice(0, 200);
}

export function scanWorkspaceContext(workspacePath, options = {}) {
  const maxFiles = Number.isInteger(options.maxFiles) && options.maxFiles > 0 ? options.maxFiles : 5000;
  const files = [];
  walkFiles(workspacePath, workspacePath, files, maxFiles);

  const packageJson = readPackageJson(workspacePath);
  const { frameworks, testTooling, dependencyNames } = detectFrameworksAndTests(packageJson);
  const analysis = {
    workspacePath,
    languages: detectLanguages(files),
    frameworks,
    packageManagers: detectPackageManagers(workspacePath, files),
    testTooling,
    ciFiles: detectCiFiles(files),
    docs: detectDocs(files),
    evidence: {
      packageJson: packageJson ? "package.json" : null,
      lockfiles: files.filter((file) =>
        ["package-lock.json", "pnpm-lock.yaml", "yarn.lock", "bun.lock", "bun.lockb"].includes(file),
      ),
      ciFiles: detectCiFiles(files),
      docs: detectDocs(files).slice(0, 20),
      sampleFiles: files.slice(0, 200),
      dependencies: dependencyNames,
    },
  };

  return analysis;
}

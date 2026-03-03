#!/usr/bin/env node

const FIGMA_REPO_URL = process.env.FIGMA_REPO_URL || "https://github.com/Kharmon94/3dglassmorphismportfolio.git";
const DESIGN_REPO_DIR = ".figma-design-repo";
const SRC_DIR = "src";

const FILES_TO_PRESERVE = [
  "services/api.ts",
  "types/index.ts",
  "utils/permissions.ts",
  "utils",
  "app/context/AuthContext.tsx",
  "app/context/ProjectsContext.tsx",
];

function exec(cmd, opts = {}) {
  const { spawnSync } = require("child_process");
  const result = spawnSync(cmd, { shell: true, stdio: "inherit", ...opts });
  return result.status;
}

function execCapture(cmd) {
  const { execSync } = require("child_process");
  return execSync(cmd, { encoding: "utf-8" }).trim();
}

function isPreserve(path) {
  return FILES_TO_PRESERVE.some((p) => path === p || path.startsWith(p + "/"));
}

async function check() {
  const fs = require("fs");
  const path = require("path");
  const root = path.resolve(__dirname, "..");

  if (!fs.existsSync(path.join(root, DESIGN_REPO_DIR))) {
    console.log("Cloning design repo...");
    if (exec(`git clone ${FIGMA_REPO_URL} ${DESIGN_REPO_DIR}`, { cwd: root }) !== 0) {
      console.error("Failed to clone design repo");
      process.exit(1);
    }
  } else {
    console.log("Pulling design repo...");
    if (exec("git pull", { cwd: path.join(root, DESIGN_REPO_DIR) }) !== 0) {
      console.warn("git pull failed, continuing with existing clone");
    }
  }

  const designSrc = path.join(root, DESIGN_REPO_DIR, SRC_DIR);
  const frontendSrc = path.join(root, SRC_DIR);
  const designFiles = [];
  const frontendFiles = [];

  function walk(dir, base, out) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const rel = path.join(base, e.name);
      if (e.isDirectory()) {
        walk(path.join(dir, e.name), rel, out);
      } else {
        out.push(rel);
      }
    }
  }

  walk(designSrc, "", designFiles);
  walk(frontendSrc, "", frontendFiles);

  const state = {
    designRepoUrl: FIGMA_REPO_URL,
    designFileCount: designFiles.length,
    frontendFileCount: frontendFiles.length,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(
    path.join(root, ".figma-sync-state.json"),
    JSON.stringify(state, null, 2)
  );
  console.log("State written to .figma-sync-state.json");
  console.log("Design repo files:", designFiles.length);
  console.log("Frontend src files:", frontendFiles.length);
}

async function diff() {
  const fs = require("fs");
  const path = require("path");
  const root = path.resolve(__dirname, "..");

  const designSrc = path.join(root, DESIGN_REPO_DIR, SRC_DIR);
  const frontendSrc = path.join(root, SRC_DIR);

  if (!fs.existsSync(designSrc)) {
    console.log("Run 'npm run figma:check' first to clone the design repo.");
    process.exit(1);
  }

  const preservePaths = new Set(FILES_TO_PRESERVE);

  function walk(dir, base, out) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const rel = path.join(base, e.name).replace(/\\/g, "/");
      if (e.isDirectory()) {
        walk(path.join(dir, e.name), rel, out);
      } else {
        out.push(rel);
      }
    }
  }

  const designFiles = [];
  const frontendFiles = [];
  walk(designSrc, "", designFiles);
  walk(frontendSrc, "", frontendFiles);

  console.log("\n=== Files to preserve (integration layer, do not overwrite) ===");
  FILES_TO_PRESERVE.forEach((p) => console.log("  -", p));

  console.log("\n=== Design repo has, frontend may be missing ===");
  const frontendSet = new Set(frontendFiles);
  designFiles
    .filter((f) => !frontendSet.has(f) && !isPreserve(f))
    .forEach((f) => console.log("  +", f));

  console.log("\n=== Frontend has, design repo does not ===");
  const designSet = new Set(designFiles);
  frontendFiles
    .filter((f) => !designSet.has(f) || isPreserve(f))
    .forEach((f) => console.log("  ", isPreserve(f) ? "[preserve]" : "  ", f));
}

const cmd = process.argv[2];
if (cmd === "check") {
  check().catch((e) => {
    console.error(e);
    process.exit(1);
  });
} else if (cmd === "diff") {
  diff().catch((e) => {
    console.error(e);
    process.exit(1);
  });
} else {
  console.log("Usage: node figma-sync.js <check|diff>");
  console.log("  check - Clone/pull design repo, write .figma-sync-state.json");
  console.log("  diff  - Report design repo vs frontend, list files to preserve");
  process.exit(1);
}

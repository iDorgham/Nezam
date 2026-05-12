#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

function fileExists(p) {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function ensureParentDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fileExists(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function main() {
  const repoRoot = process.cwd();
  const registryPath = path.join(repoRoot, ".nezam/gates/hardlock-paths.json");
  const templateCandidates = [
    path.join(repoRoot, ".nezam/templates/specs/CHANGELOG.template.md"),
    path.join(repoRoot, "docs/templates/specs/CHANGELOG.template.md"),
  ];

  if (!fileExists(registryPath)) {
    process.exit(1);
  }

  const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
  const changelogRelPath = registry?.planning?.changelog;
  if (!changelogRelPath || typeof changelogRelPath !== "string") {
    process.exit(1);
  }

  const changelogPath = path.join(repoRoot, changelogRelPath);
  if (fileExists(changelogPath)) {
    process.exit(0);
  }

  const templatePath = templateCandidates.find((p) => fileExists(p));
  if (!templatePath) {
    process.exit(1);
  }

  ensureParentDir(changelogPath);
  fs.copyFileSync(templatePath, changelogPath);
}

main();


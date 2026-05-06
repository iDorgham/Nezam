#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = process.cwd();
const failures = [];

function readUtf8(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function walkFiles(dirPath, acc = []) {
  if (!fs.existsSync(dirPath)) return acc;
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    if (entry.name === ".DS_Store") continue;
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) walkFiles(fullPath, acc);
    else acc.push(fullPath);
  }
  return acc;
}

function checkLegacyPathRefs() {
  const canonicalRoots = [
    path.join(repoRoot, ".cursor", "commands"),
    path.join(repoRoot, ".cursor", "agents"),
    path.join(repoRoot, ".cursor", "skills"),
    path.join(repoRoot, ".cursor", "rules"),
  ];
  // No /g flag — global RegExp.test mutates lastIndex and can miss matches across files.
  const badPatterns = [
    /docs\/specs\//,
    /docs\/prompts\//,
    /docs\/context\//,
  ];

  for (const root of canonicalRoots) {
    for (const file of walkFiles(root).filter((f) => /\.(md|mdc)$/.test(f))) {
      const content = readUtf8(file);
      for (const pattern of badPatterns) {
        if (pattern.test(content)) {
          failures.push(
            `Legacy path reference "${pattern.source}" in ${path.relative(repoRoot, file)}`
          );
        }
      }
    }
  }
}

function checkHandoffPacketFields() {
  const skillPath = path.join(
    repoRoot,
    ".cursor",
    "skills",
    "coi-multi-agent-handoff",
    "SKILL.md"
  );
  if (!fs.existsSync(skillPath)) {
    failures.push("Missing .cursor/skills/coi-multi-agent-handoff/SKILL.md");
    return;
  }
  const content = readUtf8(skillPath);
  const requiredTokens = [
    "task_id:",
    "objective:",
    "manager:",
    "leader:",
    "specialists:",
    "allowed_files:",
    "dependencies:",
    "acceptance_checks:",
    "validation_command:",
    "timeout_budget:",
  ];
  for (const token of requiredTokens) {
    if (!content.includes(token)) {
      failures.push(`Missing handoff field token "${token}" in ${path.relative(repoRoot, skillPath)}`);
    }
  }
}

function parseActiveSubphaseDirsFromIndex(indexPath) {
  const content = readUtf8(indexPath);
  const dirs = new Set();
  for (const line of content.split("\n")) {
    if (!line.includes("|")) continue;
    const cols = line.split("|").map((c) => c.trim());
    if (cols.length < 6) continue;
    const specCol = cols[3];
    const statusCol = cols[4] ? cols[4].toLowerCase() : "";
    if (!specCol.startsWith("`docs/core/plan/")) continue;
    if (statusCol === "not started" || statusCol === "status") continue;
    const specPath = specCol.replaceAll("`", "");
    const match = specPath.match(/^docs\/core\/plan\/([^/]+)\/([^/]+)\//);
    if (match) dirs.add(path.join(repoRoot, "docs", "core", "plan", match[1], match[2]));
  }
  return [...dirs];
}

function checkActiveSubphaseArtifacts() {
  const indexPath = path.join(repoRoot, "docs", "core", "plan", "INDEX.md");
  if (!fs.existsSync(indexPath)) {
    failures.push("Missing docs/core/plan/INDEX.md");
    return;
  }
  const activeDirs = parseActiveSubphaseDirsFromIndex(indexPath);
  for (const dir of activeDirs) {
    const promptJson = path.join(dir, "prompt.json");
    const promptMd = path.join(dir, "PROMPT.md");
    if (!fs.existsSync(promptJson) || !fs.existsSync(promptMd)) {
      failures.push(
        `Active subphase missing prompt artifacts in ${path.relative(repoRoot, dir)} (requires prompt.json and PROMPT.md)`
      );
    }
  }
}

checkLegacyPathRefs();
checkHandoffPacketFields();
checkActiveSubphaseArtifacts();

if (failures.length) {
  console.error("SDD swarm integrity check failed:");
  for (const failure of failures) console.error(` - ${failure}`);
  process.exit(1);
}

console.log("SDD swarm integrity check passed.");

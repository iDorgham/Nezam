#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { getWorkspacePaths } = require("../utils/workspace-paths.js");

const repoRoot = process.cwd();
const wsConfig = getWorkspacePaths(repoRoot);
const planFolder = wsConfig.paths.plan_folder || ".nezam/core/plans";
const planFolderAbs = path.resolve(repoRoot, planFolder);
const plansIndexFile = wsConfig.hardlocks.plans_index || ".nezam/core/plans/INDEX.md";
const plansIndexAbs = path.resolve(repoRoot, plansIndexFile);

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
    path.resolve(repoRoot, wsConfig.paths.commands_folder || ".cursor/commands"),
    path.resolve(repoRoot, wsConfig.paths.agents_folder || ".cursor/agents"),
    path.resolve(repoRoot, wsConfig.paths.skills_folder || ".cursor/skills"),
    path.resolve(repoRoot, wsConfig.paths.rules_folder || ".cursor/rules"),
  ];
  // No /g flag — global RegExp.test mutates lastIndex and can miss matches across files.
  // Block deprecated doc roots inside canonical `.cursor/` prose only.
  // Note: `docs/specs/` is allowed — canonical SDD specs per `system/spec-writing` skill.
  const badPatterns = [/docs\/prompts\//, /docs\/context\//];

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
  const skillsRoot = wsConfig.paths.skills_folder || ".cursor/skills";
  const candidatePaths = [
    path.join(repoRoot, skillsRoot, "system", "multi-agent-handoff", "SKILL.md"),
    path.join(repoRoot, skillsRoot, "nezam-multi-agent-handoff", "SKILL.md"),
    path.join(repoRoot, skillsRoot, "system", "nezam-multi-agent-handoff", "SKILL.md"),
  ];
  const skillPath = candidatePaths.find((p) => fs.existsSync(p));
  if (!skillPath) {
    failures.push(
      `Missing handoff skill file (expected ${skillsRoot}/system/multi-agent-handoff/SKILL.md)`
    );
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

function resolvePlansSubphaseDir(specPath) {
  // Support all known plans root locations (nezam governance + legacy paths).
  const prefixMap = [
    { prefix: planFolder.endsWith("/") ? planFolder : planFolder + "/", base: planFolderAbs },
    { prefix: ".nezam/core/plans/", base: planFolderAbs },
  ];
  for (const { prefix, base } of prefixMap) {
    if (specPath.startsWith(prefix)) {
      const rest = specPath.slice(prefix.length);
      const parts = rest.split("/").filter(Boolean);
      if (parts.length >= 2) {
        return path.join(base, parts[0], parts[1]);
      }
    }
  }
  // Also support relative path resolution (e.g. 02-design/01-tokens/SPEC.md)
  if (!specPath.startsWith("/") && !specPath.startsWith(".")) {
    const parts = specPath.split("/").filter(Boolean);
    if (parts.length >= 2) {
      return path.join(planFolderAbs, parts[0], parts[1]);
    }
  }
  return null;
}

function parseActiveSubphaseDirsFromIndex(indexPath) {
  const content = readUtf8(indexPath);
  const dirs = new Set();
  for (const line of content.split("\n")) {
    if (!line.includes("|")) continue;
    const cols = line.split("|").map((c) => c.trim());
    if (cols.length < 6) continue;
    const specCol = cols[3];
    const statusCol = cols[5] ? cols[5].toLowerCase() : "";
    if (statusCol === "not started" || statusCol === "status" || statusCol === "pending" || statusCol === "⚪️ pending") continue;
    
    let specPath = specCol.replaceAll("`", "");
    const match = specPath.match(/\[.*?\]\((.*?)\)/);
    if (match) {
      specPath = match[1];
    }
    const dir = resolvePlansSubphaseDir(specPath);
    if (dir) dirs.add(dir);
  }
  return [...dirs];
}

function checkActiveSubphaseArtifacts() {
  const indexPath = plansIndexAbs;
  if (!fs.existsSync(indexPath)) {
    // Check if planning is not completed yet per onboarding state
    const onboardingFile = wsConfig.hardlocks.onboarding || ".cursor/state/onboarding.yaml";
    const onboardingPath = path.resolve(repoRoot, onboardingFile);
    let planningComplete = false;
    if (fs.existsSync(onboardingPath)) {
      const content = fs.readFileSync(onboardingPath, "utf8");
      if (content.includes("planning_complete: true")) {
        planningComplete = true;
      }
    }
    
    if (!planningComplete) {
      console.warn(`⚠️ [integrity] Dynamic plans index (${plansIndexFile}) does not exist yet (planning not complete). Skipping subphase check.`);
      return;
    }

    failures.push(
      `Missing plan index (expected ${plansIndexFile})`
    );
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

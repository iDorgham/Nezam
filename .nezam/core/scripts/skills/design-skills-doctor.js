#!/usr/bin/env node
/**
 * List or doctor design-skills manifest vs vendored paths.
 * Usage:
 *   node design-skills-doctor.js list
 *   node design-skills-doctor.js doctor
 */
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const MANIFEST = path.join(ROOT, ".nezam/core/gates/design-skills.yaml");
const WORKSPACE_SETTINGS = path.join(ROOT, ".nezam/core/gates/workspace.settings.yaml");

function parseSimpleManifest(text) {
  const skills = [];
  let current = null;
  let inSkills = false;
  let inStacks = false;
  let stackPhase = null;
  const defaultStacks = {};

  for (const line of text.split("\n")) {
    // Top-level `skills:` only — not nested `skills:` under default_stacks
    if (/^skills:\s*$/.test(line)) {
      inSkills = true;
      inStacks = false;
      continue;
    }
    if (/^default_stacks:\s*$/.test(line)) {
      inStacks = true;
      inSkills = false;
      continue;
    }

    if (inSkills) {
      const idLine = line.match(/^\s+-\s+id:\s+(.+)$/);
      if (idLine) {
        current = { id: idLine[1].trim(), enabled: true };
        skills.push(current);
        continue;
      }
      if (!current) continue;
      const enabled = line.match(/^\s+enabled:\s+(true|false)/);
      if (enabled) current.enabled = enabled[1] === "true";
      const dir = line.match(/^\s+canonical_dir:\s+(.+)$/);
      if (dir) current.canonical_dir = dir[1].trim().replace(/^["']|["']$/g, "");
    }

    if (inStacks) {
      const phase = line.match(/^\s{2}([a-z_]+):\s*$/);
      if (phase) {
        stackPhase = phase[1];
        defaultStacks[stackPhase] = [];
        continue;
      }
      const item = line.match(/^\s{6}-\s+(.+)$/);
      if (item && stackPhase) defaultStacks[stackPhase].push(item[1].trim());
    }
  }
  return { skills, defaultStacks };
}

function parseOverrides(text) {
  const overrides = {};
  let inDesign = false;
  let inOverrides = false;
  let currentId = null;

  for (const line of text.split("\n")) {
    if (/^design_skills:\s*$/.test(line)) {
      inDesign = true;
      continue;
    }
    if (inDesign && /^  overrides:\s*$/.test(line)) {
      inOverrides = true;
      continue;
    }
    if (inDesign && inOverrides) {
      const id = line.match(/^\s{4}([a-z0-9-]+):\s*$/);
      if (id) {
        currentId = id[1];
        overrides[currentId] = {};
        continue;
      }
      const en = line.match(/^\s{6}enabled:\s+(true|false)/);
      if (en && currentId) overrides[currentId].enabled = en[1] === "true";
    }
    if (inDesign && /^[a-z_]+:\s*$/.test(line) && !line.startsWith("  ")) inDesign = false;
  }
  return overrides;
}

function effectiveEnabled(skill, overrides) {
  if (overrides[skill.id] && typeof overrides[skill.id].enabled === "boolean") {
    return overrides[skill.id].enabled;
  }
  return skill.enabled !== false;
}

function resolveSkillDir(id, skills) {
  const s = skills.find((x) => x.id === id);
  if (s?.canonical_dir) return path.join(ROOT, s.canonical_dir);
  const designPath = path.join(ROOT, `.cursor/skills/design/${id}/SKILL.md`);
  if (fs.existsSync(designPath)) return path.dirname(designPath);
  if (id === "impeccable") {
    const p = path.join(ROOT, ".cursor/skills/impeccable/SKILL.md");
    if (fs.existsSync(p)) return path.dirname(p);
  }
  return null;
}

function checkFrontmatter(skillMdPath) {
  const text = fs.readFileSync(skillMdPath, "utf8");
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return { ok: false, issues: ["missing frontmatter"] };
  const issues = [];
  const tier = m[1].match(/^tier:\s*(\d+)/m);
  if (!tier || ![1, 2, 3].includes(Number(tier[1]))) issues.push("tier must be 1|2|3");
  if (!/^version:\s*.+/m.test(m[1])) issues.push("missing version");
  return { ok: issues.length === 0, issues };
}

function cmdList() {
  const { skills, defaultStacks } = parseSimpleManifest(fs.readFileSync(MANIFEST, "utf8"));
  const overrides = fs.existsSync(WORKSPACE_SETTINGS)
    ? parseOverrides(fs.readFileSync(WORKSPACE_SETTINGS, "utf8"))
    : {};

  console.log("Design skills\n");
  for (const s of skills) {
    const on = effectiveEnabled(s, overrides);
    const dir = resolveSkillDir(s.id, skills);
    const ok = dir && fs.existsSync(path.join(dir, "SKILL.md"));
    console.log(`  ${on ? "ON " : "OFF"}  ${s.id.padEnd(28)}  ${ok ? "ok" : "MISSING"}  ${s.canonical_dir || ""}`);
  }
  console.log("\nDefault stacks:");
  for (const [phase, ids] of Object.entries(defaultStacks)) {
    console.log(`  ${phase}: ${ids.join(", ")}`);
  }
}

function cmdDoctor() {
  const { skills, defaultStacks } = parseSimpleManifest(fs.readFileSync(MANIFEST, "utf8"));
  const overrides = fs.existsSync(WORKSPACE_SETTINGS)
    ? parseOverrides(fs.readFileSync(WORKSPACE_SETTINGS, "utf8"))
    : {};
  let errors = 0;

  for (const s of skills) {
    const dir = resolveSkillDir(s.id, skills);
    const skillMd = dir ? path.join(dir, "SKILL.md") : null;
    if (!skillMd || !fs.existsSync(skillMd)) {
      console.error(`ERROR  ${s.id}: missing SKILL.md`);
      errors++;
      continue;
    }
    const fm = checkFrontmatter(skillMd);
    if (!fm.ok) {
      console.error(`ERROR  ${s.id}: ${fm.issues.join("; ")}`);
      errors++;
    }
  }

  for (const ids of Object.values(defaultStacks)) {
    for (const id of ids) {
      const dir = resolveSkillDir(id, skills);
      if (!dir || !fs.existsSync(path.join(dir, "SKILL.md"))) {
        console.error(`ERROR  default_stacks: "${id}" not vendored`);
        errors++;
      }
    }
  }

  console.log(`\nDoctor: ${errors} error(s)`);
  process.exit(errors > 0 ? 1 : 0);
}

const cmd = process.argv[2] || "doctor";
if (cmd === "list") cmdList();
else if (cmd === "doctor") cmdDoctor();
else {
  console.error("Usage: design-skills-doctor.js list|doctor");
  process.exit(1);
}

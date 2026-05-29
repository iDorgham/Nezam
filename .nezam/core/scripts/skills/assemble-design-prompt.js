#!/usr/bin/env node
/**
 * Merge opt-in designSkillStack into prompt.json and PROMPT.md.
 *
 * Usage:
 *   node assemble-design-prompt.js --phase plan_design
 *   node assemble-design-prompt.js --phase develop_ui --write --dir docs/plan/07-build/feature-x
 *   node assemble-design-prompt.js --prompt path/to/prompt.json
 */

const fs = require("fs");
const path = require("path");

const repoRoot = process.cwd();
const manifestPath = path.join(repoRoot, ".nezam/core/gates/design-skills.yaml");

function expandPhaseStacks(text) {
  const stacks = {};
  let phase = null;
  let inStacks = false;
  let inSkills = false;

  for (const line of text.split("\n")) {
    if (line.trim() === "default_stacks:") {
      inStacks = true;
      continue;
    }
    if (!inStacks) continue;

    const phaseMatch = line.match(/^\s{2}([a-z_]+):\s*$/);
    if (phaseMatch) {
      phase = phaseMatch[1];
      stacks[phase] = [];
      inSkills = false;
      continue;
    }

    if (phase && /^\s{4}skills:\s*$/.test(line)) {
      inSkills = true;
      continue;
    }

    if (inSkills && phase) {
      const item = line.match(/^\s{6}-\s+(.+)$/);
      if (item) stacks[phase].push(item[1].trim());
      else if (line.match(/^\s{2}[a-z]/)) inSkills = false;
    }
  }
  return stacks;
}

function skillPathsForIds(ids) {
  const text = fs.readFileSync(manifestPath, "utf8");
  const dirById = {};
  let currentId = null;

  for (const line of text.split("\n")) {
    const idLine = line.match(/^\s+-\s+id:\s+(.+)$/);
    if (idLine) {
      currentId = idLine[1].trim();
      continue;
    }
    const dirLine = line.match(/^\s+canonical_dir:\s+(.+)$/);
    if (dirLine && currentId) {
      dirById[currentId] = dirLine[1].trim().replace(/^["']|["']$/g, "");
    }
  }

  return ids.map((id) => {
    let dir = dirById[id];
    if (!dir && id === "design-intelligence-index") {
      dir = ".cursor/skills/design/design-intelligence-index";
    }
    if (!dir) return { id, path: null };
    const skillPath = path.join(repoRoot, dir, "SKILL.md");
    return { id, path: fs.existsSync(skillPath) ? skillPath : null };
  });
}

function buildStack(phaseHint, skillIds) {
  return {
    enabled: true,
    phaseHint,
    manifest: ".nezam/core/gates/design-skills.yaml",
    skills: skillIds,
    readFirst: ["DESIGN.md", ".nezam/core/gates/design-skills.yaml"],
    notes:
      "Opt-in stack — load listed SKILL.md via @path only; do not paste full skill bodies into prompts.",
  };
}

function markdownSection(phaseHint, resolved) {
  const lines = [
    "## Design skill stack (opt-in)",
    "",
    `Phase hint: \`${phaseHint}\`. Manifest: \`.nezam/core/gates/design-skills.yaml\`.`,
    "",
    "Load these skills by path reference only:",
    "",
  ];
  for (const s of resolved) {
    lines.push(s.path ? `- \`${s.id}\` → @${s.path}` : `- \`${s.id}\` → **MISSING** (run pnpm skills:vendor-design)`);
  }
  lines.push("", "Regenerate: `pnpm skills:assemble-design-prompt --phase " + phaseHint + " --write --dir <this-folder>`");
  return lines.join("\n");
}

function upsertPromptMd(promptMdPath, section) {
  const marker = "## Design skill stack (opt-in)";
  let body = fs.existsSync(promptMdPath) ? fs.readFileSync(promptMdPath, "utf8") : "# Subphase prompt\n\n";
  if (body.includes(marker)) {
    const re = new RegExp(`${marker}[\\s\\S]*?(?=\\n## |$)`);
    body = body.replace(re, section + "\n\n");
  } else {
    body = body.trimEnd() + "\n\n" + section + "\n";
  }
  fs.writeFileSync(promptMdPath, body);
}

function writeDir(dirArg, phaseHint, skillIds) {
  const dir = path.resolve(repoRoot, dirArg);
  fs.mkdirSync(dir, { recursive: true });

  const stack = buildStack(phaseHint, skillIds);
  const resolved = skillPathsForIds(skillIds);
  const promptJsonPath = path.join(dir, "prompt.json");

  let prompt = {};
  if (fs.existsSync(promptJsonPath)) {
    prompt = JSON.parse(fs.readFileSync(promptJsonPath, "utf8"));
  } else {
    prompt = {
      phase: path.basename(dir),
      version: "1.0.0",
      generated_by: "assemble-design-prompt.js",
    };
  }
  prompt.designSkillStack = stack;
  fs.writeFileSync(promptJsonPath, JSON.stringify(prompt, null, 2) + "\n");

  upsertPromptMd(path.join(dir, "PROMPT.md"), markdownSection(phaseHint, resolved));

  console.log(`Wrote ${promptJsonPath}`);
  console.log(`Updated ${path.join(dir, "PROMPT.md")}`);
  console.log(JSON.stringify({ phaseHint, skills: resolved }, null, 2));
}

function main() {
  const args = process.argv.slice(2);
  const getArg = (flag) => {
    const eq = args.find((a) => a.startsWith(`${flag}=`));
    if (eq) return eq.split("=")[1];
    const i = args.indexOf(flag);
    return i >= 0 ? args[i + 1] : null;
  };

  const phaseArg = getArg("--phase");
  const promptArg = getArg("--prompt");
  const dirArg = getArg("--dir");
  const write = args.includes("--write");

  if (!fs.existsSync(manifestPath)) {
    console.error("Missing design-skills.yaml");
    process.exit(1);
  }

  const stacks = expandPhaseStacks(fs.readFileSync(manifestPath, "utf8"));

  if (promptArg) {
    const promptPath = path.resolve(repoRoot, promptArg);
    const prompt = JSON.parse(fs.readFileSync(promptPath, "utf8"));
    const stack = prompt.designSkillStack || {};
    if (!stack.enabled) {
      console.log("designSkillStack.enabled is false — nothing to assemble.");
      process.exit(0);
    }
    const hint = stack.phaseHint || phaseArg || "plan_design";
    const ids = stack.skills?.length ? stack.skills : stacks[hint] || [];
    if (write && dirArg) writeDir(dirArg, hint, ids);
    else console.log(JSON.stringify({ phaseHint: hint, skills: skillPathsForIds(ids) }, null, 2));
    return;
  }

  const phase = phaseArg || "plan_design";
  const ids = stacks[phase];
  if (!ids) {
    console.error(`Unknown phase: ${phase}. Known: ${Object.keys(stacks).join(", ")}`);
    process.exit(1);
  }

  if (write) {
    if (!dirArg) {
      console.error("--write requires --dir <docs/plan/phase/subphase>");
      process.exit(1);
    }
    writeDir(dirArg, phase, ids);
    return;
  }

  console.log(JSON.stringify({ phaseHint: phase, stack: buildStack(phase, ids), skills: skillPathsForIds(ids) }, null, 2));
}

main();

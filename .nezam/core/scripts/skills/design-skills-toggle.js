#!/usr/bin/env node
/**
 * Enable or disable a design skill via workspace.settings.yaml overrides.
 * Usage: node design-skills-toggle.js enable emil-design-eng
 */
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const SETTINGS = path.join(ROOT, ".nezam/core/gates/workspace.settings.yaml");

const [,, action, skillId] = process.argv;
if (!["enable", "disable"].includes(action) || !skillId) {
  console.error("Usage: design-skills-toggle.js enable|disable <skill-id>");
  process.exit(1);
}

const val = action === "enable" ? "true" : "false";
let text = fs.readFileSync(SETTINGS, "utf8");

if (!text.includes("design_skills:")) {
  text += `\ndesign_skills:\n  manifest: ".nezam/core/gates/design-skills.yaml"\n  overrides: {}\n`;
}

const blockRe = new RegExp(`(\\s{4}${skillId}:\\s*\\n(?:\\s{6}[a-z_]+:.*\\n)*)`, "m");
const insert = `    ${skillId}:\n      enabled: ${val}\n`;

if (blockRe.test(text)) {
  text = text.replace(
    new RegExp(`(\\s{4}${skillId}:\\s*\\n)(\\s{6}enabled:\\s*)(true|false)`, "m"),
    `$1$2${val}`
  );
} else if (/^\s{2}overrides:\s*$/m.test(text)) {
  text = text.replace(/(\n\s{2}overrides:\s*\n)/, `$1${insert}`);
} else {
  text = text.replace(
    /(design_skills:\s*\n(?:\s{2}[^\n]+\n)*)/,
    `$1  overrides:\n${insert}`
  );
}

fs.writeFileSync(SETTINGS, text);
console.log(`${skillId} → enabled: ${val} (workspace override)`);
console.log("Run: pnpm skills:doctor-design && pnpm ai:sync");

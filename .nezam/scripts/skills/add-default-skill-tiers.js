#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "../../..");
const skillsRoot = path.join(repoRoot, ".cursor", "skills");

function walk(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, out);
    } else if (entry.isFile() && entry.name === "SKILL.md") {
      out.push(fullPath);
    }
  }
  return out;
}

const files = walk(skillsRoot);
let updated = 0;

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  if (!content.includes("tier:")) {
    content = content.replace("---", "---\ntier: 3");
    fs.writeFileSync(file, content);
    updated++;
  } else {
    // If tier is not 1, 2, or 3, set it to 3
    if (/tier:\s+[^123]\s*$/m.test(content)) {
      content = content.replace(/tier:\s+.*/, "tier: 3");
      fs.writeFileSync(file, content);
      updated++;
    }
  }
}

console.log(`[skill-tier-fix] Added tier: 3 to ${updated} skills.`);

#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
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

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return null;
  return match[1];
}

const files = walk(skillsRoot);
const missingVersion = [];
const missingUpdated = [];
const missingChangelog = [];

for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  const fm = parseFrontmatter(content);
  if (!fm) {
    missingVersion.push(file);
    missingUpdated.push(file);
    missingChangelog.push(file);
    continue;
  }

  if (!/^version:\s+/m.test(fm)) missingVersion.push(file);
  if (!/^updated:\s+/m.test(fm)) missingUpdated.push(file);
  if (!/^changelog:\s*/m.test(fm)) missingChangelog.push(file);
}

const hasWarnings = missingVersion.length || missingUpdated.length || missingChangelog.length;

if (hasWarnings) {
  console.warn("Warning: skill version frontmatter is incomplete in one or more .cursor/skills/**/SKILL.md files.");
  if (missingVersion.length) {
    console.warn("\nMissing 'version:'");
    missingVersion.forEach((f) => console.warn(`- ${path.relative(repoRoot, f)}`));
  }
  if (missingUpdated.length) {
    console.warn("\nMissing 'updated:'");
    missingUpdated.forEach((f) => console.warn(`- ${path.relative(repoRoot, f)}`));
  }
  if (missingChangelog.length) {
    console.warn("\nMissing 'changelog:'");
    missingChangelog.forEach((f) => console.warn(`- ${path.relative(repoRoot, f)}`));
  }
}

// Warning-only check by design.
process.exit(0);

#!/usr/bin/env node
/**
 * Draft changelog entries from completed plan tasks.
 *
 * - Reads hardlock paths from docs/core/hardlock-paths.json
 * - Scans .cursor/plans/*.plan.md for `todos:` blocks
 * - Collects tasks with `status: completed`
 * - Writes/refreshes a Drafts section in CHANGELOG.md
 */

import fs from "node:fs";
import path from "node:path";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fileExists(p) {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function listPlanFiles(plansDir) {
  if (!fileExists(plansDir)) return [];
  return fs
    .readdirSync(plansDir)
    .filter((f) => f.endsWith(".plan.md"))
    .map((f) => path.join(plansDir, f));
}

function parseTodosFrontmatter(markdown) {
  // Parse only the first YAML frontmatter block and extract `todos:`.
  const fmMatch = markdown.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!fmMatch) return [];
  const fm = fmMatch[1];

  const todosStart = fm.match(/^todos:\s*$/m);
  if (!todosStart) return [];

  // Simple, robust-enough parser for the known structure:
  // - id: ...
  //   content: ...
  //   status: ...
  const lines = fm.split("\n");
  const todos = [];
  let inTodos = false;
  let cur = null;

  for (const line of lines) {
    if (!inTodos) {
      if (line.trim() === "todos:") inTodos = true;
      continue;
    }

    if (/^\S/.test(line)) break; // next top-level key

    const itemStart = line.match(/^\s*-\s+id:\s*(.+)\s*$/);
    if (itemStart) {
      if (cur) todos.push(cur);
      cur = { id: itemStart[1].trim(), content: "", status: "" };
      continue;
    }

    const contentMatch = line.match(/^\s*content:\s*(.+)\s*$/);
    if (contentMatch && cur) {
      cur.content = contentMatch[1].trim();
      continue;
    }

    const statusMatch = line.match(/^\s*status:\s*(.+)\s*$/);
    if (statusMatch && cur) {
      cur.status = statusMatch[1].trim();
      continue;
    }
  }

  if (cur) todos.push(cur);
  return todos;
}

function upsertDraftsSection(changelog, draftLines) {
  const startMarker = "## Drafts (auto-generated — do not edit by hand)";
  const markerIndex = changelog.indexOf(startMarker);

  const renderedDrafts =
    `${startMarker}\n\n` +
    `<!--\n` +
    `This section is managed by automation.\n` +
    `If you need to correct a draft, update the source task or plan metadata instead.\n` +
    `-->\n\n` +
    (draftLines.length ? draftLines.join("\n") + "\n" : "_No drafts yet._\n");

  if (markerIndex === -1) {
    return changelog.trimEnd() + "\n\n" + renderedDrafts;
  }

  // Replace everything from startMarker to end of file (keep it simple and predictable).
  return changelog.slice(0, markerIndex).trimEnd() + "\n\n" + renderedDrafts;
}

function main() {
  const repoRoot = process.cwd();
  const registryPath = path.join(repoRoot, "docs/core/hardlock-paths.json");
  if (!fileExists(registryPath)) {
    console.error(`Missing hardlock path registry: ${registryPath}`);
    process.exit(1);
  }

  const registry = readJson(registryPath);
  const changelogPath = path.join(repoRoot, registry.planning?.changelog ?? "CHANGELOG.md");

  if (!fileExists(changelogPath)) {
    console.error(`Missing CHANGELOG.md at configured path: ${changelogPath}`);
    console.error(`Create it from docs/workspace/templates/specs/CHANGELOG.template.md`);
    process.exit(1);
  }

  const plansDir = path.join(repoRoot, ".cursor/plans");
  const planFiles = listPlanFiles(plansDir);

  const completed = [];
  for (const file of planFiles) {
    const md = fs.readFileSync(file, "utf8");
    const todos = parseTodosFrontmatter(md);
    for (const t of todos) {
      if (t.status === "completed") {
        completed.push({
          id: t.id,
          content: t.content || t.id,
          source: path.relative(repoRoot, file),
        });
      }
    }
  }

  completed.sort((a, b) => a.id.localeCompare(b.id));
  const draftLines = completed.map(
    (t) => `- [${t.id}] ${t.content} _(source: \`${t.source}\`)_`
  );

  const changelog = fs.readFileSync(changelogPath, "utf8");
  const next = upsertDraftsSection(changelog, draftLines);
  fs.writeFileSync(changelogPath, next, "utf8");

  console.log(`Updated drafts in ${path.relative(repoRoot, changelogPath)} (${draftLines.length} items).`);
}

main();


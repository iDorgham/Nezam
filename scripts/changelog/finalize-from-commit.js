#!/usr/bin/env node
/**
 * Finalize drafts into an Unreleased entry with commit metadata.
 *
 * Behavior:
 * - Reads hardlock paths from .nezam/gates/hardlock-paths.json
 * - Reads CHANGELOG.md
 * - Collects items under the Drafts section (lines starting with "- ")
 * - Appends them under "## [Unreleased] -> ### Changed" (creates section if missing)
 * - Clears drafts section to "_No drafts yet._"
 *
 * Notes:
 * - This is intentionally simple; it provides the "finalize on /SAVE commit" hook.
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

function fileExists(p) {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function safeExec(cmd) {
  try {
    return execSync(cmd, { stdio: ["ignore", "pipe", "ignore"] }).toString("utf8").trim();
  } catch {
    return "";
  }
}

function ensureUnreleasedChangedSection(changelog) {
  const unreleasedHeader = "## [Unreleased]";
  if (!changelog.includes(unreleasedHeader)) {
    return (
      changelog.trimEnd() +
      "\n\n" +
      "## [Unreleased]\n\n" +
      "### Added\n\n" +
      "### Changed\n\n" +
      "### Fixed\n\n" +
      "### Security\n"
    );
  }

  if (!changelog.match(/^### Changed\s*$/m)) {
    // Insert "### Changed" after Unreleased header (after optional Added).
    return changelog.replace(
      /^## \[Unreleased\]\s*$/m,
      "## [Unreleased]\n\n### Added\n\n### Changed\n\n### Fixed\n\n### Security"
    );
  }

  return changelog;
}

function extractDraftLines(changelog) {
  const marker = "## Drafts (auto-generated — do not edit by hand)";
  const idx = changelog.indexOf(marker);
  if (idx === -1) return { draftLines: [], before: changelog, after: "" };

  const before = changelog.slice(0, idx);
  const draftsBlock = changelog.slice(idx);
  const lines = draftsBlock.split("\n");

  const draftLines = [];
  for (const line of lines) {
    if (line.startsWith("- ")) draftLines.push(line);
  }

  return { draftLines, before, after: draftsBlock };
}

function clearDraftsSection(changelog) {
  const marker = "## Drafts (auto-generated — do not edit by hand)";
  const idx = changelog.indexOf(marker);
  if (idx === -1) return changelog;

  const before = changelog.slice(0, idx).trimEnd();
  const next =
    `${marker}\n\n` +
    `<!--\n` +
    `This section is managed by automation.\n` +
    `If you need to correct a draft, update the source task or plan metadata instead.\n` +
    `-->\n\n` +
    `_No drafts yet._\n`;
  return before + "\n\n" + next;
}

function appendToUnreleasedChanged(changelog, linesToAppend) {
  if (!linesToAppend.length) return changelog;

  const commitSha = safeExec("git rev-parse --short HEAD");
  const commitMsg = safeExec("git log -1 --pretty=%s");
  const stamp = new Date().toISOString().slice(0, 10);

  const header = `\n- ${stamp} (${commitSha || "no-git"}) ${commitMsg || "commit"}\n`;
  const block = header + linesToAppend.map((l) => `  ${l}`).join("\n") + "\n";

  // Insert immediately after "### Changed" line.
  return changelog.replace(/^### Changed\s*$/m, (m) => `${m}\n${block.trimEnd()}`);
}

function main() {
  const repoRoot = process.cwd();
  const registryPath = path.join(repoRoot, ".nezam/gates/hardlock-paths.json");
  if (!fileExists(registryPath)) {
    console.error(`Missing hardlock path registry: ${registryPath}`);
    process.exit(1);
  }

  const registry = readJson(registryPath);
  const changelogPath = path.join(repoRoot, registry.planning?.changelog ?? "CHANGELOG.md");
  if (!fileExists(changelogPath)) {
    console.error(`Missing CHANGELOG.md at configured path: ${changelogPath}`);
    process.exit(1);
  }

  let changelog = fs.readFileSync(changelogPath, "utf8");
  changelog = ensureUnreleasedChangedSection(changelog);

  const { draftLines } = extractDraftLines(changelog);
  if (!draftLines.length) {
    console.log("No draft lines found to finalize.");
    process.exit(0);
  }

  changelog = appendToUnreleasedChanged(changelog, draftLines);
  changelog = clearDraftsSection(changelog);

  fs.writeFileSync(changelogPath, changelog, "utf8");
  console.log(`Finalized ${draftLines.length} draft items into Unreleased -> Changed.`);
}

main();


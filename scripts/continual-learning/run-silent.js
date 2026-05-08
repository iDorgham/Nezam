#!/usr/bin/env node

const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = process.cwd();
const prepareScript = path.join(repoRoot, "scripts/continual-learning/prepare-incremental.js");
const candidatesPath = path.join(
  repoRoot,
  ".cursor/hooks/state/continual-learning-candidates.json"
);

function runPrepare() {
  return spawnSync(
    "node",
    [prepareScript, "--silent", "--json"],
    {
      cwd: repoRoot,
      stdio: ["ignore", "pipe", "pipe"],
      encoding: "utf8",
    }
  );
}

function main() {
  const prep = runPrepare();
  if (prep.status !== 0) {
    process.stderr.write(prep.stderr || "continual-learning prepare failed.\n");
    process.exit(1);
  }

  let summary = {};
  try {
    summary = JSON.parse(prep.stdout || "{}");
  } catch {
    process.stderr.write("Failed to parse continual-learning summary output.\n");
    process.exit(1);
  }

  if ((summary.finalCandidates || 0) === 0) {
    process.stdout.write("No high-signal memory updates.\n");
    return;
  }

  if (!fs.existsSync(candidatesPath)) {
    process.stderr.write("Candidates file missing after prepare phase.\n");
    process.exit(1);
  }

  process.stdout.write(
    `Continual-learning queued ${summary.finalCandidates} candidate transcript(s) in ${summary.batches} batch(es).\n`
  );
}

main();


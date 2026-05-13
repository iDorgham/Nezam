#!/usr/bin/env node

/**
 * Clears incremental transcript memory (index, fingerprints, candidates)
 * and resets the control file with enabled: false.
 * Does not edit AGENTS.md.template.md learned bullets.
 */

const fs = require("node:fs");
const path = require("node:path");
const { writeControl, DEFAULT_CONTROL } = require("./control-state");

const repoRoot = process.cwd();

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

const indexPath = path.join(repoRoot, ".cursor/hooks/state/continual-learning-index.json");
const fingerprintPath = path.join(repoRoot, ".cursor/hooks/state/continual-learning-fingerprints.json");
const candidatesPath = path.join(repoRoot, ".cursor/hooks/state/continual-learning-candidates.json");

writeJson(indexPath, {});
writeJson(fingerprintPath, {});
writeJson(candidatesPath, {
  generatedAt: new Date().toISOString(),
  transcriptsRoot: "",
  totalCandidates: 0,
  batchSize: 25,
  batches: [],
});

writeControl(repoRoot, { ...DEFAULT_CONTROL, enabled: false });

process.stdout.write(
  "Continual-learning memory reset (index, fingerprints, candidates cleared; control reset with enabled: false).\n"
);

"use strict";

const fs = require("node:fs");
const path = require("node:path");

const CONTROL_REL = ".cursor/hooks/state/continual-learning.json";

function controlPath(repoRoot) {
  return path.join(repoRoot, CONTROL_REL);
}

const DEFAULT_CONTROL = {
  version: 1,
  enabled: false,
  lastRunAtMs: null,
  turnsSinceLastRun: 0,
  lastTranscriptMtimeMs: null,
  lastProcessedGenerationId: null,
  trialStartedAtMs: null,
};

function readControl(repoRoot) {
  const p = controlPath(repoRoot);
  if (!fs.existsSync(p)) {
    return { ...DEFAULT_CONTROL };
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(p, "utf8"));
    return { ...DEFAULT_CONTROL, ...parsed };
  } catch {
    return { ...DEFAULT_CONTROL };
  }
}

function writeControl(repoRoot, control) {
  const p = controlPath(repoRoot);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const merged = { ...DEFAULT_CONTROL, ...readControl(repoRoot), ...control };
  fs.writeFileSync(p, JSON.stringify(merged, null, 2) + "\n", "utf8");
}

function isEnabled(repoRoot) {
  return readControl(repoRoot).enabled === true;
}

module.exports = {
  readControl,
  writeControl,
  isEnabled,
  controlPath,
  DEFAULT_CONTROL,
};

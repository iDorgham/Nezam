#!/usr/bin/env node
"use strict";

const { spawnSync } = require("node:child_process");

const result = spawnSync("node", ["scripts/sync-ai-folders.js", "--diff"], {
  stdio: "inherit",
  shell: false,
});

if (result.status !== 0) {
  console.error("\nAI sync drift found. Run: pnpm ai:sync");
  process.exit(result.status || 1);
}

console.log("AI sync drift check passed.");

#!/usr/bin/env node
/**
 * CI: manifest paths exist for enabled design skills + default_stacks.
 */
const { spawnSync } = require("child_process");
const path = require("path");

const script = path.join(__dirname, "../skills/design-skills-doctor.js");
const r = spawnSync(process.execPath, [script, "doctor"], {
  cwd: path.resolve(__dirname, "../../../.."),
  stdio: "inherit",
});
process.exit(r.status ?? 1);

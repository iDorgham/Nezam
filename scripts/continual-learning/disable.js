#!/usr/bin/env node

const { readControl, writeControl } = require("./control-state");

const repoRoot = process.cwd();
writeControl(repoRoot, { ...readControl(repoRoot), enabled: false });
process.stdout.write("Continual learning disabled.\n");

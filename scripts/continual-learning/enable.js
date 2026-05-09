#!/usr/bin/env node

const { readControl, writeControl } = require("./control-state");

const repoRoot = process.cwd();
writeControl(repoRoot, { ...readControl(repoRoot), enabled: true });
process.stdout.write(
  "Continual learning enabled. Transcript prepare/mining may run when hooks or pnpm continual-learning invoke it.\n"
);

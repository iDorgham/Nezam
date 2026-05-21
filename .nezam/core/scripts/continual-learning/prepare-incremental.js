#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { isEnabled } = require("./control-state");

const repoRoot = process.cwd();
const defaultIndexPath = path.join(
  repoRoot,
  ".cursor/hooks/state/continual-learning-index.json"
);
const defaultFingerprintPath = path.join(
  repoRoot,
  ".cursor/hooks/state/continual-learning-fingerprints.json"
);
const defaultCandidatesPath = path.join(
  repoRoot,
  ".cursor/hooks/state/continual-learning-candidates.json"
);
const defaultTranscriptsRoot =
  "/Users/Dorgham/.cursor/projects/Users-Dorgham-Documents-Work-Devleopment-COIA/agent-transcripts";

function parseArgs(argv) {
  const opts = {
    indexPath: defaultIndexPath,
    fingerprintPath: defaultFingerprintPath,
    candidatesPath: defaultCandidatesPath,
    transcriptsRoot: defaultTranscriptsRoot,
    silent: true,
    batchSize: 25,
    outputJson: false,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--index" && argv[i + 1]) opts.indexPath = argv[++i];
    else if (arg === "--fingerprints" && argv[i + 1]) opts.fingerprintPath = argv[++i];
    else if (arg === "--candidates" && argv[i + 1]) opts.candidatesPath = argv[++i];
    else if (arg === "--transcripts-root" && argv[i + 1]) opts.transcriptsRoot = argv[++i];
    else if (arg === "--batch-size" && argv[i + 1]) opts.batchSize = Number(argv[++i]) || 25;
    else if (arg === "--silent") opts.silent = true;
    else if (arg === "--no-silent") opts.silent = false;
    else if (arg === "--json") opts.outputJson = true;
  }

  return opts;
}

function ensureDirForFile(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function readJsonFile(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJsonFile(filePath, data) {
  ensureDirForFile(filePath);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function collectJsonlFiles(rootDir) {
  const out = [];
  if (!fs.existsSync(rootDir)) return out;

  const stack = [rootDir];
  while (stack.length) {
    const dir = stack.pop();
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) stack.push(fullPath);
      else if (entry.isFile() && fullPath.endsWith(".jsonl")) out.push(fullPath);
    }
  }
  return out;
}

function sha1OfFile(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash("sha1").update(buf).digest("hex");
}

function normalizeIndex(rawIndex) {
  const normalized = {};
  if (!rawIndex || typeof rawIndex !== "object") return normalized;
  for (const [filePath, mtime] of Object.entries(rawIndex)) {
    if (typeof mtime === "number") normalized[filePath] = mtime;
  }
  return normalized;
}

function normalizeFingerprintCache(rawCache) {
  const normalized = {};
  if (!rawCache || typeof rawCache !== "object") return normalized;
  for (const [filePath, val] of Object.entries(rawCache)) {
    if (
      val &&
      typeof val === "object" &&
      typeof val.mtimeMs === "number" &&
      typeof val.size === "number" &&
      typeof val.sha1 === "string"
    ) {
      normalized[filePath] = val;
    }
  }
  return normalized;
}

function buildBatches(items, batchSize) {
  const batches = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
}

function main() {
  const startedAtMs = Date.now();
  const opts = parseArgs(process.argv);

  if (!isEnabled(repoRoot)) {
    const summary = {
      totalTranscripts: 0,
      indexEntries: 0,
      mtimeCandidates: 0,
      finalCandidates: 0,
      batches: 0,
      hashComputations: 0,
      fingerprintSkips: 0,
      elapsedMs: Date.now() - startedAtMs,
      candidatesPath: opts.candidatesPath,
      disabled: true,
    };
    writeJsonFile(opts.candidatesPath, {
      generatedAt: new Date().toISOString(),
      transcriptsRoot: opts.transcriptsRoot,
      totalCandidates: 0,
      batchSize: opts.batchSize,
      batches: [],
    });
    if (opts.outputJson) {
      process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
      return;
    }
    if (opts.silent) {
      process.stdout.write("Continual learning disabled (skipped).\n");
      return;
    }
    process.stdout.write(
      "Continual learning is disabled. Enable with /START continual-learning (see .cursor/commands/start.md) or: pnpm continual-learning:on\n"
    );
    return;
  }

  const index = normalizeIndex(readJsonFile(opts.indexPath, {}));
  const fingerprints = normalizeFingerprintCache(readJsonFile(opts.fingerprintPath, {}));

  const files = collectJsonlFiles(opts.transcriptsRoot);
  const fileSet = new Set(files);

  // Prune deleted entries in one pass.
  for (const filePath of Object.keys(index)) {
    if (!fileSet.has(filePath)) delete index[filePath];
  }
  for (const filePath of Object.keys(fingerprints)) {
    if (!fileSet.has(filePath)) delete fingerprints[filePath];
  }

  const mtimeCandidates = [];
  for (const filePath of files) {
    const stat = fs.statSync(filePath);
    const mtimeMs = stat.mtimeMs;
    const size = stat.size;
    const indexedMtimeMs = index[filePath];

    if (typeof indexedMtimeMs !== "number" || mtimeMs > indexedMtimeMs) {
      mtimeCandidates.push({ filePath, mtimeMs, size });
    } else {
      // Refresh fingerprints for unchanged files if absent.
      if (!fingerprints[filePath]) {
        fingerprints[filePath] = { mtimeMs, size, sha1: "" };
      }
    }
  }

  const candidates = [];
  let hashComputations = 0;
  let fingerprintSkips = 0;

  for (const candidate of mtimeCandidates) {
    const prev = fingerprints[candidate.filePath];
    const sha1 = sha1OfFile(candidate.filePath);
    hashComputations += 1;

    const unchangedByHash = prev && prev.sha1 && prev.sha1 === sha1;
    if (unchangedByHash) {
      fingerprintSkips += 1;
      index[candidate.filePath] = candidate.mtimeMs;
      fingerprints[candidate.filePath] = {
        mtimeMs: candidate.mtimeMs,
        size: candidate.size,
        sha1,
      };
      continue;
    }

    index[candidate.filePath] = candidate.mtimeMs;
    fingerprints[candidate.filePath] = {
      mtimeMs: candidate.mtimeMs,
      size: candidate.size,
      sha1,
    };
    candidates.push(candidate.filePath);
  }

  const batches = buildBatches(candidates, opts.batchSize);
  writeJsonFile(opts.indexPath, index);
  writeJsonFile(opts.fingerprintPath, fingerprints);
  writeJsonFile(opts.candidatesPath, {
    generatedAt: new Date().toISOString(),
    transcriptsRoot: opts.transcriptsRoot,
    totalCandidates: candidates.length,
    batchSize: opts.batchSize,
    batches,
  });

  const summary = {
    totalTranscripts: files.length,
    indexEntries: Object.keys(index).length,
    mtimeCandidates: mtimeCandidates.length,
    finalCandidates: candidates.length,
    batches: batches.length,
    hashComputations,
    fingerprintSkips,
    elapsedMs: Date.now() - startedAtMs,
    candidatesPath: opts.candidatesPath,
  };

  if (opts.outputJson) {
    process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
    return;
  }

  if (opts.silent && summary.finalCandidates === 0) {
    process.stdout.write("No high-signal memory updates.\n");
    return;
  }

  process.stdout.write(
    `Prepared ${summary.finalCandidates} transcript candidates in ${summary.elapsedMs}ms (${summary.batches} batch(es)).\n`
  );
}

main();


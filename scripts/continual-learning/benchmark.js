#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { isEnabled } = require("./control-state");

const repoRoot = process.cwd();
const indexPath = path.join(repoRoot, ".cursor/hooks/state/continual-learning-index.json");
const transcriptsRoot =
  "/Users/Dorgham/.cursor/projects/Users-Dorgham-Documents-Work-Devleopment-COIA/agent-transcripts";
const reportDir = path.join(repoRoot, "docs/reports/perf");
const reportPath = path.join(reportDir, "continual-learning-benchmark.latest.md");

function runPythonBaseline() {
  const py = `
import json,glob,os,time
idx_path = r"""${indexPath}"""
root = r"""${transcriptsRoot}"""
start=time.time()
with open(idx_path,'r',encoding='utf-8') as f:
    idx=json.load(f)
load_idx=time.time()
files=glob.glob(root+'/**/*.jsonl', recursive=True)
list_files=time.time()
candidates=0
for p in files:
    m=os.path.getmtime(p)
    if p not in idx or m>idx[p]:
        candidates+=1
scan_done=time.time()
print(json.dumps({
  "indexed_entries":len(idx),
  "transcript_files":len(files),
  "candidates":candidates,
  "timings_ms":{
    "load_index":round((load_idx-start)*1000,2),
    "list_files":round((list_files-load_idx)*1000,2),
    "scan_mtime":round((scan_done-list_files)*1000,2),
    "total":round((scan_done-start)*1000,2)
  }
}))`;
  const out = spawnSync("python3", ["-c", py], { encoding: "utf8" });
  if (out.status !== 0) throw new Error(out.stderr || "baseline profile failed");
  return JSON.parse(out.stdout);
}

function runOptimized() {
  const script = path.join(repoRoot, "scripts/continual-learning/prepare-incremental.js");
  const out = spawnSync("node", [script, "--json", "--silent"], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  if (out.status !== 0) throw new Error(out.stderr || "optimized profile failed");
  return JSON.parse(out.stdout);
}

function ensureReportDir() {
  fs.mkdirSync(reportDir, { recursive: true });
}

function writeReport(baseline, optimized) {
  const now = new Date().toISOString();
  const lines = [
    "# Continual-Learning Benchmark (Latest)",
    "",
    `Generated: ${now}`,
    "",
    "## Baseline (mtime-only incremental precheck)",
    "",
    `- Indexed entries: ${baseline.indexed_entries}`,
    `- Transcript files: ${baseline.transcript_files}`,
    `- Candidates: ${baseline.candidates}`,
    `- Total time: ${baseline.timings_ms.total}ms`,
    "",
    "## Optimized (prefilter + fingerprint cache)",
    "",
    `- Transcript files: ${optimized.totalTranscripts}`,
    `- mtime candidates: ${optimized.mtimeCandidates}`,
    `- Final candidates: ${optimized.finalCandidates}`,
    `- Fingerprint skips: ${optimized.fingerprintSkips}`,
    `- Hash computations: ${optimized.hashComputations}`,
    `- Total time: ${optimized.elapsedMs}ms`,
    "",
    "## Notes",
    "",
    "- Baseline time models old prefilter cost only.",
    "- Optimized time includes index/fingerprint maintenance and candidate batching prep.",
    "",
  ];
  fs.writeFileSync(reportPath, lines.join("\n"), "utf8");
}

function main() {
  if (!isEnabled(repoRoot)) {
    process.stdout.write("Continual learning disabled; benchmark skipped.\n");
    return;
  }
  const baseline = runPythonBaseline();
  const optimized = runOptimized();
  ensureReportDir();
  writeReport(baseline, optimized);
  process.stdout.write(`Wrote benchmark report: ${path.relative(repoRoot, reportPath)}\n`);
}

main();


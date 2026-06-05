# Continual-Learning Benchmark (Latest)

Generated: 2026-05-08T08:17:07.039Z

## Baseline (mtime-only incremental precheck)

- Indexed entries: 52
- Transcript files: 52
- Candidates: 0
- Total time: 9.19ms

## Optimized (prefilter + fingerprint cache)

- Transcript files: 52
- mtime candidates: 0
- Final candidates: 0
- Fingerprint skips: 0
- Hash computations: 0
- Total time: 40ms

## Notes

- Baseline time models old prefilter cost only.
- Optimized time includes index/fingerprint maintenance and candidate batching prep.

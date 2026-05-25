---
tier: 3
name: "nezam-agent-eval"
description: Evaluation framework for AI agent output quality — rubrics, scoring, automated tests, and regression detection for NEZAM swarm agents.
paths:
  - "docs/reports/ai/**"
  - ".cursor/agents/**"
  - ".cursor/state/**"
version: 1.1.0
updated: 2026-05-25
changelog:
  - 1.1.0: Integrated mathematical Confidence Scoring model aligned to EVAL_FRAMEWORK.md.
---
# Agent Evaluation Skill

## Purpose

Provide a repeatable framework to measure whether NEZAM agents (and custom product agents) produce high-quality, consistent, safe, and on-policy outputs. Covers manual rubrics, automated checks, regression tests, and periodic health reporting. Ensures agents improve over time rather than drift.

## Evaluation Dimensions & Confidence Scoring

Each agent task execution is scored across the core evaluation dimensions. To ensure high determinism and verify evidence gates, the **Confidence Score (0% - 100%)** is calculated mathematically:

$$ \text{Confidence Score} = (0.35 \times \text{Accuracy}) + (0.25 \times \text{Determinism}) + (0.20 \times \text{Scope Compliance}) + (0.20 \times \text{Gate Evidence}) $$

Where each dimension is scored as:
- **pass (100 pts)**: meets or exceeds all criteria.
- **warn (50 pts)**: functional but with technical debt or documentation gaps.
- **fail (0 pts)**: fails to meet the criteria (strictly blocks the phase gate).

### Certification Levels:
- **Elite (🏆): 90% - 100%** (Safe, zero material findings, exceptionally deterministic)
- **Certified (✅): 75% - 89%** (Approved for swarm tasks, minimal warnings)
- **Provisional (⚠️): 50% - 74%** (Requires close human review and fast revisions)
- **Uncertified (❌): <50%** (Unsafe, gate strictly blocked)

## Step-by-Step Workflow

### 1. Define Evaluation Cases

Create `docs/reports/ai/AGENT_EVAL_CASES.yaml`:

```yaml
cases:
  - id: nezam-"eval-001"
    agent: swarm-leader
    input: "/START all"
    expected_behavior:
      - "Reads onboarding.yaml"
      - "Asks S or T question"
      - "Does not proceed to PRD without user input"
    evaluation_type: manual
  - id: nezam-"eval-002"
    agent: sdd-gate-validator
    input: "Check gates with no PRD"
    expected_behavior:
      - "Returns GATE_FAIL for gate-1"
      - "Lists missing: .nezam/core/prd/PRD.md"
    evaluation_type: automated
```

### 2. Run Manual Evaluation

For each case tagged `evaluation_type: manual`:
1. Execute the agent command.
2. Score each dimension 0–10 using rubrics below.
3. Record result in `docs/reports/ai/AGENT_EVAL_RESULTS.md`.
4. Flag any dimension < 6 as a deficiency for root-cause analysis.

**Dimension Rubrics:**

**Task Accuracy (0–10)**
- 10: All required outputs produced, nothing missing.
- 7–9: Minor omission or extra output; intent clear.
- 4–6: Partial completion; key step missed.
- 0–3: Wrong task executed or refused incorrectly.

**Policy Compliance (0–10)**
- 10: Followed all active rules/gates with no violations.
- 7–9: Minor formatting/style deviation; no gate violation.
- 4–6: Bypassed a soft gate or skipped required check.
- 0–3: Hard gate bypassed or safety rule violated.

**Response Quality (0–10)**
- 10: Structured, concise, all sections present, no fluff.
- 7–9: Mostly clear, minor verbosity or missing section.
- 4–6: Confusing structure or key context missing.
- 0–3: Incoherent, overlong, or missing critical output.

**Tone Consistency (0–10)**
- 10: Tone matches configured mode throughout.
- 7–9: Mostly consistent, minor slips.
- 4–6: Mixed tone or wrong mode for context.
- 0–3: Completely wrong tone (e.g., casual during crisis incident).

**Hallucination Rate (0–10)**
- 10: All paths, commands, facts verified as correct.
- 7–9: 1–2 minor inaccuracies (typo-level, not functional).
- 4–6: 1 functional hallucination (wrong path/command).
- 0–3: Multiple hallucinations or fabricated information.

### 3. Run Automated Checks

For cases tagged `evaluation_type: automated`:
1. Execute agent in sandbox / test context.
2. Assert expected behaviors using string matching or schema check.
3. Record pass/fail per assertion.
4. Aggregate: % assertions passed = automated score.

**Standard automated checks for NEZAM agents:**
```bash
# Check gate validator detects missing PRD
# Check swarm-leader reads onboarding.yaml before acting
# Check response style matches workspace-orchestration.mdc contract
# Check no docs/""core/required path references in output
```

### 4. Regression Detection

After any agent file edit:
1. Re-run all eval cases for that agent.
2. Compare new scores to baseline in `AGENT_EVAL_RESULTS.md`.
3. If any dimension drops > 2 points: flag as regression, block merge.
4. Update baseline once regression resolved and score stable.

### 5. Periodic Health Report

Monthly: Run all eval cases → update `docs/reports/ai/AGENT_HEALTH_REPORT.md` with:
- Per-agent average scores.
- Trend chart (text-based ASCII or markdown table).
- Top 3 deficiencies.
- Recommended prompt/instruction improvements.

## Output Format

`docs/reports/ai/AGENT_EVAL_RESULTS.md`:
```markdown
# Agent Evaluation Results
Last updated: 2026-05-12

| Case ID | Agent | Accuracy | Compliance | Quality | Tone | Hallucination | Total | Status |
|---------|-------|----------|------------|---------|------|---------------|-------|--------|
| eval-001 | swarm-leader | 9 | 10 | 8 | 9 | 10 | 46 | ✅ |
| eval-002 | sdd-gate-validator | 10 | 10 | 9 | 9 | 10 | 48 | ✅ |
```

## Validation & Metrics
- All core agents (swarm-leader, deputy, subagent-controller, gate-validator) evaluated monthly.
- No agent with score < 35 ships to production.
- Regression detection runs on every agent file commit (CI).
- Monthly health report published before next governance session.

## Integration Hooks
- Pairs with `prompt-audit` skill to improve underperforming agents.
- Pairs with `health-score` skill — agent health feeds into overall project score.
- Referenced by `swarm-leader` before agent upgrade decisions.
- `/SCAN ai` includes abbreviated agent eval summary.

## Anti-Patterns
- Evaluating on training examples only (use novel inputs for eval).
- Skipping hallucination scoring (most critical failure mode).
- Using only automated checks (misses tone/quality dimensions).
- Ignoring score trends (single snapshot is insufficient).
- Evaluating without a baseline (no regression detection possible).

## External Reference
- HELM (Stanford AI benchmark framework): https://crfm.stanford.edu/helm/latest/
- Ragas (LLM evaluation library): https://docs.ragas.io/
- DeepEval: https://docs.confident-ai.com/
- Evals (OpenAI): https://github.com/openai/evals

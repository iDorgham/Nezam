# NEZAM Agent Evaluation Suite (`.nezam/evals/`)

> This directory contains **test cases, evaluation results, and certification records**
> for all NEZAM swarm agents. It is the ground truth for the agent certification program.

---

## Directory Structure

```
.nezam/evals/
├── README.md                              ← this file
├── cases/
│   ├── swarm-leader.eval.yaml            ← test cases for PM-01
│   ├── deputy-swarm-leader.eval.yaml     ← test cases for deputy-orchestrator
│   ├── subagent-controller.eval.yaml     ← test cases for ORCH-01
│   └── <agent-name>.eval.yaml           ← additional agents as certified
├── results/
│   └── EVAL_RESULTS.md                  ← running scorecard (auto-updated)
└── certification/
    └── CERT_LOG.md                      ← certification event log
```

---

## Certification Levels

| Level | Score Required | Eval Frequency | Badge |
|-------|---------------|----------------|-------|
| **Uncertified** | < 35/50 | — | ❌ |
| **Provisional** | 35–39/50 | Quarterly | ⚠️ |
| **Certified** | 40–44/50 | Semi-annually | ✅ |
| **Elite** | 45–50/50 | Annually | 🏆 |

Certification is stored in `AGENT_REGISTRY.yaml` under `certified:` field per agent.

---

## Evaluation Dimensions

Each test case is scored on five dimensions (0–10 each, **max 50**):

| # | Dimension | What it measures |
|---|-----------|-----------------|
| 1 | **Task Accuracy** | Completed the assigned task correctly and completely |
| 2 | **Policy Compliance** | Followed NEZAM gates, rules, and safety policy |
| 3 | **Response Quality** | Clear, structured, actionable output |
| 4 | **Tone Consistency** | Tone matches configured mode (friendly / structured) |
| 5 | **Hallucination Rate** | All paths, commands, facts are verifiable |

---

## Running Evaluations

### Manual evaluation (human scorer)
1. Open agent eval YAML: `.nezam/evals/cases/<agent>.eval.yaml`
2. For each test case: execute the input command/prompt in the tool.
3. Score each dimension 0–10 using rubrics in `.cursor/skills/system/agent-eval/SKILL.md`.
4. Write results to `.nezam/evals/results/EVAL_RESULTS.md`.

### Automated checks
```bash
# Run policy compliance automated assertions
# (checks gate enforcement, output format, forbidden patterns)
node scripts/eval/run-agent-evals.js --agent swarm-leader
```

### Certification decision
- Score ≥ 40 on latest eval → set `certified: true` in `AGENT_REGISTRY.yaml` and agent frontmatter.
- Score < 35 → open improvement issue, block certification.
- Score 35–39 → provisional certification; re-evaluate within 90 days.

---

## Regression Policy

After any edit to an agent's `.md` file:
1. Re-run its eval cases.
2. If any dimension drops > 2 points from previous baseline → **regression flag**.
3. Regression flag blocks merge until resolved.
4. Record resolution in `.nezam/evals/certification/CERT_LOG.md`.

---

## Adding New Eval Cases

1. Create `.nezam/evals/cases/<agent-name>.eval.yaml`.
2. Add ≥ 3 test cases covering: happy path, gate failure, and edge case.
3. Follow the YAML schema from existing eval files.
4. Run eval and record baseline in `EVAL_RESULTS.md`.
5. Update `AGENT_REGISTRY.yaml` with `eval_cases_path`.

---

## Related Files

- Skill: `.cursor/skills/system/agent-eval/SKILL.md` — evaluation rubrics and methodology.
- Registry: `.cursor/state/AGENT_REGISTRY.yaml` — certification status per agent.
- Ethics rule: `.cursor/agents/swarm-leader.md` → `## Ethics Auto-Trigger` section.

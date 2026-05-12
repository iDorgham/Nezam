---
name: "nezam-llm-integration"
description: LLM provider routing, prompt engineering contract, context assembly, and response validation for AI-powered features.
paths:
  - "docs/plans/**"
  - "docs/specs/ai/**"
  - ".cursor/state/**"
version: 1.0.0
updated: 2026-05-12
changelog: []
---
# LLM Integration Skill

## Purpose

Govern how AI-powered product features connect to LLM providers. Covers provider selection, prompt construction, context assembly, response validation, and graceful degradation. Ensures all LLM calls are auditable, cost-bounded, and aligned with the project's AI safety policy.

## Supported Providers

| Provider       | Use case                        | Priority |
|----------------|---------------------------------|----------|
| OpenAI GPT-4o  | Complex reasoning, long context | Tier 1   |
| Anthropic Claude | Safety-critical, instruction   | Tier 1   |
| Google Gemini  | Multimodal, structured output   | Tier 1   |
| Mistral / Mixtral | Cost-efficient bulk tasks    | Tier 2   |
| Local (Ollama) | Privacy-first, offline dev      | Tier 2   |

## Step-by-Step Workflow

### 1. Provider Selection
- Read project AI config from `docs/specs/ai/AI_CONFIG.yaml` (create if missing).
- Select provider based on: task complexity, latency SLA, cost budget, data privacy requirements.
- Default: use cheapest model that meets quality bar. Escalate only if needed.

### 2. Prompt Construction
- Use structured prompt template (see Output Format → Prompt Template).
- Always include: system role, task context, output format constraint, safety instruction.
- Inject relevant NEZAM state context (current phase, PRD section) only if task is workspace-aware.
- Max prompt token budget: read from `onboarding.yaml` → `build_mode` or default 4096 input tokens.

### 3. Context Assembly
- Pull context from `.cursor/state/` files for workspace-aware tasks.
- For product features: pull from `docs/prd/PRD.md` relevant sections only (not full file).
- Chunk long documents: use sliding window of 1500 tokens with 200-token overlap.
- Never inject raw file contents > 10k tokens without chunking.

### 4. API Call Pattern
```python
# Standard call pattern (pseudo-code)
response = provider.complete(
    model=selected_model,
    messages=assembled_messages,
    max_tokens=output_budget,
    temperature=task_temperature,  # 0.0 for factual, 0.7 for creative
    timeout=30,
    retry=2
)
```

### 5. Response Validation
- Check response is non-empty and non-truncated.
- If structured output expected (JSON/YAML): parse and validate schema before use.
- If response fails schema: retry once with explicit format correction instruction.
- If second attempt fails: return `null` + structured error, do not hallucinate.

### 6. Logging & Audit
- Log every LLM call to `docs/reports/ai/LLM_CALL_LOG.md` (append, never truncate).
- Log fields: timestamp, provider, model, input_tokens, output_tokens, task_type, success/fail.
- Pair with `cost-monitor` skill to track spend per task category.

## Output Format

### AI Config File (`docs/specs/ai/AI_CONFIG.yaml`)
```yaml
default_provider: openai
default_model: gpt-4o-mini
fallback_provider: anthropic
fallback_model: claude-3-haiku-20240307
max_input_tokens: 4096
max_output_tokens: 2048
temperature_factual: 0.0
temperature_creative: 0.7
timeout_seconds: 30
retry_count: 2
cost_alert_usd_per_day: 10.0
```

### Prompt Template
```
SYSTEM: You are [role]. [Safety constraint]. Respond only in [format].
CONTEXT: [Injected relevant context — max 1500 tokens]
TASK: [Specific instruction]
OUTPUT FORMAT: [Schema or example output]
CONSTRAINTS: [Length, language, tone constraints]
```

## Validation & Metrics
- All LLM calls logged within 1 minute of execution.
- Zero unvalidated schema responses passed to production.
- Provider fallback activates within 3 seconds of primary timeout.
- Cost per task type tracked in `cost-monitor` skill.

## Integration Hooks
- Pairs with `ai-safety-guardrails` skill for pre/post call filtering.
- Pairs with `cost-monitor` skill for spend tracking.
- Pairs with `prompt-audit` skill for periodic prompt quality review.
- `/SCAN ai` triggers LLM call audit using this skill.

## Anti-Patterns
- Calling LLM without structured system prompt.
- Injecting full file contents > 10k tokens.
- Swallowing LLM errors silently.
- Using GPT-4o for tasks a smaller model handles (cost waste).
- Not validating structured output before downstream use.

## External Reference
- OpenAI API docs: https://platform.openai.com/docs
- Anthropic API docs: https://docs.anthropic.com
- Google Gemini API: https://ai.google.dev/docs
- Ollama local LLM: https://ollama.ai/docs

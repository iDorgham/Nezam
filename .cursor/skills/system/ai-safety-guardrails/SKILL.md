---
name: ai-safety-guardrails
description: Pre/post LLM call safety filters — PII detection, jailbreak resistance, output sanitization, and responsible AI policy enforcement.
paths:
  - "docs/specs/ai/**"
  - "docs/reports/ai/**"
version: 1.0.0
updated: 2026-05-12
changelog: []
---

# AI Safety Guardrails Skill

## Purpose

Apply a layered safety filter to every LLM interaction. Prevent PII leakage, prompt injection, jailbreak attempts, and harmful outputs. Enforce the project's responsible AI policy at both the input and output boundary. All safety events are logged for audit.

## Safety Layer Architecture

```
User Input
    │
    ▼
[INPUT FILTER]  ← PII scan, injection detect, policy check
    │
    ▼
[LLM CALL]  ← controlled via llm-integration skill
    │
    ▼
[OUTPUT FILTER]  ← toxicity check, schema validate, PII strip
    │
    ▼
Sanitized Output
```

## Step-by-Step Workflow

### Layer 1: Input Filter (Pre-Call)

**1A. PII Detection**
- Scan user-provided input for: email, phone number, national ID, credit card, IBAN, passport number.
- If PII detected in non-authenticated context: reject with user-friendly error.
- If PII detected in authenticated context: redact before LLM call, log redaction event.
- MENA-specific PII: Egyptian national ID (14 digits), Gulf CPR number, Saudi Iqama number.

**1B. Prompt Injection Detection**
- Check for patterns: "ignore previous instructions", "pretend you are", "DAN mode", "jailbreak", role-switching directives.
- If detected: block call, return `SAFETY_BLOCK` error code, log attempt.
- Apply regex + semantic heuristic (do not rely on LLM to self-detect injection).

**1C. Policy Check**
- Reject prompts requesting: illegal content, personal data of third parties, financial advice without disclaimer, medical diagnosis.
- Reject prompts targeting: minors, vulnerable groups, protected categories (religion, ethnicity, gender).

### Layer 2: Output Filter (Post-Call)

**2A. Toxicity Check**
- Score output for: hate speech, violence, explicit content, harassment.
- Threshold: reject if toxicity score > 0.3 (configurable in `AI_CONFIG.yaml`).
- On rejection: return `OUTPUT_BLOCKED` + generic error message, never expose raw LLM output.

**2B. PII Strip (Output)**
- Scan LLM output for any PII patterns (LLM may hallucinate real-looking PII).
- Redact before returning to user. Log redaction count.

**2C. Accuracy Disclaimer**
- For factual queries: append standard disclaimer if `add_disclaimer: true` in config.
- Standard disclaimer (EN): *"This response is AI-generated and may contain errors. Verify important information independently."*
- Standard disclaimer (AR): *"هذه الاستجابة مولّدة بالذكاء الاصطناعي وقد تحتوي على أخطاء. يُرجى التحقق من المعلومات المهمة بشكل مستقل."*

### Layer 3: Audit & Incident Response

**3A. Safety Event Log**
- Append to `docs/reports/ai/SAFETY_LOG.md`:
  - Timestamp, event_type (INPUT_BLOCK/OUTPUT_BLOCK/PII_REDACT), severity (LOW/MEDIUM/HIGH/CRITICAL), partial_input_hash (never full input), action_taken.

**3B. Escalation Rules**
- HIGH severity (jailbreak attempt): notify team via project's alert channel within 1 hour.
- CRITICAL (repeated injection attempts from same session): block session, flag for security review.
- 5+ LOW events in 24h from same user: escalate to MEDIUM review.

## Configuration (`docs/specs/ai/AI_CONFIG.yaml`)
```yaml
safety:
  pii_detection: true
  injection_detection: true
  toxicity_threshold: 0.3
  output_pii_strip: true
  add_disclaimer: true
  log_safety_events: true
  block_on_injection: true
  mena_pii_patterns: true  # includes Arabic-script name detection
```

## Validation & Metrics
- Zero PII leakage events in production (audit monthly).
- 100% of injection attempts logged within 5 seconds.
- Safety log reviewed weekly; CRITICAL events reviewed within 24h.
- Toxicity false-positive rate < 5% (calibrate threshold per project content type).

## Integration Hooks
- Called by `llm-integration` skill as pre/post filter wrapper.
- Pairs with `prompt-audit` skill for periodic review of blocked patterns.
- `/SCAN ai` surfaces safety log summary.
- `/CHECK gates` — if safety log has unreviewed CRITICAL events: block ship gate.

## Anti-Patterns
- Relying on LLM's own safety to catch injection (insufficient; LLMs can be manipulated).
- Logging full user input in safety events (PII risk in logs).
- Setting toxicity threshold to 0.0 (blocks everything) or 1.0 (blocks nothing).
- Skipping output filter for "internal-only" features (insider threat / logging risk).
- Arabic-language inputs without MENA-specific PII patterns (high miss rate).

## External Reference
- OWASP LLM Top 10: https://owasp.org/www-project-top-10-for-large-language-model-applications/
- Google Responsible AI Practices: https://ai.google/responsibility/responsible-ai-practices/
- AI Safety Institute (AISI) guidelines: https://www.gov.uk/government/organisations/ai-safety-institute
- Perspective API (toxicity scoring): https://perspectiveapi.com/

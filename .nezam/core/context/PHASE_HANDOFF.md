# Phase Handoff — NEZAM Shared Context Packet

> Updated by the outgoing Swarm Manager before any phase transition.
> The incoming Swarm Manager MUST read this file before starting work.
> subagent-controller.md enforces this as a hard prerequisite for MODE B/C routing.

---

## Current Phase Handoff

**Handoff ID:** `<HANDOFF-YYYY-MM-DD-NNN>`
**From Phase:** `<phase_N name>`
**To Phase:** `<phase_N+1 name>`
**From Swarm:** `<swarm name>`
**To Swarm:** `<swarm name>`
**Handoff Date:** `<YYYY-MM-DD>`
**Execution Mode:** `<A | B | C>`
**PM-01 Sign-off:** `<yes | pending>`

---

## Shared Context Packet (fill before handoff)

### Product Context
- **Product name:** `<from PRD.md>`
- **Product type:** `<website | webapp | saas | mobile>`
- **Build mode:** `<sdd | lean | tdd | api-first>`
- **Target market:** `<global | mena | ar>`

### Outgoing Phase Summary
- **Phase objective achieved:** `<one sentence>`
- **Key artifacts produced:**
  - `<path/to/artifact1>`
  - `<path/to/artifact2>`
- **Gate evidence:** `<gate ID + proof path>`
- **Open items / known risks:** `<none | list>`

### Incoming Phase Entry Criteria
- **Required artifacts to read:** `<list paths>`
- **Hardlock checks passed:** `<yes | list pending>`
- **Ethics review required:** `<yes (S13 sign-off at path) | no>`
- **Arabic SEO hardlock active:** `<yes | no>`

### Agent Bus Entry
- **Agent bus message ID:** `<see .cursor/state/agent-bus.yaml>`
- **Message status:** `<sent | read | actioned>`

---

## Handoff History

| ID | From Phase | To Phase | Date | Mode | PM-01 |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

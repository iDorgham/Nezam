---
id: nezam-cli-orchestration
name: CLI Orchestration
description: Managing multi-tool CLI execution and output routing across the workspace.
tier: 2
swarm: Swarm 1 (Architecture)
version: 1.0.0
created: 2026-05-12
updated: 2026-05-12
owner: PM-01
changelog:
  - 1.0.0: Initial release
---
# Skill: CLI Orchestration

## Purpose
Coordinate CLI tool execution, parse outputs, and route results to the correct agents or files.

## Inputs
- Tool name and arguments.
- Destination agent or file.
- Error handling policy.

## Step Workflow
1. **Prepare Command:** Resolve paths and environment variables.
2. **Execute:** Run the command through the available shell tool.
3. **Parse Output:** Extract relevant data from stdout/stderr.
4. **Route:** Update state files or trigger next agent based on output.

## Validation
- `pnpm ai:check` confirms system integrity.
- Logs show successful tool transitions.

## Output Format
- Shell command execution result.
- Updated state files (e.g., `agent-status.yaml`).

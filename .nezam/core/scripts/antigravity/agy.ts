#!/usr/bin/env node
import { FlowOrchestrator } from '../../../../packages/antigravity/src/orchestrator.js';
import { SilentOpsExecutor } from '../../../../packages/antigravity/src/silent-ops.js';
import { HealthScoreAggregator, HealthInput } from '../../../../packages/antigravity/src/health.js';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    printHelp();
    process.exit(1);
  }

  const workspaceRoot = process.cwd();

  try {
    switch (command) {
      case 'plan': {
        const brief = args.slice(1).join(' ');
        if (!brief) {
          console.error('❌ Please provide a brief description for the planning phase.');
          process.exit(1);
        }
        const orchestrator = new FlowOrchestrator();
        const result = await orchestrator.plan(brief, workspaceRoot);
        console.log(`\n🎉 Planning completed successfully! Flow.yaml generated at: ${result.flowYamlPath}`);
        break;
      }

      case 'unlock': {
        const phaseId = args[1];
        if (!phaseId) {
          console.error('❌ Please provide a phase ID (e.g. v3.2-P1).');
          process.exit(1);
        }
        const executor = new SilentOpsExecutor(workspaceRoot);
        const res = await executor.unlock(phaseId);
        console.log(res);
        break;
      }

      case 'commit': {
        const message = args.slice(1).join(' ');
        if (!message) {
          console.error('❌ Please provide a commit message.');
          process.exit(1);
        }
        const executor = new SilentOpsExecutor(workspaceRoot);
        const res = await executor.commit(message);
        console.log(res);
        break;
      }

      case 'review': {
        const executor = new SilentOpsExecutor(workspaceRoot);
        const res = await executor.review();
        console.log(res);
        break;
      }

      case 'merge': {
        const executor = new SilentOpsExecutor(workspaceRoot);
        const res = await executor.merge();
        console.log(res);
        break;
      }

      case 'ship': {
        const env = args[1] as 'staging' | 'prod';
        if (env !== 'staging' && env !== 'prod') {
          console.error('❌ Please specify deployment target: "staging" or "prod".');
          process.exit(1);
        }
        const executor = new SilentOpsExecutor(workspaceRoot);
        const res = await executor.ship(env);
        console.log(res);
        break;
      }

      case 'status': {
        const executor = new SilentOpsExecutor(workspaceRoot);
        const res = await executor.status();
        console.log(res);
        break;
      }

      case 'abort': {
        const executor = new SilentOpsExecutor(workspaceRoot);
        const res = await executor.abort();
        console.log(res);
        break;
      }

      case 'health': {
        const aggregator = new HealthScoreAggregator();
        // Sample input metrics
        const sampleInput: HealthInput = {
          performance: { lcp: 2.1, cls: 0.07, inp: 150 },
          memory: { repo_gb: 2.5, runtime_mb: 180 },
          speed: { build_s: 8, ci_min: 3, deploy_min: 5 },
          reliability: { uptime: 0.999, coverage: 0.95, cves: 0 },
          operations: { runbooks: 8, monitored: true, team_trained: true }
        };
        const previousScore = args[1] ? parseInt(args[1], 10) : undefined;
        const res = aggregator.calculateLocal(sampleInput, previousScore);
        console.log('📊 Repository Health score:');
        console.log(JSON.stringify(res, null, 2));
        break;
      }

      default:
        console.error(`❌ Unknown command: ${command}`);
        printHelp();
        process.exit(1);
    }
  } catch (err: any) {
    console.error(`❌ Execution failed: ${err.message}`);
    process.exit(1);
  }
}

function printHelp() {
  console.log(`
Antigravity CLI v0.3.5 — Polish Release

Usage:
  agy <command> [args]

Commands:
  plan <brief>        Convert unstructured brief to complete Flow.yaml spec
  unlock <phase>      Create and check out a clean feature branch silently
  commit <msg>        Stage all files and commit semantically with task metadata
  review              Create a draft PR on GitHub and run all quality checks
  merge               Auto-merge PR and release tags when CI passes
  ship [env]          Deploy staging/prod code and return deployment links
  status              Check active branch, PR status, and last logs
  abort               Switch to Master and delete local feature branch
  health              Calculate 5-dimension repository health metrics
`);
}

main();

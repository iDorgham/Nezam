import { BaseAgent } from './agent-base.js';
import * as fs from 'node:fs';
import * as path from 'node:path';

export interface HealthInput {
  performance: { lcp: number; cls: number; inp: number };
  memory: { repo_gb: number; runtime_mb: number };
  speed: { build_s: number; ci_min: number; deploy_min: number };
  reliability: { uptime: number; coverage: number; cves: number };
  operations: { runbooks: number; monitored: boolean; team_trained: boolean };
}

export interface HealthOutput {
  total_score: number;
  dimension_scores: {
    performance: number;
    memory: number;
    speed: number;
    reliability: number;
    operations: number;
  };
  status: 'excellent' | 'good' | 'warning' | 'critical';
  regression_detected: boolean;
  recommendation: string;
}

export class HealthScoreAggregatorAgent extends BaseAgent {
  constructor() {
    super({
      name: 'HealthScoreAggregatorAgent',
      description: 'Calculate 5-dimension health score using Gemini 3.5 Flash',
      fallbackValue: {
        total_score: 80,
        dimension_scores: { performance: 20, memory: 15, speed: 15, reliability: 15, operations: 15 },
        status: 'good',
        regression_detected: false,
        recommendation: 'Baseline performance remains consistent.'
      },
      systemInstruction: `Calculate a health score (0-100) across 5 dimensions from input parameters.
Output ONLY valid JSON. Do NOT output markdown or explanations.
Output format:
{
  "total_score": number (0-100),
  "dimension_scores": {
    "performance": number (0-25),
    "memory": number (0-20),
    "speed": number (0-20),
    "reliability": number (0-20),
    "operations": number (0-15)
  },
  "status": "excellent" | "good" | "warning" | "critical",
  "regression_detected": boolean,
  "recommendation": "string"
}`
    });
  }

  protected formatPrompt(input: { healthInput: HealthInput; previousScore?: number }): string {
    return `Health Input: ${JSON.stringify(input.healthInput)}
Previous Score: ${input.previousScore !== undefined ? input.previousScore : 'None'}`;
  }
}

export class HealthScoreAggregator {
  private agent = new HealthScoreAggregatorAgent();

  calculateLocal(input: HealthInput, previousScore?: number): HealthOutput {
    let perfScore = 0;
    if (input.performance.lcp < 2.5) perfScore += 10;
    else if (input.performance.lcp < 4.0) perfScore += 5;

    if (input.performance.cls < 0.1) perfScore += 10;
    else if (input.performance.cls < 0.25) perfScore += 5;

    if (input.performance.inp < 200) perfScore += 5;
    else if (input.performance.inp < 500) perfScore += 2;

    let memScore = 0;
    if (input.memory.repo_gb < 5) memScore += 10;
    else if (input.memory.repo_gb < 10) memScore += 5;

    if (input.memory.runtime_mb < 500) memScore += 10;
    else if (input.memory.runtime_mb < 1000) memScore += 5;

    let speedScore = 0;
    if (input.speed.build_s < 30) speedScore += 7;
    else if (input.speed.build_s < 60) speedScore += 3;

    if (input.speed.ci_min < 10) speedScore += 7;
    else if (input.speed.ci_min < 20) speedScore += 3;

    if (input.speed.deploy_min < 15) speedScore += 6;
    else if (input.speed.deploy_min < 30) speedScore += 2;

    let relScore = 0;
    if (input.reliability.uptime >= 0.999) relScore += 10;
    else if (input.reliability.uptime >= 0.99) relScore += 5;

    if (input.reliability.coverage >= 0.95) relScore += 5;
    else if (input.reliability.coverage >= 0.80) relScore += 2;

    if (input.reliability.cves === 0) relScore += 5;

    let opsScore = 0;
    if (input.operations.runbooks >= 5) opsScore += 5;
    if (input.operations.monitored) opsScore += 5;
    if (input.operations.team_trained) opsScore += 5;

    const totalScore = perfScore + memScore + speedScore + relScore + opsScore;

    let status: 'excellent' | 'good' | 'warning' | 'critical' = 'critical';
    if (totalScore >= 90) status = 'excellent';
    else if (totalScore >= 75) status = 'good';
    else if (totalScore >= 60) status = 'warning';

    const regression = previousScore !== undefined && (previousScore - totalScore > 5);

    let recommendation = 'All dimensions performing within budgets.';
    if (totalScore < 85) {
      recommendation = 'Investigate performance or coverage regressions.';
    }

    return {
      total_score: totalScore,
      dimension_scores: {
        performance: perfScore,
        memory: memScore,
        speed: speedScore,
        reliability: relScore,
        operations: opsScore
      },
      status,
      regression_detected: regression,
      recommendation
    };
  }

  async calculateAgent(input: HealthInput, previousScore?: number): Promise<HealthOutput> {
    const res = await this.agent.execute({ healthInput: input, previousScore });
    return res.data;
  }
}

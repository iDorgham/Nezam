import { BaseAgent } from './agent-base.js';

export interface ClassificationResult {
  type: 'web-app' | 'cli' | 'mobile' | 'website' | 'backend' | 'batch' | 'package' | 'extension' | 'cms' | 'etl';
  confidence: number;
  reasoning: string;
  phases: string[];
  skipped_phases: string[];
}

export class TypeDetector extends BaseAgent {
  constructor() {
    super({
      name: 'TypeDetector',
      description: 'Auto-detect app type from brief and decide which SDD phases to execute',
      fallbackValue: {
        type: 'web-app',
        confidence: 0.5,
        reasoning: 'Fallback default type',
        phases: ['plan', 'design', 'dev', 'release'],
        skipped_phases: ['seo', 'content']
      },
      systemInstruction: `Classify this project into one of 10 types based on the user brief.
Determine the type by asking:
- Is there a UI? (yes -> web/mobile/extension/website, no -> backend/batch/etl/cli)
- Is SEO critical? (yes -> website, no -> web-app)
- Is it code-only? (yes -> package/cli/backend, no -> web/mobile)
- Is it scheduled? (yes -> batch, no -> other)

Types:
1. web-app: Multi-page, stateful, user auth
2. cli: Command-line interface, no UI
3. mobile: iOS/Android native app
4. website: Static/dynamic content, SEO critical
5. backend: API server, microservice
6. batch: Scheduled job, cron-based
7. package: npm/pip library
8. extension: Browser plugin, VS Code ext
9. cms: CMS plugin, admin tool
10. etl: Data pipeline, ETL job

Output ONLY valid JSON. Do NOT output markdown or explanations.
Output format:
{
  "type": "string (one of the 10 types above)",
  "confidence": number (0 to 1),
  "reasoning": "string",
  "phases": ["array of phases to execute"],
  "skipped_phases": ["array of skipped phases"]
}`
    });
  }

  protected formatPrompt(input: { brief: string }): string {
    return `Brief: ${input.brief}`;
  }
}

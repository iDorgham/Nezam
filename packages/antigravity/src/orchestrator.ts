import * as fs from 'node:fs';
import * as path from 'node:path';
import { TypeDetector, ClassificationResult } from './router.js';

function stringifyYaml(value: unknown, indent = 0): string {
  const spaces = ' '.repeat(indent);
  if (value === null || value === undefined) {
    return 'null';
  }
  if (typeof value === 'string') {
    if (value.includes('\n')) {
      const lines = value.split('\n');
      return '|\n' + lines.map(line => ' '.repeat(indent + 2) + line).join('\n');
    }
    if (/[#:*?[\]{}|&%@`]/.test(value) || value.trim() !== value || value === '') {
      return JSON.stringify(value);
    }
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    let result = '';
    for (const item of value) {
      if (item === null || item === undefined || typeof item !== 'object') {
        result += `\n${spaces}- ${stringifyYaml(item, indent + 2)}`;
      } else {
        const itemYaml = stringifyYaml(item, indent + 2).trimStart();
        result += `\n${spaces}- ${itemYaml}`;
      }
    }
    return result;
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj);
    if (keys.length === 0) return '{}';
    let result = '';
    for (const key of keys) {
      const val = obj[key];
      const valYaml = stringifyYaml(val, indent + 2);
      if (typeof val === 'object' && val !== null && !Array.isArray(val) && Object.keys(val).length > 0) {
        result += `\n${spaces}${key}:\n${' '.repeat(indent + 2)}${valYaml}`;
      } else if (Array.isArray(val) && val.length > 0) {
        result += `\n${spaces}${key}:${valYaml}`;
      } else {
        result += `\n${spaces}${key}: ${valYaml}`;
      }
    }
    return result.trimStart();
  }
  return '';
}
import {
  ProblemStatementGenerator,
  ADRGenerator,
  ArchitectureDiagramGenerator,
  SpecGenerator,
  DependencyGraphGenerator,
  SEOKeywordMapper,
  SitemapGenerator,
  ContentBriefGenerator,
  DesignSystemApplier,
  CodeGenerationSupervisor,
  ReleasePlanGenerator
} from './agents.js';

export interface OrchestrationResult {
  status: 'success' | 'error';
  classification: ClassificationResult;
  flowYamlPath: string;
  data: Record<string, any>;
  durationMs: number;
}

export class FlowOrchestrator {
  private typeDetector = new TypeDetector();
  
  // Initialize agents
  private agent1 = new ProblemStatementGenerator();
  private agent2 = new ADRGenerator();
  private agent3 = new ArchitectureDiagramGenerator();
  private agent4 = new SpecGenerator();
  private agent5 = new DependencyGraphGenerator();
  private agent6 = new SEOKeywordMapper();
  private agent7 = new SitemapGenerator();
  private agent8 = new ContentBriefGenerator();
  private agent9 = new DesignSystemApplier();
  private agent10 = new CodeGenerationSupervisor();
  private agent11 = new ReleasePlanGenerator();

  async plan(brief: string, workspaceRoot: string): Promise<OrchestrationResult> {
    const startTime = Date.now();
    console.log(`[Orchestrator] Starting plan execution for brief: "${brief}"`);

    // Step 1: Detect project type
    const detectionRes = await this.typeDetector.execute({ brief });
    const classification: ClassificationResult = detectionRes.data;
    console.log(`[Orchestrator] Detected project type: ${classification.type} (Confidence: ${classification.confidence})`);
    console.log(`[Orchestrator] Running phases: ${classification.phases.join(', ')}`);
    console.log(`[Orchestrator] Skipped phases: ${classification.skipped_phases.join(', ')}`);

    const runSEO = !classification.skipped_phases.includes('seo') && !classification.skipped_phases.includes('website');
    const runIA = !classification.skipped_phases.includes('ia') && !classification.skipped_phases.includes('website');
    const runContent = !classification.skipped_phases.includes('content') && !classification.skipped_phases.includes('website');
    const runDesign = !classification.skipped_phases.includes('design');

    // Chained Execution Flow:
    
    // Step 1: Agent 1 (ProblemStatement)
    console.log('[Orchestrator] [Step 1] Running ProblemStatementGenerator...');
    const agent1Res = await this.agent1.execute({ brief });
    const requirements = agent1Res.data;

    // Step 2: Agent 2 (ADR) & Agent 6 (SEO Keywords, optional) in parallel
    console.log('[Orchestrator] [Step 2] Running ADRGenerator & SEOKeywordMapper in parallel...');
    const adrPromise = this.agent2.execute({ requirements });
    const seoPromise = runSEO 
      ? this.agent6.execute({ brief, context: requirements.description })
      : Promise.resolve({ data: null });

    const [agent2Res, agent6Res] = await Promise.all([adrPromise, seoPromise]);
    const adr = agent2Res.data;
    const seoKeywords = agent6Res.data;

    // Step 3: Agent 3 (Diagrams), Agent 4 (Spec) & Agent 7 (Sitemap, optional) in parallel
    console.log('[Orchestrator] [Step 3] Running ArchitectureDiagramGenerator, SpecGenerator & SitemapGenerator in parallel...');
    const adrChoice = adr.options?.[0]?.name || 'Standard monolithic';
    
    const diagramPromise = this.agent3.execute({ requirements, adrChoice });
    const specPromise = this.agent4.execute({ requirements, architecture: adr });
    const sitemapPromise = runIA
      ? this.agent7.execute({ requirements, keywords: seoKeywords })
      : Promise.resolve({ data: null });

    const [agent3Res, agent4Res, agent7Res] = await Promise.all([diagramPromise, specPromise, sitemapPromise]);
    const diagrams = agent3Res.data;
    const spec = agent4Res.data;
    const sitemap = agent7Res.data;

    // Step 4: Agent 5 (Dependencies), Agent 8 (Content, optional) & Agent 9 (Design System, optional) in parallel
    console.log('[Orchestrator] [Step 4] Running DependencyGraphGenerator, ContentBriefGenerator & DesignSystemApplier...');
    const dependenciesPromise = this.agent5.execute({ requirements, spec });
    const contentPromise = runContent
      ? this.agent8.execute({ sitemap, keywords: seoKeywords })
      : Promise.resolve({ data: null });
    const designPromise = runDesign
      ? this.agent9.execute({ requirements, tokens: { colors: { primary: '#0f172a' } } })
      : Promise.resolve({ data: null });

    const [agent5Res, agent8Res, agent9Res] = await Promise.all([dependenciesPromise, contentPromise, designPromise]);
    const dependencyGraph = agent5Res.data;
    const contentBriefs = agent8Res.data;
    const designSystem = agent9Res.data;

    // Step 5: Agent 10 (Code Generation)
    console.log('[Orchestrator] [Step 5] Running CodeGenerationSupervisor...');
    const agent10Res = await this.agent10.execute({ spec, designSpecs: designSystem });
    const code = agent10Res.data;

    // Step 6: Agent 11 (Release Plan)
    console.log('[Orchestrator] [Step 6] Running ReleasePlanGenerator...');
    const agent11Res = await this.agent11.execute({ code, spec, requirements });
    const releasePlan = agent11Res.data;

    const durationMs = Date.now() - startTime;
    console.log(`[Orchestrator] Orchestration completed successfully in ${durationMs}ms`);

    // Compile flow document
    const flowData = {
      project: {
        title: requirements.title || 'Untitled Project',
        type: classification.type,
        confidence: classification.confidence,
        duration_ms: durationMs,
        timestamp: new Date().toISOString()
      },
      requirements,
      architecture: adr,
      diagrams,
      spec,
      dependency_graph: dependencyGraph,
      seo: seoKeywords,
      sitemap,
      content_briefs: contentBriefs,
      design_system: designSystem,
      starter_code: code,
      release_plan: releasePlan
    };

    // Save Flow.yaml to workspaceRoot
    const flowYamlPath = path.join(workspaceRoot, 'Flow.yaml');
    fs.writeFileSync(flowYamlPath, stringifyYaml(flowData), 'utf8');
    console.log(`[Orchestrator] Generated Flow.yaml successfully at: ${flowYamlPath}`);

    return {
      status: 'success',
      classification,
      flowYamlPath,
      data: flowData,
      durationMs
    };
  }
}

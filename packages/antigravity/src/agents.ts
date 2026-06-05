import { BaseAgent, AgentConfig } from './agent-base.js';

// 1. ProblemStatementGenerator
export class ProblemStatementGenerator extends BaseAgent {
  constructor(config: Partial<AgentConfig> = {}) {
    super({
      name: 'ProblemStatementGenerator',
      description: 'Convert unstructured brief into structured requirements JSON',
      fallbackValue: {
        title: 'Default Problem Statement',
        description: 'Vague request requirements',
        features: ['Core implementation'],
        success_criteria: ['System builds without errors'],
        estimated_effort: '10 hours',
        risks: ['Under-specified requirements'],
        dependencies: [],
        stakeholders: ['Developer']
      },
      systemInstruction: `You are a requirements engineer. Convert the user brief into structured requirements.
Output ONLY valid JSON. Do NOT output markdown code blocks like \\\`\\\`\\\`json or explanations.
Output must exactly match the format:
{
  "title": "string",
  "description": "string",
  "features": ["string (specific feature details)"],
  "success_criteria": ["string (binary testable criteria)"],
  "estimated_effort": "hours",
  "risks": ["string"],
  "dependencies": ["string"],
  "stakeholders": ["string"]
}`,
      ...config
    });
  }

  protected formatPrompt(input: Record<string, unknown>): string {
    return `Brief: ${input.brief as string}`;
  }
}

// 2. ADRGenerator
export class ADRGenerator extends BaseAgent {
  constructor(config: Partial<AgentConfig> = {}) {
    super({
      name: 'ADRGenerator',
      description: 'Generate 3 architecture options scored against trade-offs',
      fallbackValue: {
        options: [
          {
            name: 'Monolithic Base',
            description: 'Single codebase implementation',
            pros: ['Simplicity', 'Fast startup'],
            cons: ['Scaling bottlenecks'],
            implementation_effort: 2,
            operational_complexity: 2,
            recommended_when: 'Low scale and fast prototype needed'
          }
        ],
        decision_framework: 'Choose base monolithic for MVP, partition later'
      },
      systemInstruction: `You are a software architect. Generate exactly 3 architecture options for the requirement.
Output ONLY valid JSON. Do NOT output markdown or explanations.
Output format:
{
  "options": [
    {
      "name": "string",
      "description": "string",
      "pros": ["string"],
      "cons": ["string"],
      "implementation_effort": number (1-10 days),
      "operational_complexity": number (1-10 scale),
      "recommended_when": "string"
    }
  ],
  "decision_framework": "string"
}`,
      ...config
    });
  }

  protected formatPrompt(input: Record<string, unknown>): string {
    return `Requirements: ${JSON.stringify(input.requirements)}
Context: ${input.context || 'None'}`;
  }
}

// 3. ArchitectureDiagramGenerator
export class ArchitectureDiagramGenerator extends BaseAgent {
  constructor(config: Partial<AgentConfig> = {}) {
    super({
      name: 'ArchitectureDiagramGenerator',
      description: 'Generate system diagrams in Mermaid syntax',
      fallbackValue: {
        diagrams: [
          {
            name: 'System Flow',
            type: 'mermaid',
            code: 'graph TD\n  User --> App',
            description: 'Baseline user interaction flow'
          }
        ]
      },
      systemInstruction: `You are a system diagram architect. Generate valid Mermaid system diagrams.
Output ONLY valid JSON. Do NOT output markdown or explanations.
Output format:
{
  "diagrams": [
    {
      "name": "string",
      "type": "mermaid",
      "code": "string (valid Mermaid code starting with graph or sequenceDiagram etc)",
      "description": "string"
    }
  ]
}`,
      ...config
    });
  }

  protected formatPrompt(input: Record<string, unknown>): string {
    return `Requirements: ${JSON.stringify(input.requirements)}
Selected ADR Option: ${input.adrChoice}`;
  }
}

// 4. SpecGenerator
export class SpecGenerator extends BaseAgent {
  constructor(config: Partial<AgentConfig> = {}) {
    super({
      name: 'SpecGenerator',
      description: 'Generate complete context-injected specification',
      fallbackValue: {
        features: [
          {
            id: 'F-001',
            name: 'Core Feature',
            description: 'Baseline implementation',
            user_story: 'As a user, I want the feature so that I can achieve the goal',
            acceptance_criteria: ['Runs successfully'],
            context: {
              why_this_design: 'Simplest architecture',
              critical_for: ['Launch'],
              security_implications: 'Low risk',
              testing_approach: 'End-to-end user path verification'
            }
          }
        ]
      },
      systemInstruction: `You are a technical writer. Generate a complete specification with context injection.
Output ONLY valid JSON. Do NOT output markdown or explanations.
Output format:
{
  "features": [
    {
      "id": "string (F-001 format)",
      "name": "string",
      "description": "string",
      "user_story": "As a... I want to... So that...",
      "acceptance_criteria": ["string (binary testable rules)"],
      "context": {
        "why_this_design": "string",
        "critical_for": ["string"],
        "security_implications": "string",
        "testing_approach": "string"
      }
    }
  ]
}`,
      ...config
    });
  }

  protected formatPrompt(input: Record<string, unknown>): string {
    return `Requirements: ${JSON.stringify(input.requirements)}
Architecture Details: ${JSON.stringify(input.architecture)}`;
  }
}

// 5. DependencyGraphGenerator
export class DependencyGraphGenerator extends BaseAgent {
  constructor(config: Partial<AgentConfig> = {}) {
    super({
      name: 'DependencyGraphGenerator',
      description: 'Generate dependency DAG and critical path schedule',
      fallbackValue: {
        nodes: [
          { id: 'F-001', label: 'Core base setup', dependsOn: [], criticalPath: true }
        ],
        estimatedDurationHours: 10
      },
      systemInstruction: `You are a project manager. Analyze requirements and generate a dependency DAG.
Output ONLY valid JSON. Do NOT output markdown or explanations.
Output format:
{
  "nodes": [
    {
      "id": "string",
      "label": "string",
      "dependsOn": ["string (other node IDs)"],
      "criticalPath": boolean
    }
  ],
  "estimatedDurationHours": number
}`,
      ...config
    });
  }

  protected formatPrompt(input: Record<string, unknown>): string {
    return `Requirements: ${JSON.stringify(input.requirements)}
Specs: ${JSON.stringify(input.spec)}`;
  }
}

// 6. SEOKeywordMapper
export class SEOKeywordMapper extends BaseAgent {
  constructor(config: Partial<AgentConfig> = {}) {
    super({
      name: 'SEOKeywordMapper',
      description: 'Map brief context to SEO keywords and strategy',
      fallbackValue: {
        keywords: [
          { term: 'software dashboard', volume: 'medium', intent: 'informational', targetPages: ['/'] }
        ],
        strategy: 'Focus on transactional keywords'
      },
      systemInstruction: `You are an SEO specialist. Generate keywords and mapping strategies based on product context.
Output ONLY valid JSON. Do NOT output markdown or explanations.
Output format:
{
  "keywords": [
    {
      "term": "string",
      "volume": "high" or "medium" or "low",
      "intent": "informational" or "transactional" or "navigational",
      "targetPages": ["string"]
    }
  ],
  "strategy": "string"
}`,
      ...config
    });
  }

  protected formatPrompt(input: Record<string, unknown>): string {
    return `Product Brief: ${input.brief as string}
Product Context: ${input.context || 'None'}`;
  }
}

// 7. SitemapGenerator
export class SitemapGenerator extends BaseAgent {
  constructor(config: Partial<AgentConfig> = {}) {
    super({
      name: 'SitemapGenerator',
      description: 'Generate Information Architecture (IA) sitemap tree',
      fallbackValue: {
        sitemap: {
          root: '/',
          pages: [
            { path: '/', title: 'Home Dashboard', sections: ['hero', 'features'], seoKeywords: ['dashboard'] }
          ]
        }
      },
      systemInstruction: `You are an Information Architect. Generate sitemap page trees mapping structure to SEO intent.
Output ONLY valid JSON. Do NOT output markdown or explanations.
Output format:
{
  "sitemap": {
    "root": "string",
    "pages": [
      {
        "path": "string",
        "title": "string",
        "sections": ["string"],
        "seoKeywords": ["string"]
      }
    ]
  }
}`,
      ...config
    });
  }

  protected formatPrompt(input: Record<string, unknown>): string {
    return `Requirements: ${JSON.stringify(input.requirements)}
Keywords: ${JSON.stringify(input.keywords)}`;
  }
}

// 8. ContentBriefGenerator
export class ContentBriefGenerator extends BaseAgent {
  constructor(config: Partial<AgentConfig> = {}) {
    super({
      name: 'ContentBriefGenerator',
      description: 'Generate copywriting briefs and pre-filled copy blocks',
      fallbackValue: {
        briefs: [
          {
            pagePath: '/',
            title: 'Dashboard Page',
            heroSection: {
              heading: 'Build Faster with Agents',
              subheading: 'Lightweight stateless agents with zero overhead',
              cta: 'Get Started'
            },
            copyBlocks: [
              { sectionName: 'intro', copy: 'This application accelerates planning.' }
            ]
          }
        ]
      },
      systemInstruction: `You are a copywriter. Generate content briefs and pre-filled copy blocks from sitemap pages.
Output ONLY valid JSON. Do NOT output markdown or explanations.
Output format:
{
  "briefs": [
    {
      "pagePath": "string",
      "title": "string",
      "heroSection": {
        "heading": "string",
        "subheading": "string",
        "cta": "string"
      },
      "copyBlocks": [
        {
          "sectionName": "string",
          "copy": "string"
        }
      ]
    }
  ]
}`,
      ...config
    });
  }

  protected formatPrompt(input: Record<string, unknown>): string {
    return `Sitemap: ${JSON.stringify(input.sitemap)}
Keywords: ${JSON.stringify(input.keywords)}`;
  }
}

// 9. DesignSystemApplier
export class DesignSystemApplier extends BaseAgent {
  constructor(config: Partial<AgentConfig> = {}) {
    super({
      name: 'DesignSystemApplier',
      description: 'Apply design tokens and generate component specifications',
      fallbackValue: {
        tokens: {
          colors: { primary: '#0f172a', accent: '#3b82f6' },
          typography: { fontFamily: 'Inter, sans-serif' }
        },
        components: [
          { name: 'Button', props: ['variant', 'size'], stylingRules: ['rounded-lg', 'font-medium'] }
        ]
      },
      systemInstruction: `You are a UI designer. Map design requirements to layout specs and component lists.
Output ONLY valid JSON. Do NOT output markdown or explanations.
Output format:
{
  "tokens": {
    "colors": {
      "primary": "string",
      "accent": "string"
    },
    "typography": {
      "fontFamily": "string"
    }
  },
  "components": [
    {
      "name": "string",
      "props": ["string"],
      "stylingRules": ["string"]
    }
  ]
}`,
      ...config
    });
  }

  protected formatPrompt(input: Record<string, unknown>): string {
    return `Requirements: ${JSON.stringify(input.requirements)}
Tokens: ${JSON.stringify(input.tokens)}`;
  }
}

// 10. CodeGenerationSupervisor
export class CodeGenerationSupervisor extends BaseAgent {
  constructor(config: Partial<AgentConfig> = {}) {
    super({
      name: 'CodeGenerationSupervisor',
      description: 'Generate starter code skeletal directories and unit tests',
      fallbackValue: {
        files: [
          {
            path: 'src/index.ts',
            code: 'export const run = () => console.log("Hello");',
            testCode: 'import { run } from "./index"; test("runs", () => { run(); });'
          }
        ]
      },
      systemInstruction: `You are a code supervisor. Generate starter code files and tests matching specification slots.
Output ONLY valid JSON. Do NOT output markdown or explanations.
Output format:
{
  "files": [
    {
      "path": "string",
      "code": "string (complete typescript/javascript syntax)",
      "testCode": "string (complete test code)"
    }
  ]
}`,
      ...config
    });
  }

  protected formatPrompt(input: Record<string, unknown>): string {
    return `Specifications: ${JSON.stringify(input.spec)}
Design Specifications: ${JSON.stringify(input.designSpecs)}`;
  }
}

// 11. ReleasePlanGenerator
export class ReleasePlanGenerator extends BaseAgent {
  constructor(config: Partial<AgentConfig> = {}) {
    super({
      name: 'ReleasePlanGenerator',
      description: 'Generate sequential deployment, check, and monitoring steps',
      fallbackValue: {
        deploymentSteps: [
          { step: 1, description: 'Deploy application', command: 'vercel deploy', validation: 'curl -I https://app.vercel.app' }
        ],
        monitoringConfig: { alertThresholdMs: 2000 }
      },
      systemInstruction: `You are a DevOps engineer. Output structured deployment plans and monitoring parameters.
Output ONLY valid JSON. Do NOT output markdown or explanations.
Output format:
{
  "deploymentSteps": [
    {
      "step": number,
      "description": "string",
      "command": "string",
      "validation": "string"
    }
  ],
  "monitoringConfig": {
    "alertThresholdMs": number
  }
}`,
      ...config
    });
  }

  protected formatPrompt(input: Record<string, unknown>): string {
    return `Code Files: ${JSON.stringify(input.code)}
Spec Details: ${JSON.stringify(input.spec)}
Requirements: ${JSON.stringify(input.requirements)}`;
  }
}

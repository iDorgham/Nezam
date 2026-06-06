#!/usr/bin/env node
'use strict';

const fs = require('fs');
const { execFileSync } = require('child_process');

console.log('NEZAM V3 Design Excellence scaffold check...');

const required = [
  '.cursor/agents/design-excellence-lead.md',
  '.cursor/agents/cultural-design-validator.md',
  '.cursor/agents/token-architect-pro.md',
  '.cursor/agents/a11y-rtl-integration-engineer.md',
  '.cursor/agents/motion-performance-specialist.md',
  '.cursor/agents/design-debt-analyst.md',
  '.cursor/agents/visual-regression-automator.md',
  '.cursor/skills/pm/prioritize-rice/SKILL.md',
  '.cursor/skills/design/design-intent-inference/SKILL.md',
  '.cursor/skills/design/token-synthesis-pro/SKILL.md',
  '.cursor/skills/design/a11y-rtl-fusion/SKILL.md',
  '.cursor/skills/design/cultural-context-validator/SKILL.md',
  '.cursor/skills/design/motion-choreography-budgeted/SKILL.md',
  '.cursor/skills/design/dashboard-layout-pro/SKILL.md',
  '.cursor/skills/design/chart-spec-generator/SKILL.md',
  '.cursor/skills/design/data-viz-motion-budget/SKILL.md',
  '.cursor/skills/system/sdd-gate-validator/SKILL.md',
  '.cursor/commands/design.md',
  '.cursor/rules/design-excellence-gates.mdc',
  '.cursor/rules/dashboard-design-gates.mdc',
  '.cursor/state/design_health.yaml',
  '.cursor/state/dashboard_health.yaml',
  '.cursor/workspace.settings.yaml',
  '.cursor/templates/ui-ux/design/DESIGN-v2.template.md',
  '.cursor/templates/ui-ux/design/DASHBOARD_SPEC.template.md',
  '.nezam/design-hub/docs/VISUAL_BUILDER_V2.md',
  '.nezam/design-hub/styles/global.template.css',
];

const missing = required.filter(f => !fs.existsSync(f));
if (missing.length) {
  console.error('Missing V3 files:');
  missing.forEach(f => console.error('  -', f));
  process.exit(1);
}
console.log(`All ${required.length} required V3 files present.`);

const progress = fs.existsSync('.cursor/state/plan_progress.yaml')
  ? fs.readFileSync('.cursor/state/plan_progress.yaml', 'utf8') : '';
if (!progress.includes('scrumban_board')) {
  console.warn('WARNING: plan_progress.yaml missing scrumban_board block');
}

try {
  execFileSync('pnpm', ['ai:sync'], { stdio: 'inherit' });
  execFileSync('pnpm', ['ai:check'], { stdio: 'inherit' });
  console.log('NEZAM V3 Design Excellence upgrade verified.');
} catch {
  console.error('ai:sync or ai:check failed — fix frontmatter errors before proceeding');
  process.exit(1);
}

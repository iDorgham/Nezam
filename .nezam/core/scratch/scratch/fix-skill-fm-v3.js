const fs = require('fs');
const path = require('path');

const skills = [
  '.cursor/skills/analytics/nezam-advanced-analytics-patterns/SKILL.md',
  '.cursor/skills/analytics/nezam-analytics-chart-animations/SKILL.md',
  '.cursor/skills/analytics/nezam-analytics-chart-styles/SKILL.md',
  '.cursor/skills/analytics/nezam-analytics-chart-types/SKILL.md',
  '.cursor/skills/analytics/nezam-chart-color-systems/SKILL.md',
  '.cursor/skills/analytics/nezam-dashboard-architecture/SKILL.md',
  '.cursor/skills/analytics/nezam-live-data-streams/SKILL.md',
  '.cursor/skills/backend/nezam-supabase-architect/SKILL.md',
  '.cursor/skills/quality/nezam-security-hardening/SKILL.md',
  '.cursor/skills/system/nezam-cli-orchestration/SKILL.md'
];

const today = new Date().toISOString().split('T')[0];

const skillData = {
  'nezam-advanced-analytics-patterns': { name: 'Advanced Analytics Patterns', desc: 'Implementing complex analytical models like cohort analysis, churn, and LTV.', tier: 2, swarm: 'Swarm 8 (Analytics)' },
  'nezam-analytics-chart-animations': { name: 'Analytics Chart Animations', desc: 'Choreographing smooth transitions and dynamic entry/exit animations for data visualizations.', tier: 3, swarm: 'Swarm 8 (Analytics)' },
  'nezam-analytics-chart-styles': { name: 'Analytics Chart Styles', desc: 'Enforcing consistent visual language (glassmorphism, gradients, HSL color tokens) for all chart types.', tier: 3, swarm: 'Swarm 8 (Analytics)' },
  'nezam-analytics-chart-types': { name: 'Analytics Chart Types', desc: 'Implementing a complete library of specialized charts (Sankey, Radar, Treemap, etc.) optimized for NEZAM.', tier: 3, swarm: 'Swarm 8 (Analytics)' },
  'nezam-chart-color-systems': { name: 'Chart Color Systems', desc: 'Managing accessible, harmonious color palettes and semantic data-driven coloring.', tier: 3, swarm: 'Swarm 8 (Analytics)' },
  'nezam-dashboard-architecture': { name: 'Dashboard Architecture', desc: 'Designing modular, widget-based dashboard layouts with drag-and-drop and state persistence.', tier: 2, swarm: 'Swarm 8 (Analytics)' },
  'nezam-live-data-streams': { name: 'Live Data Streams', desc: 'Integrating real-time WebSocket and polling mechanisms for live analytics updates.', tier: 3, swarm: 'Swarm 8 (Analytics)' },
  'nezam-supabase-architect': { name: 'Supabase Architect', desc: 'Designing and implementing real-time database schemas and RLS policies on Supabase.', tier: 2, swarm: 'Swarm 4 (Backend)' },
  'nezam-security-hardening': { name: 'Security Hardening', desc: 'Implementing advanced security measures and vulnerability mitigation strategies.', tier: 2, swarm: 'Swarm 9 (Security)' },
  'nezam-cli-orchestration': { name: 'CLI Orchestration', desc: 'Managing command-line interfaces and automated script execution pipelines.', tier: 2, swarm: 'Swarm 10 (DevOps)' }
};

skills.forEach(skillPath => {
  const fullPath = path.join(process.cwd(), skillPath);
  if (!fs.existsSync(fullPath)) return;

  const fileName = path.basename(path.dirname(skillPath));
  const data = skillData[fileName];
  if (!data) return;

  let content = fs.readFileSync(fullPath, 'utf8');
  
  const newFm = `---
id: ${fileName}
name: ${data.name}
description: ${data.desc}
tier: ${data.tier}
swarm: ${data.swarm}
version: 1.0.0
created: ${today}
updated: ${today}
owner: PM-01
changelog:
  - 1.0.0: Initial release
---
`;

  content = content.replace(/^---\n[\s\S]*?\n---\n/, newFm);
  fs.writeFileSync(fullPath, content);
  console.log(`Cleaned up ${skillPath}`);
});

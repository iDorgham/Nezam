const fs = require('fs');
const path = require('path');

const registryPath = path.join(__dirname, '../.cursor/state/AGENT_REGISTRY.yaml');
const agentsToArchive = [
  'android-engineer',
  'dependency-update-specialist',
  'executive-director',
  'feature-flags-specialist',
  'ios-engineer',
  'mena-payments-specialist',
  'mobile-offline-sync-specialist',
  'mobile-push-notifications-specialist',
  'observability-specialist',
  'performance-engineer',
  'product-manager',
  'real-time-streaming-specialist',
  'refactoring-specialist',
  'risk-assessment-specialist',
  'technology-evaluator',
  'threat-modeling-specialist',
  'time-series-specialist',
  'vector-store-specialist',
  'white-label-theming-specialist'
];

let content = fs.readFileSync(registryPath, 'utf8');
let lines = content.split('\n');
let updatedLines = [];

for (let line of lines) {
  updatedLines.push(line);
  for (const agent of agentsToArchive) {
    if (line.trim() === `- name: ${agent}`) {
      updatedLines.push(`      status: archived`);
      console.log(`Archived ${agent}`);
    }
  }
}

fs.writeFileSync(registryPath, updatedLines.join('\n'));
console.log('Done');

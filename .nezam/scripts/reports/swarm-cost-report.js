const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const busPath = path.join(__dirname, '../.cursor/state/agent-bus.yaml');
const registryPath = path.join(__dirname, '../.cursor/state/AGENT_REGISTRY.yaml');
const reportDir = path.join(__dirname, '../docs/reports');

// Ensure reports directory exists
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

// 1. Load Agent Registry to map agent -> swarm
let agentToSwarm = {};
try {
  const registryContent = fs.readFileSync(registryPath, 'utf8');
  const docs = yaml.loadAll(registryContent);
  const registry = docs[1] || docs[0];
  if (registry && registry.registry && registry.registry.always_load) {
    for (const agent of registry.registry.always_load) {
      if (agent.name && agent.swarm) {
        agentToSwarm[agent.name] = agent.swarm;
      }
    }
  }
} catch (e) {
  console.error(`Error reading AGENT_REGISTRY.yaml:`, e.message);
}

// 2. Load Agent Bus
let swarms = {};
let totalTasks = 0;
let heavySwarms = [];

try {
  const busContent = fs.readFileSync(busPath, 'utf8');
  const docs = yaml.loadAll(busContent);
  const bus = docs[1] || docs[0];
  
  if (bus && bus.messages) {
    for (const msg of bus.messages) {
      if (!msg.id) continue; // Skip template or empty
      
      let swarm = msg.assigned_swarm;
      if (!swarm && msg.to) {
        swarm = agentToSwarm[msg.to];
      }
      if (!swarm) {
        swarm = 'Unknown';
      }
      
      const mode = msg.mode || 'A'; // Default to A if not specified
      
      if (!swarms[swarm]) {
        swarms[swarm] = { tasks: 0, A: 0, B: 0, C: 0 };
      }
      
      swarms[swarm].tasks++;
      if (mode === 'A' || mode === 'B' || mode === 'C') {
        swarms[swarm][mode]++;
      }
      
      totalTasks++;
    }
  }
} catch (e) {
  console.error(`Error reading agent-bus.yaml:`, e.message);
}

// Generate report
const date = new Date().toISOString().split('T')[0];
const reportPath = path.join(reportDir, `swarm-cost-${date}.md`);

let markdown = `# Swarm Cost Report — ${date}\n\n`;
markdown += `| Swarm | Tasks | Mode A | Mode B | Mode C | Notes |\n`;
markdown += `|---|---|---|---|---|---|\n`;

for (const [swarm, data] of Object.entries(swarms)) {
  markdown += `| ${swarm} | ${data.tasks} | ${data.A} | ${data.B} | ${data.C} | |\n`;
  if (data.C > 5) {
    heavySwarms.push(swarm);
  }
}

markdown += `\n**Total tasks routed:** ${totalTasks}\n`;
markdown += `**Heavy swarms (>5 MODE C):** ${heavySwarms.length > 0 ? heavySwarms.join(', ') : 'None'}\n`;

fs.writeFileSync(reportPath, markdown);
console.log(`[swarm-cost] report saved to docs/reports/swarm-cost-${date}.md`);

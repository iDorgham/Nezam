const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const { getWorkspacePaths } = require('../utils/workspace-paths.js');

const repoRoot = process.cwd();
const wsConfig = getWorkspacePaths(repoRoot);
const agentBusFile = wsConfig.hardlocks.agent_bus || '.cursor/state/agent-bus.yaml';
const filePath = path.resolve(repoRoot, agentBusFile);

function printHelp() {
  console.log(`
NEZAM Agent Bus Logging Utility
Usage:
  node log-message.js --from <from> --to <to> --type <type> --phase <phase> --mode <mode> --subject <subject> [--artifact <path>] [--summary <text>] [--action <text>]
`);
}

const args = {};
process.argv.slice(2).forEach((val, index, array) => {
  if (val.startsWith('--')) {
    const key = val.substring(2);
    const nextVal = array[index + 1];
    if (nextVal && !nextVal.startsWith('--')) {
      args[key] = nextVal;
    }
  }
});

const required = ['from', 'to', 'type', 'phase', 'mode', 'subject'];
let missing = [];
required.forEach(f => {
  if (!args[f]) missing.push(f);
});

if (missing.length > 0) {
  console.error(`Error: Missing required fields: ${missing.join(', ')}`);
  printHelp();
  process.exit(1);
}

const id = `MSG-${Date.now()}`;
const timestamp = new Date().toISOString();

const newMessage = {
  id: id,
  from: args.from,
  to: args.to,
  type: args.type,
  phase: args.phase,
  mode: args.mode,
  timestamp: timestamp,
  status: 'pending',
  payload: {
    subject: args.subject,
    artifact_path: args.artifact || '',
    summary: args.summary || '',
    action_required: args.action || ''
  }
};

try {
  let fileContents = '';
  if (fs.existsSync(filePath)) {
    fileContents = fs.readFileSync(filePath, 'utf8');
  }
  
  const docs = yaml.loadAll(fileContents);
  const doc = docs.find(d => d && d.messages) || docs[docs.length - 1] || { created: timestamp, version: '1.0.0', owner: 'PM-01', messages: [] };
  
  if (!doc.messages) doc.messages = [];
  doc.messages.push(newMessage);
  
  const yamlContent = yaml.dump(doc, { noRefs: true });
  fs.writeFileSync(filePath, `---\n${yamlContent}`, 'utf8');
  
  console.log(`[agent-bus] Logged message ${id} from ${args.from} to ${args.to} successfully.`);
  process.exit(0);
} catch (e) {
  console.error('[agent-bus] Error appending message to bus:', e);
  process.exit(1);
}

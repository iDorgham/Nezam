const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const filePath = path.resolve(__dirname, '../.cursor/state/agent-bus.yaml');

if (!fs.existsSync(filePath)) {
  console.error(`[agent-bus] ERROR: File not found: ${filePath}`);
  process.exit(1);
}

try {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const docs = yaml.loadAll(fileContents);
  const doc = docs.find(d => d && d.messages) || docs[docs.length - 1] || {};
  
  if (!doc.messages) {
    console.log('[agent-bus] WARNING: No messages logged. Agent Bus appears unused.');
    process.exit(0);
  }

  const messages = doc.messages;
  
  // Check if messages is empty or contains only template entries
  const isEmptyOrTemplate = messages.length === 0 || 
    (messages.length === 1 && (!messages[0].id || messages[0].id === ""));

  if (isEmptyOrTemplate) {
    console.log('[agent-bus] WARNING: No messages logged. Agent Bus appears unused.');
    process.exit(0);
  }

  let errorCount = 0;
  const requiredFields = ['id', 'from', 'to', 'type', 'payload', 'phase', 'mode', 'timestamp', 'status'];

  messages.forEach((msg, index) => {
    // Skip template entry if it's the only one and empty (handled above)
    // If there are other messages, an empty template entry shouldn't be there or should be filled.
    // Let's validate all entries.
    
    requiredFields.forEach(field => {
      if (msg[field] === undefined || msg[field] === null || msg[field] === '') {
        console.error(`[agent-bus] ERROR: Message at index ${index} missing field: ${field}`);
        errorCount++;
      }
    });
  });

  if (errorCount > 0) {
    console.error(`[agent-bus] Found ${errorCount} errors.`);
    process.exit(1);
  }

  console.log('[agent-bus] All messages valid.');
  process.exit(0);
} catch (e) {
  console.error('[agent-bus] Error reading or parsing agent-bus.yaml:', e);
  process.exit(1);
}

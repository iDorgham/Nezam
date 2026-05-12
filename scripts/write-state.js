const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function parseArgs() {
  const args = process.argv.slice(2);
  const result = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, '');
    const value = args[i + 1];
    result[key] = value;
  }
  return result;
}

const args = parseArgs();
const filePath = args.file;
const keyPath = args.key;
let value = args.value;

// Convert value to boolean or number if applicable
if (value === 'true') value = true;
else if (value === 'false') value = false;
else if (!isNaN(value) && value !== '') value = Number(value);

if (!filePath || !keyPath || value === undefined) {
  console.error('Usage: node write-state.js --file <file> --key <key> --value <value>');
  process.exit(1);
}

try {
  const fullPath = path.resolve(process.cwd(), filePath);
  let doc = {};
  
  if (fs.existsSync(fullPath)) {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    doc = yaml.load(fileContents) || {};
  } else {
    console.log(`[state-writer] File ${filePath} does not exist. Creating new.`);
  }

  const keys = keyPath.split('.');
  let current = doc;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (!current[k] || typeof current[k] !== 'object') {
      current[k] = {};
    }
    current = current[k];
  }
  
  current[keys[keys.length - 1]] = value;

  const yamlStr = yaml.dump(doc, { lineWidth: -1 });
  
  // Atomic write
  const tmpPath = fullPath + '.tmp';
  fs.writeFileSync(tmpPath, yamlStr, 'utf8');
  fs.renameSync(tmpPath, fullPath);
  
  console.log(`[state-writer] updated ${keyPath} = ${value} in ${filePath}`);
} catch (e) {
  console.error('Error updating state:', e);
  process.exit(1);
}

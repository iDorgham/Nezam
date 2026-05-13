const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('.git') && !file.includes('node_modules') && !file.includes('.antigravity') && !file.includes('.claude') && !file.includes('.codex') && !file.includes('.gemini') && !file.includes('.opencode') && !file.includes('.qwen')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.md') || file.endsWith('.json') || file.endsWith('.yaml') || file.endsWith('.toml') || file.endsWith('.mdc')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('.');
let updated = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/docs\/gates/g, '.nezam/gates');
  newContent = newContent.replace(/docs\/architecture/g, '.nezam/workspace/architecture');
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    updated++;
    console.log('Updated ' + file);
  }
});
console.log('Total updated: ' + updated);

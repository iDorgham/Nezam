const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const repoRoot = process.cwd();
const stateDir = path.join(repoRoot, '.cursor/state');

function verifyYaml() {
  console.log('🔍 Verifying YAML files in .cursor/state/...');
  let errors = 0;
  
  const files = fs.readdirSync(stateDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
  
  for (const file of files) {
    const filePath = path.join(stateDir, file);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      yaml.loadAll(content);
      console.log(`✅ ${file} parsed successfully`);
    } catch (e) {
      console.error(`❌ Error parsing ${file}: ${e.message}`);
      errors++;
    }
  }
  
  if (errors > 0) {
    console.error(`\n❌ YAML verification failed with ${errors} error(s).`);
    process.exit(1);
  } else {
    console.log('\n✅ All YAML files parsed successfully!');
    process.exit(0);
  }
}

verifyYaml();

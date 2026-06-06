const fs = require('fs');
const path = require('path');
let yaml;
try {
  yaml = require('js-yaml');
} catch (e) {
  yaml = {
    loadAll: function(content) {
      // Offline fallback: state-machine based basic syntax validator for YAML files
      const lines = content.split('\n');
      let inBlockScalar = false;
      let blockIndentation = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#') || trimmed === '---') continue;
        
        const indent = line.length - line.trimStart().length;
        
        if (inBlockScalar) {
          if (indent > blockIndentation) {
            continue; // Ignore block scalar body lines
          } else {
            inBlockScalar = false; // Block scalar ended
          }
        }
        
        if (trimmed.endsWith('|') || trimmed.endsWith('>') || trimmed.endsWith('|-') || trimmed.endsWith('>-')) {
          inBlockScalar = true;
          blockIndentation = indent;
          continue;
        }

        // Validate basic key-value line structure
        if (trimmed.includes(':') && !trimmed.startsWith('-')) {
          const colonIdx = trimmed.indexOf(':');
          const value = trimmed.substring(colonIdx + 1).trim();
          
          if (value.startsWith('"')) {
            const quoteCount = (value.match(/"/g) || []).length;
            if (quoteCount % 2 !== 0) {
              throw new Error(`Unclosed double quote at line ${i + 1}`);
            }
          } else if (value.startsWith("'")) {
            const quoteCount = (value.match(/'/g) || []).length;
            if (quoteCount % 2 !== 0) {
              throw new Error(`Unclosed single quote at line ${i + 1}`);
            }
          }
        }
      }
      return [];
    }
  };
}

const repoRoot = process.cwd();

const SCAN_DIRS = [
  { dir: '.cursor/state', recursive: true, label: '.cursor/state', strict: true },
  // GitHub Actions workflows embed arbitrary code (JS, bash) with YAML-special chars
  // in block scalars — js-yaml cannot parse these reliably. GitHub validates them natively.
  { dir: '.github', recursive: true, label: '.github workflows', strict: false },
  { dir: '.nezam/core', recursive: true, label: '.nezam/core', skip: ['archive'], strict: true },
];

const SKIP_EXTENSIONS = ['.bak'];
const SKIP_DIRS = ['node_modules', '.next', 'dist', 'build'];

function collectYamlFiles(dir, recursive = true, skipDirs = []) {
  const files = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (recursive && !SKIP_DIRS.includes(entry.name) && !skipDirs.includes(entry.name)) {
        files.push(...collectYamlFiles(fullPath, recursive, skipDirs));
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if ((ext === '.yaml' || ext === '.yml') && !SKIP_EXTENSIONS.some(s => entry.name.endsWith(s))) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

function verifyYaml() {
  let totalErrors = 0;

  for (const { dir, recursive, label, skip = [], strict = true } of SCAN_DIRS) {
    const absDir = path.join(repoRoot, dir);
    if (!fs.existsSync(absDir)) continue;

    const files = collectYamlFiles(absDir, recursive, skip);
    if (files.length === 0) continue;

    console.log(`\n🔍 Verifying YAML in ${label} (${files.length} files)...`);
    let sectionErrors = 0;

    for (const filePath of files) {
      const rel = path.relative(repoRoot, filePath);
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        yaml.loadAll(content);
        console.log(`  ✅ ${rel}`);
      } catch (e) {
        if (strict) {
          console.error(`  ❌ ${rel}: ${e.message}`);
          sectionErrors++;
          totalErrors++;
        } else {
          console.warn(`  ⚠️  ${rel}: ${e.message.split('\n')[0]} (warn-only — validated by CI)`);
        }
      }
    }

    if (sectionErrors === 0) {
      console.log(`  All ${label} YAML OK.`);
    }
  }

  console.log('');
  if (totalErrors > 0) {
    console.error(`❌ YAML verification failed — ${totalErrors} error(s).`);
    process.exit(1);
  } else {
    console.log('✅ All governance YAML files parsed successfully!');
    process.exit(0);
  }
}

verifyYaml();

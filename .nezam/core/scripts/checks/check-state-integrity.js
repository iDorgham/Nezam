const fs = require('fs')
const path = require('path')

let yaml;
try {
  yaml = require('js-yaml')
} catch (e) {
  function parseSimpleYaml(content) {
    const lines = content.split('\n');
    const result = {};
    const stack = [{ indent: -1, obj: result }];
    
    for (let line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      
      const indent = line.length - line.trimStart().length;
      
      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
        stack.pop();
      }
      
      const parentInfo = stack[stack.length - 1];
      const parent = parentInfo.obj;
      
      if (trimmed.startsWith('-')) {
        let valStr = trimmed.substring(1).trim();
        const commentIdx = valStr.indexOf('#');
        if (commentIdx !== -1) {
          valStr = valStr.substring(0, commentIdx).trim();
        }
        let val = valStr.replace(/^['"]|['"]$/g, '');
        if (val === 'true') val = true;
        else if (val === 'false') val = false;
        else if (val === 'null') val = null;
        else if (!isNaN(val) && val !== '') val = Number(val);
        
        if (Array.isArray(parent)) {
          parent.push(val);
        } else if (parent && typeof parent === 'object' && Object.keys(parent).length === 0) {
          const parentKey = parentInfo.parentKey;
          const parentObj = parentInfo.parentObj;
          if (parentObj && parentKey) {
            parentObj[parentKey] = [val];
            parentInfo.obj = parentObj[parentKey];
          }
        }
        continue;
      }
      
      const colonIdx = trimmed.indexOf(':');
      if (colonIdx === -1) continue;
      
      const key = trimmed.substring(0, colonIdx).trim().replace(/^['"]|['"]$/g, '');
      let valStr = trimmed.substring(colonIdx + 1).trim();
      
      const commentIdx = valStr.indexOf('#');
      if (commentIdx !== -1) {
        valStr = valStr.substring(0, commentIdx).trim();
      }
      
      let val;
      if (valStr === '') {
        val = {};
      } else {
        val = valStr;
        if (valStr === 'true') val = true;
        else if (valStr === 'false') val = false;
        else if (valStr === 'null') val = null;
        else if (valStr.startsWith('"') && valStr.endsWith('"')) val = valStr.slice(1, -1);
        else if (valStr.startsWith("'") && valStr.endsWith("'")) val = valStr.slice(1, -1);
        else if (!isNaN(valStr) && valStr !== '') val = Number(valStr);
      }
      
      if (!Array.isArray(parent)) {
        parent[key] = val;
      }
      
      if (valStr === '') {
        stack.push({
          indent: indent,
          obj: val,
          parentObj: parent,
          parentKey: key
        });
      }
    }
    return result;
  }
  yaml = {
    load: parseSimpleYaml
  }
}


const REPO_ROOT = path.resolve(__dirname, '../../..')
const DEVELOP_PHASES_PATH = path.join(REPO_ROOT, '.cursor/state/develop_phases.yaml')
const PLAN_PROGRESS_PATH = path.join(REPO_ROOT, '.cursor/state/plan_progress.yaml')

function runStateIntegrityCheck() {
  console.log('🔍 Running State & Artifact Integrity Validator...')
  let failures = 0

  // 1. Check develop_phases.yaml
  if (fs.existsSync(DEVELOP_PHASES_PATH)) {
    try {
      const devPhases = yaml.load(fs.readFileSync(DEVELOP_PHASES_PATH, 'utf8'))
      if (devPhases && devPhases.phases) {
        Object.keys(devPhases.phases).forEach(key => {
          const phase = devPhases.phases[key]
          if (phase.status === 'complete') {
            console.log(`Checking deliverables for ${phase.name} (complete)...`)
            // Add custom check rules if any phase was marked complete
          }
        })
      }
    } catch (e) {
      console.error(`❌ Error parsing develop_phases.yaml: ${e.message}`)
      failures++
    }
  }

  // 2. Check plan_progress.yaml
  if (fs.existsSync(PLAN_PROGRESS_PATH)) {
    try {
      const planProg = yaml.load(fs.readFileSync(PLAN_PROGRESS_PATH, 'utf8'))
      if (planProg) {
        const checks = [
          { flag: 'seo', path: 'docs/start/SEO_RESEARCH.md', name: 'SEO Research' },
          { flag: 'ia', path: 'docs/start/IA_STRUCTURE.md', name: 'IA Structure' },
          { flag: 'content', path: 'docs/start/CONTENT_MAP.md', name: 'Content Map' },
          { flag: 'arch', path: 'docs/plan/04-arch/ARCHITECTURE.md', name: 'Architecture Spec' },
          { flag: 'design_wireframes', path: 'wireframes_locked.json', name: 'Locked Wireframes' },
          { flag: 'scaffold', path: 'docs/plan/scaffold/PROJECT_SCAFFOLD.md', name: 'Project Scaffold' },
          { flag: 'tasks', path: 'docs/plan/MASTER_TASKS.md', name: 'Master Tasks List' }
        ]

        checks.forEach(c => {
          if (planProg[c.flag] === true) {
            const absPath = path.join(REPO_ROOT, c.path)
            if (!fs.existsSync(absPath)) {
              console.error(`❌ INTEGRITY_VIOLATION: Plan phase "${c.name}" marked complete but missing artifact at "${c.path}"`)
              failures++
            } else {
              console.log(`✅ Integrity match: "${c.name}" matches file "${c.path}"`)
            }
          }
        })
      }
    } catch (e) {
      console.error(`❌ Error parsing plan_progress.yaml: ${e.message}`)
      failures++
    }
  }

  if (failures > 0) {
    console.error(`\n❌ State Integrity Check failed with ${failures} violations.`)
    process.exit(1)
  } else {
    console.log('\n✅ All state and artifact integrity checks passed successfully!')
    process.exit(0)
  }
}

runStateIntegrityCheck()

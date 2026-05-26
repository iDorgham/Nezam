#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI escape codes for styling
const C_RESET = '\x1b[0m';
const C_BOLD = '\x1b[1m';
const C_UNDERLINE = '\x1b[4m';

// MENA/Egyptian inspired Harmonious Palette
const C_GOLD = '\x1b[38;5;214m';   // Cairo Sunrise / Gold
const C_RED = '\x1b[38;5;196m';    // Red / Alert
const C_TEAL = '\x1b[38;5;39m';     // Sahel / Cyan
const C_GREEN = '\x1b[38;5;76m';    // Nile Green / Pass
const C_ORANGE = '\x1b[38;5;208m';  // Desert Dusk / Warn
const C_PURPLE = '\x1b[38;5;135m';  // Nile Evening / Info

const repoRoot = path.resolve(__dirname, '../..');

// Helper to safely read file
function readFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf8');
}

// Simple YAML parser helper (for basic keys)
function parseSimpleYaml(content) {
  if (!content) return {};
  const obj = {};
  const lines = content.split('\n');
  for (const line of lines) {
    const cleanLine = line.split('#')[0].trim();
    if (!cleanLine.includes(':')) continue;
    const parts = cleanLine.split(':');
    const key = parts[0].trim();
    let val = parts.slice(1).join(':').trim();
    // Parse booleans and arrays
    if (val === 'true') val = true;
    else if (val === 'false') val = false;
    else if (val.startsWith('[') && val.endsWith(']')) {
      val = val.substring(1, val.length - 1).split(',').map(s => s.trim().replace(/['"]/g, '')).filter(Boolean);
    } else {
      val = val.replace(/['"]/g, '');
    }
    obj[key] = val;
  }
  return obj;
}

// 1. Gather Git Info
let gitBranch = 'N/A';
let gitLastCommit = 'N/A';
try {
  gitBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  gitLastCommit = execSync('git log -1 --pretty=format:"%h - %s (%cr)"', { encoding: 'utf8' }).trim();
} catch (e) {
  // Ignored
}

// 2. Gather State Files
const onboardingYaml = readFile(path.join(repoRoot, '.cursor/state/onboarding.yaml'));
const onboarding = parseSimpleYaml(onboardingYaml);

const planProgressYaml = readFile(path.join(repoRoot, '.cursor/state/plan_progress.yaml'));
const planProgress = parseSimpleYaml(planProgressYaml);

const developPhasesYaml = readFile(path.join(repoRoot, '.cursor/state/develop_phases.yaml'));
const developPhases = parseSimpleYaml(developPhasesYaml);

const handoffQueueYaml = readFile(path.join(repoRoot, 'HANDOFF_QUEUE.yaml')) || readFile(path.join(repoRoot, '.cursor/state/HANDOFF_QUEUE.yaml'));
const handoffQueue = parseSimpleYaml(handoffQueueYaml);

let certifiedCount = 0;
const agentRegistryYaml = readFile(path.join(repoRoot, '.cursor/state/AGENT_REGISTRY.yaml'));
if (agentRegistryYaml) {
  const lines = agentRegistryYaml.split(/\r?\n/);
  let inCertifiedSection = false;
  for (const line of lines) {
    if (line.trim().startsWith('certified_agents:')) {
      inCertifiedSection = true;
      continue;
    }
    if (inCertifiedSection) {
      if (line.trim().startsWith('-')) {
        certifiedCount++;
      } else if (line.trim() !== '' && !line.trim().startsWith('-') && line.includes(':')) {
        inCertifiedSection = false;
      }
    }
  }
}

// 3. Count Agents & Skills
let agentCount = 0;
let skillCount = 0;
try {
  const agentsDir = path.join(repoRoot, '.cursor/agents');
  if (fs.existsSync(agentsDir)) {
    agentCount = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md')).length;
  }
  
  const skillsDir = path.join(repoRoot, '.cursor/skills');
  if (fs.existsSync(skillsDir)) {
    const walk = (dir) => {
      const list = fs.readdirSync(dir);
      for (const file of list) {
        const full = path.join(dir, file);
        if (fs.statSync(full).isDirectory()) {
          walk(full);
        } else if (file === 'SKILL.md') {
          skillCount++;
        }
      }
    };
    walk(skillsDir);
  }
} catch (e) {
  // Ignored
}

// 4. Calculate Health Score
let healthScore = 100;
const deductions = [];

if (!onboarding.prd_locked) { healthScore -= 15; deductions.push('PRD is not locked'); }
if (!onboarding.design_locked) { healthScore -= 15; deductions.push('DESIGN contract is not locked'); }
if (!planProgress.planning_complete) { healthScore -= 20; deductions.push('SDD Planning is incomplete'); }

let handoffPending = false;
if (handoffQueue && handoffQueue.messages) {
  // Simple check for pending queue items
  if (handoffQueueYaml.includes('status: pending') || handoffQueueYaml.includes('status: in_progress')) {
    handoffPending = true;
    healthScore -= 10;
    deductions.push('Active pending handoffs in queue');
  }
}

if (healthScore < 0) healthScore = 0;

// Color mapping for score
let scoreColor = C_GREEN;
if (healthScore < 50) scoreColor = C_RED;
else if (healthScore < 85) scoreColor = C_ORANGE;

// Output Dashboard TUI
console.clear();
console.log(`${C_BOLD}${C_GOLD}╔═══════════════════════════════════════════════════════════════════════════════════════════════╗${C_RESET}`);
console.log(`${C_BOLD}${C_GOLD}║                                 N E Z A M   H E A L T H                                       ║${C_RESET}`);
console.log(`${C_BOLD}${C_GOLD}║                            Workspace Monitoring & Diagnostics                                 ║${C_RESET}`);
console.log(`${C_BOLD}${C_GOLD}╚═══════════════════════════════════════════════════════════════════════════════════════════════╝${C_RESET}`);

console.log(`\n${C_BOLD}${C_TEAL}■ SYSTEM ENVIRONMENT${C_RESET}`);
console.log(`  ├─ ${C_BOLD}Git Branch:${C_RESET}       ${gitBranch}`);
console.log(`  ├─ ${C_BOLD}Last Commit:${C_RESET}      ${gitLastCommit}`);
console.log(`  ├─ ${C_BOLD}Active Persona:${C_RESET}   ${agentCount} Agents loaded`);
console.log(`  ├─ ${C_BOLD}Certified Agents:${C_RESET} ${certifiedCount} / ${agentCount} (Elite & Certified)`);
console.log(`  └─ ${C_BOLD}Active Skills:${C_RESET}     ${skillCount} Playbook Skills available`);

console.log(`\n${C_BOLD}${C_TEAL}■ SDD GATE PIPELINE STATUS${C_RESET}`);
console.log(`  ├─ ${C_BOLD}PRD Contract:${C_RESET}    ${onboarding.prd_locked ? C_GREEN + '🔒 LOCKED' : C_RED + '🔓 UNLOCKED'} ${C_RESET}`);
console.log(`  ├─ ${C_BOLD}Design Contract:${C_RESET} ${onboarding.design_locked ? C_GREEN + '🔒 LOCKED' : C_RED + '🔓 UNLOCKED'} ${C_RESET}`);
console.log(`  ├─ ${C_BOLD}Build Mode:${C_RESET}      ${C_GOLD}${onboarding.build_mode || 'sdd (standard)'}${C_RESET}`);
console.log(`  ├─ ${C_BOLD}Tone Profile:${C_RESET}    ${onboarding.tone || 'structured'}`);
console.log(`  ├─ ${C_BOLD}Planning Gate:${C_RESET}   ${planProgress.planning_complete ? C_GREEN + '✅ COMPLETE' : C_ORANGE + '⚠️ IN PROGRESS'} ${C_RESET}`);
console.log(`  └─ ${C_BOLD}Handoff Status:${C_RESET}  ${handoffPending ? C_ORANGE + '⚠️ PENDING HANDOFFS' : C_GREEN + '✅ SYNCED'} ${C_RESET}`);

console.log(`\n${C_BOLD}${C_TEAL}■ WORKSPACE OVERALL HEALTH SCORE${C_RESET}`);
console.log(`  ╔═════════════════════════════════════════════════════════════════════════════════════════════╗`);
console.log(`  ║                                                                                             ║`);
console.log(`  ║                     Current Health Score:      ${scoreColor}${C_BOLD}${healthScore}%${C_RESET}                                   ║`);
console.log(`  ║                                                                                             ║`);
console.log(`  ╚═════════════════════════════════════════════════════════════════════════════════════════════╝`);

if (deductions.length > 0) {
  console.log(`\n${C_BOLD}${C_ORANGE}⚠ DEDUCTION REPORT & RECOMMENDATIONS:${C_RESET}`);
  deductions.forEach(d => {
    console.log(`  • ${C_RED}-${C_RESET} ${d}`);
  });
  console.log(`\n  👉 ${C_BOLD}Recommendation:${C_RESET} Run ${C_GOLD}/FIX gates${C_RESET} or ${C_GOLD}/PLAN${C_RESET} to satisfy incomplete gate specifications.`);
} else {
  console.log(`\n${C_BOLD}${C_GREEN}🎉 ALL GATES MET! Workspace is fully secure and ready for /DEVELOP.${C_RESET}`);
}

console.log(`\n${C_BOLD}${C_GOLD}───────────────────────────────────────────────────────────────────────────────────────────────${C_RESET}\n`);

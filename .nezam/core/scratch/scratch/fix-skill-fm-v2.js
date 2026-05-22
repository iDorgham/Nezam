const fs = require('fs');
const path = require('path');

const skills = [
  '.cursor/skills/analytics/nezam-advanced-analytics-patterns/SKILL.md',
  '.cursor/skills/analytics/nezam-analytics-chart-animations/SKILL.md',
  '.cursor/skills/analytics/nezam-analytics-chart-styles/SKILL.md',
  '.cursor/skills/analytics/nezam-analytics-chart-types/SKILL.md',
  '.cursor/skills/analytics/nezam-chart-color-systems/SKILL.md',
  '.cursor/skills/analytics/nezam-dashboard-architecture/SKILL.md',
  '.cursor/skills/analytics/nezam-live-data-streams/SKILL.md',
  '.cursor/skills/backend/nezam-supabase-architect/SKILL.md',
  '.cursor/skills/quality/nezam-security-hardening/SKILL.md',
  '.cursor/skills/system/nezam-cli-orchestration/SKILL.md'
];

const today = new Date().toISOString().split('T')[0];

skills.forEach(skillPath => {
  const fullPath = path.join(process.cwd(), skillPath);
  if (!fs.existsSync(fullPath)) return;

  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Clean up previous mess if any
  content = content.replace(/Analytics\)version: 1.0.0/, "Analytics)\nversion: 1.0.0");
  
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  
  if (fmMatch) {
    let lines = fmMatch[1].split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const fmObj = {};
    lines.forEach(line => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        fmObj[parts[0].trim()] = parts.slice(1).join(':').trim();
      }
    });

    // Ensure all fields
    if (!fmObj.version) fmObj.version = '1.0.0';
    if (!fmObj.created) fmObj.created = today;
    if (!fmObj.updated) fmObj.updated = today;
    if (!fmObj.owner) fmObj.owner = 'PM-01';
    
    let newFm = "";
    Object.keys(fmObj).forEach(key => {
      if (key !== 'changelog') {
        newFm += `${key}: ${fmObj[key]}\n`;
      }
    });
    
    // Changelog handled separately for formatting
    newFm += `changelog:\n  - 1.0.0: Initial release\n`;
    
    content = content.replace(/^---\n[\s\S]*?\n---\n/, `---\n${newFm}---\n`);
    fs.writeFileSync(fullPath, content);
  }
});

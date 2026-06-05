const fs = require('fs');
const path = require('path');

const { getWorkspacePaths } = require('../utils/workspace-paths.js');

const repoRoot = process.cwd();
const wsConfig = getWorkspacePaths(repoRoot);

const skillsDir = path.resolve(repoRoot, wsConfig.paths.skills_folder || '.cursor/skills');
const agentsDir = path.resolve(repoRoot, wsConfig.paths.agents_folder || '.cursor/agents');
const registryPath = path.resolve(repoRoot, wsConfig.paths.state_folder || '.cursor/state', 'skills-registry.json');

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const res = path.join(dir, file.name);
    if (file.isDirectory()) {
      walkDir(res, callback);
    } else {
      callback(res);
    }
  }
}

const skills = [];
const orphanedSkills = [];
const unresolvedSkillRefs = [];

// 1. Find all SKILL.md files
walkDir(skillsDir, (filePath) => {
  if (filePath.includes('/archive/') || filePath.includes('\\archive\\') || filePath.includes('/archive\\') || filePath.includes('\\archive/')) {
    return;
  }
  if (path.basename(filePath) === 'SKILL.md') {
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/^---([\s\S]*?)---/);
    if (match) {
      try {
        const skillIdMatch = match[1].match(/^skill_id:\s*(.+)$/m);
        const idMatch = match[1].match(/^id:\s*(.+)$/m);
        const skillMatch = match[1].match(/^skill:\s*(.+)$/m);
        const nameMatch = match[1].match(/^name:\s*(.+)$/m);
        
        let rawId = null;
        if (skillIdMatch) rawId = skillIdMatch[1].trim();
        else if (idMatch) rawId = idMatch[1].trim();
        else if (skillMatch) rawId = skillMatch[1].trim();
        else if (nameMatch) rawId = nameMatch[1].trim();
        
        if (rawId) {
          // Robust sanitization: strip quotes, duplicate prefixes, and normalize spaces
          const cleanId = rawId.replace(/['"]/g, '').replace(/(nezam-)+/g, 'nezam-').trim();
          
          const versionMatch = match[1].match(/^version:\s*(.+)$/m);
          const version = versionMatch ? versionMatch[1].trim() : '0.0.0';
          
          skills.push({
            path: path.relative(path.join(__dirname, '..'), filePath),
            id: cleanId,
            version: version,
            referenced_by: [],
            orphaned: true // Assume orphaned until found
          });
        }
      } catch (e) {
        console.error(`Error parsing frontmatter in ${filePath}:`, e.message);
      }
    }
  }
});

// 2. Find all agent files and check for references
const agents = [];
const agentFiles = fs.readdirSync(agentsDir, { withFileTypes: true });
for (const file of agentFiles) {
  if (file.isFile() && file.name.endsWith('.md')) {
    const filePath = path.join(agentsDir, file.name);
    const content = fs.readFileSync(filePath, 'utf8');
    const agentName = file.name.replace('.md', '');
    
    agents.push({ name: agentName, content: content });
    
    // Check for references to skills
    for (const skill of skills) {
      const ref = `@${skill.id}`;
      if (content.includes(ref)) {
        skill.referenced_by.push(agentName);
        skill.orphaned = false;
      }
    }
    
    // Check for unresolved refs (strings starting with @nezam- that are not in skills)
    const matches = content.match(/@nezam-[a-zA-Z0-9-]+/g);
    if (matches) {
      for (const match of matches) {
        const id = match.substring(1); // remove @
        const skillExists = skills.some(s => s.id === id);
        if (!skillExists && !unresolvedSkillRefs.includes(id)) {
          unresolvedSkillRefs.push(id);
        }
      }
    }
  }
}

// Populate orphaned skills list
for (const skill of skills) {
  if (skill.orphaned) {
    orphanedSkills.push(skill.id);
  }
}

const output = {
  generated: new Date().toISOString(),
  skills: skills,
  orphaned_skills: orphanedSkills,
  unresolved_skill_refs: unresolvedSkillRefs
};

fs.writeFileSync(registryPath, JSON.stringify(output, null, 2));

console.log(`[skills-registry] ${skills.length} skills, ${orphanedSkills.length} orphaned, ${unresolvedSkillRefs.length} unresolved refs`);

if (orphanedSkills.length > 0 || unresolvedSkillRefs.length > 0) {
  console.error('Orphaned skills or unresolved refs found! (Warning only)');
  process.exit(0);
} else {
  process.exit(0);
}

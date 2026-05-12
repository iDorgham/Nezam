const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const skillsDir = path.join(__dirname, '../.cursor/skills');
const agentsDir = path.join(__dirname, '../.cursor/agents');
const registryPath = path.join(__dirname, '../.cursor/state/skills-registry.json');

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
  if (path.basename(filePath) === 'SKILL.md') {
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/^---([\s\S]*?)---/);
    if (match) {
      try {
        const frontmatter = yaml.load(match[1]);
        const id = frontmatter.skill || frontmatter.name;
        const version = frontmatter.version || '0.0.0';
        
        if (id) {
          skills.push({
            path: path.relative(path.join(__dirname, '..'), filePath),
            id: id,
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
  console.error('Orphaned skills or unresolved refs found!');
  process.exit(1);
} else {
  process.exit(0);
}

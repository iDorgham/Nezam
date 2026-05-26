const fs = require('fs');
const path = require('path');

const skillsDir = path.resolve(__dirname, '../../.cursor/skills');

function toTitleCase(str) {
  return str
    .split(/[-_ ]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function cleanSkillName(nameVal, skillId) {
  if (!nameVal) {
    const baseId = skillId.replace(/^nezam-/, '');
    return toTitleCase(baseId);
  }
  
  let cleaned = nameVal.replace(/['"]/g, '').trim();
  
  while (cleaned.toLowerCase().startsWith('nezam-') || cleaned.startsWith(' ')) {
    cleaned = cleaned.replace(/^nezam-\s*/i, '').trim();
  }
  
  if (!cleaned || cleaned.toLowerCase() === skillId.toLowerCase().replace(/^nezam-/, '')) {
    const baseId = skillId.replace(/^nezam-/, '');
    return toTitleCase(baseId);
  }
  
  if (cleaned.includes('-') && !cleaned.includes(' ')) {
    return toTitleCase(cleaned);
  }
  
  return cleaned;
}

function runFix() {
  let processedCount = 0;
  
  const categories = fs.readdirSync(skillsDir);
  for (const cat of categories) {
    const catPath = path.join(skillsDir, cat);
    if (!fs.lstatSync(catPath).isDirectory()) continue;
    
    const skillDirs = fs.readdirSync(catPath);
    for (let skillDir of skillDirs) {
      let skillPath = path.join(catPath, skillDir);
      if (!fs.lstatSync(skillPath).isDirectory()) continue;
      
      const canonicalId = skillDir.startsWith('nezam-') ? skillDir : `nezam-${skillDir}`;
      
      if (skillDir !== canonicalId) {
        const newSkillPath = path.join(catPath, canonicalId);
        if (fs.existsSync(newSkillPath)) {
          console.log(`[fix-skills] Merging duplicate directory ${skillPath} -> ${newSkillPath}`);
          fs.rmSync(skillPath, { recursive: true, force: true });
          skillPath = newSkillPath;
        } else {
          fs.renameSync(skillPath, newSkillPath);
          console.log(`[fix-skills] Renamed directory: ${skillDir} -> ${canonicalId}`);
          skillPath = newSkillPath;
        }
        skillDir = canonicalId;
      }
      
      const skillMdPath = path.join(skillPath, 'SKILL.md');
      if (fs.existsSync(skillMdPath)) {
        let content = fs.readFileSync(skillMdPath, 'utf8');
        const match = content.match(/^---([\s\S]*?)---/);
        if (match) {
          const frontmatter = match[1];
          
          const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
          const existingName = nameMatch ? nameMatch[1].trim() : null;
          
          const cleanName = cleanSkillName(existingName, canonicalId);
          
          const lines = frontmatter.split('\n');
          const newLines = [];
          const writtenKeys = new Set();
          
          newLines.push(`skill_id: ${canonicalId}`);
          writtenKeys.add('skill_id');
          writtenKeys.add('id');
          
          newLines.push(`name: "${cleanName}"`);
          writtenKeys.add('name');
          
          for (let line of lines) {
            line = line.trim();
            if (!line) continue;
            
            const keyMatch = line.match(/^([a-zA-Z0-9_-]+):/);
            if (keyMatch) {
              const key = keyMatch[1];
              if (writtenKeys.has(key)) continue;
              
              newLines.push(line);
              writtenKeys.add(key);
            }
          }
          
          const newFrontmatter = `---\n${newLines.join('\n')}\n---`;
          const updatedContent = content.replace(/^---([\s\S]*?)---/, newFrontmatter);
          
          fs.writeFileSync(skillMdPath, updatedContent, 'utf8');
          processedCount++;
        }
      }
    }
  }
  
  console.log(`[fix-skills] Successfully processed ${processedCount} skill files.`);
}

runFix();

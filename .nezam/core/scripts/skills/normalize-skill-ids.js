const fs = require('fs');
const path = require('path');

const { getWorkspacePaths } = require('../utils/workspace-paths.js');

const repoRoot = process.cwd();
const wsConfig = getWorkspacePaths(repoRoot);

const skillsFolder = wsConfig.paths.skills_folder || '.cursor/skills';
const skillsDir = path.resolve(repoRoot, skillsFolder);

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

let renamedCount = 0;
let skippedCount = 0;

walkDir(skillsDir, (filePath) => {
  if (path.basename(filePath) === 'SKILL.md') {
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/^---([\s\S]*?)---/);
    if (match) {
      const frontmatterText = match[1];
      const nameMatch = frontmatterText.match(/^name:\s*(.+)$/m);
      if (nameMatch) {
        let currentName = nameMatch[1].trim();
        // Remove quotes if present
        currentName = currentName.replace(/^["']|["']$/g, '');
        
        if (!currentName.startsWith('nezam-')) {
          const newName = `nezam-${currentName}`;
          const updatedFrontmatter = frontmatterText.replace(/^name:\s*(.+)$/m, `name: "${newName}"`);
          const updatedContent = content.replace(/^---([\s\S]*?)---/, `---${updatedFrontmatter}---`);
          
          fs.writeFileSync(filePath, updatedContent);
          console.log(`[normalize-skill-ids] Renamed ${currentName} -> ${newName} in ${filePath}`);
          renamedCount++;
        } else {
          skippedCount++;
        }
      }
    }
  }
});

console.log(`[normalize-skill-ids] Renamed ${renamedCount} skills. Skipped ${skippedCount} (already prefixed).`);

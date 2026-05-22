const fs = require('fs');
const path = require('path');

const workspaceRoot = '/Users/Dorgham/Documents/Work/Devleopment/NEZAM';
const targetFile = path.join(workspaceRoot, '.nezam/memory/WORKSPACE_INDEX.md');

let content = fs.readFileSync(targetFile, 'utf8');

// Regex to find links like: ../../.cursor/skills/quality/testing-automation/SKILL.md
// and capture: [full link, relative prefix (e.g. ../..), category (e.g. quality), skill directory (e.g. testing-automation)]
const linkRegex = /(\[(\w+-\w+|\w+)\]\()?(\.\.\/\.\.\/\.cursor\/skills\/(\w+)\/([\w-]+)\/SKILL\.md)/g;

let updatedCount = 0;

content = content.replace(linkRegex, (match, labelGroup, label, linkPath, category, skillDir) => {
  // Let's see if the folder exists as is:
  const exactPath = path.resolve(path.dirname(targetFile), linkPath);
  if (fs.existsSync(exactPath)) {
    return match; // Already correct!
  }

  // Let's see if it exists with 'nezam-' prefix:
  const prefixedSkillDir = skillDir.startsWith('nezam-') ? skillDir : `nezam-${skillDir}`;
  const targetRelPath = `../../.cursor/skills/${category}/${prefixedSkillDir}/SKILL.md`;
  const resolvedPrefixedPath = path.resolve(path.dirname(targetFile), targetRelPath);

  if (fs.existsSync(resolvedPrefixedPath)) {
    updatedCount++;
    console.log(`[normalize] Found match for ${skillDir}: Renamed to ${prefixedSkillDir}`);
    // Reconstruct the link
    if (labelGroup) {
      return `[${label}](${targetRelPath})`;
    } else {
      // If it is just a link without labelGroup captured (e.g. `[name](path)`)
      // Wait, let's look at the match and manually replace the path.
      return match.replace(linkPath, targetRelPath);
    }
  } else {
    // If it doesn't exist either way, maybe try system or other category or just design-tokens:
    if (skillDir === 'pro-design-tokens') {
      const fixedPath = `../../.cursor/skills/design/nezam-design-tokens/SKILL.md`;
      if (fs.existsSync(path.resolve(path.dirname(targetFile), fixedPath))) {
        updatedCount++;
        console.log(`[normalize] Remapped pro-design-tokens to nezam-design-tokens`);
        return match.replace(linkPath, fixedPath);
      }
    } else if (skillDir === 'motion-3d-progressive') {
      const fixedPath = `../../.cursor/skills/design/nezam-motion-3d/SKILL.md`;
      if (fs.existsSync(path.resolve(path.dirname(targetFile), fixedPath))) {
        updatedCount++;
        console.log(`[normalize] Remapped motion-3d-progressive to nezam-motion-3d`);
        return match.replace(linkPath, fixedPath);
      }
    } else if (skillDir === 'strategic-planning') {
      // Sometimes it is [nezam-strategic-planning](../../.cursor/skills/system/strategic-planning/SKILL.md)
      // and label is 'nezam-strategic-planning', skillDir is 'strategic-planning'.
      const fixedPath = `../../.cursor/skills/system/nezam-strategic-planning/SKILL.md`;
      if (fs.existsSync(path.resolve(path.dirname(targetFile), fixedPath))) {
        updatedCount++;
        console.log(`[normalize] Remapped strategic-planning to nezam-strategic-planning`);
        return match.replace(linkPath, fixedPath);
      }
    }
    
    console.log(`[warn] Could not resolve skill folder for ${skillDir} in category ${category}`);
    return match;
  }
});

fs.writeFileSync(targetFile, content, 'utf8');
console.log(`Successfully updated ${updatedCount} skill links in WORKSPACE_INDEX.md!`);

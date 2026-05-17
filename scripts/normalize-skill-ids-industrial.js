const fs = require('fs');
const path = require('path');

const skillsRoot = path.join(__dirname, '..', '.cursor', 'skills');

function walk(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (file === 'SKILL.md') {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // skill_id normalization (avoid double nezam-)
            content = content.replace(/skill_id:\s*"?(?!nezam-)([^"\n]*)"?/g, 'skill_id: "nezam-$1"');
            
            // name normalization (avoid double nezam-)
            content = content.replace(/name:\s*"?(?!nezam-)([^"\n]*)"?/g, 'name: "nezam-$1"');

            fs.writeFileSync(fullPath, content, 'utf8');
        }
    });
}

try {
    walk(skillsRoot);
    console.log('[normalize-skill-ids] Skills normalized via recursive walk.');
} catch (e) {
    console.error(e);
    process.exit(1);
}

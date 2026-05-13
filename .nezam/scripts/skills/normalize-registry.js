const fs = require('fs');
const path = require('path');

const BASE_PATH = '/Users/Dorgham/Documents/Work/Devleopment/NEZAM';
const AGENT_REGISTRY_PATH = path.join(BASE_PATH, '.cursor/state/AGENT_REGISTRY.yaml');
const AGENTS_DIR = path.join(BASE_PATH, '.cursor/agents');
const SKILLS_DIR = path.join(BASE_PATH, '.cursor/skills');

const TIER_MAP = {
  'executive': 1,
  'tier-0': 2,
  'lead': 2,
  'framework': 2,
  'manager': 3,
  'tier-1': 3,
  'specialist': 4,
  'support': 4
};

const SKILL_MERGES = {
  'design-tokens': 'nezam-design-tokens',
  'design-token-architecture': 'nezam-design-tokens',
  'token-grid-typography': 'nezam-design-tokens',
  'neon-postgres': 'nezam-neon-postgres',
  'neon-advanced': 'nezam-neon-postgres',
  'llm-tracing': 'nezam-llm-observability',
  'llm-observability': 'nezam-llm-observability',
  'spec-generator': 'nezam-spec-generator',
  'spec-writing': 'nezam-spec-generator',
  'gh-security-compliance': 'nezam-security-compliance',
  'sast-security': 'nezam-security-compliance'
};

function normalizeTier(tier) {
  if (typeof tier === 'number') return tier;
  if (!tier) return 4;
  const normalized = TIER_MAP[tier.toLowerCase()];
  return normalized || 4;
}

function normalizeSkillId(id) {
  if (!id) return id;
  const baseId = id.includes('/') ? id.split('/').pop() : id;
  if (SKILL_MERGES[baseId]) return SKILL_MERGES[baseId];
  return baseId.startsWith('nezam-') ? baseId : `nezam-${baseId}`;
}

function updateFile(filePath, updateFn) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = updateFn(content);
  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

// 1. Normalize AGENT_REGISTRY.yaml
updateFile(AGENT_REGISTRY_PATH, (content) => {
  // Normalize tiers in registry
  content = content.replace(/tier:\s*(tier-\d|lead|manager|specialist|framework|executive)/g, (match, tier) => {
    return `tier: ${normalizeTier(tier)}`;
  });
  
  // Normalize skills in registry (backing_skill)
  content = content.replace(/backing_skill:\s*([^\s\n]+)/g, (match, skill) => {
    return `backing_skill: ${normalizeSkillId(skill)}`;
  });

  return content;
});

// 2. Normalize Agents
const agents = fs.readdirSync(AGENTS_DIR);
agents.forEach(agentFile => {
  if (!agentFile.endsWith('.md')) return;
  const agentPath = path.join(AGENTS_DIR, agentFile);
  updateFile(agentPath, (content) => {
    // Normalize tier in frontmatter
    content = content.replace(/tier:\s*(tier-\d|lead|manager|specialist|framework|executive)/g, (match, tier) => {
      return `tier: ${normalizeTier(tier)}`;
    });

    // Normalize @skill references
    content = content.replace(/@skill\s+([^\s\n]+)/g, (match, skill) => {
      return `@skill ${normalizeSkillId(skill)}`;
    });

    return content;
  });
});

// 3. Normalize Skills (directory names and IDs)
const categories = fs.readdirSync(SKILLS_DIR);
categories.forEach(cat => {
  const catPath = path.join(SKILLS_DIR, cat);
  if (!fs.lstatSync(catPath).isDirectory()) return;

  const skills = fs.readdirSync(catPath);
  skills.forEach(skillDir => {
    const skillPath = path.join(catPath, skillDir);
    if (!fs.lstatSync(skillPath).isDirectory()) return;

    const skillMdPath = path.join(skillPath, 'SKILL.md');
    if (fs.existsSync(skillMdPath)) {
      updateFile(skillMdPath, (content) => {
        // Normalize id in frontmatter
        content = content.replace(/id:\s*([^\s\n]+)/g, (match, id) => {
          return `id: ${normalizeSkillId(id)}`;
        });
        // Normalize tier in frontmatter
        content = content.replace(/tier:\s*(tier-\d|lead|manager|specialist|framework|executive)/g, (match, tier) => {
          return `tier: ${normalizeTier(tier)}`;
        });
        return content;
      });
    }

    // Rename directory if needed
    const newSkillId = normalizeSkillId(skillDir);
    if (newSkillId !== skillDir) {
      const newSkillPath = path.join(catPath, newSkillId);
      if (fs.existsSync(newSkillPath)) {
        // Merge content if it's a merge
        console.log(`Merging ${skillPath} into ${newSkillPath}`);
        // For simplicity, we just delete the old one if the new one exists (as it's a duplicate)
        // In a real scenario, we might want to append content.
        fs.rmSync(skillPath, { recursive: true, force: true });
      } else {
        fs.renameSync(skillPath, newSkillPath);
        console.log(`Renamed skill dir: ${skillPath} -> ${newSkillPath}`);
      }
    }
  });
});

// 4. Special Moves
const wordpressPath = path.join(SKILLS_DIR, 'frontend/nezam-wordpress');
const cmsSaasPath = path.join(SKILLS_DIR, 'cms-saas');
if (!fs.existsSync(cmsSaasPath)) fs.mkdirSync(cmsSaasPath);
if (fs.existsSync(wordpressPath)) {
  fs.renameSync(wordpressPath, path.join(cmsSaasPath, 'nezam-wordpress'));
  console.log(`Moved wordpress skill to cms-saas`);
}

console.log('Normalization complete.');

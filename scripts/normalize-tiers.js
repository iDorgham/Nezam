const fs = require('fs');
const path = require('path');

const registryPath = path.join(__dirname, '..', '.cursor', 'state', 'AGENT_REGISTRY.yaml');

try {
    let content = fs.readFileSync(registryPath, 'utf8');

    // Simple replacement for tiers
    content = content.replace(/tier:\s*"?lead"?/g, 'tier: 1');
    content = content.replace(/tier:\s*"?executive"?/g, 'tier: 1');
    content = content.replace(/tier:\s*"?manager"?/g, 'tier: 2');
    content = content.replace(/tier:\s*"?specialist"?/g, 'tier: 3');
    content = content.replace(/tier:\s*"?tier-0"?/g, 'tier: 1');

    fs.writeFileSync(registryPath, content, 'utf8');
    console.log('[normalize-tiers] Tiers normalized via regex.');
} catch (e) {
    console.error(e);
    process.exit(1);
}

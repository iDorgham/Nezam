#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "../../../..");
const agentsDir = path.join(repoRoot, ".cursor", "agents");
const registryPath = path.join(repoRoot, ".cursor", "state", "AGENT_REGISTRY.yaml");

if (!fs.existsSync(registryPath)) {
  console.error("Registry not found at:", registryPath);
  process.exit(1);
}

const registryContent = fs.readFileSync(registryPath, "utf8");
let errors = 0;

const agentFiles = fs.readdirSync(agentsDir).filter(f => f.endsWith(".md"));

agentFiles.forEach(file => {
  const content = fs.readFileSync(path.join(agentsDir, file), "utf8");
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  
  if (fmMatch) {
    const fm = fmMatch[1];
    const agentId = file.replace(".md", "");
    
    // Find tier in agent file frontmatter
    const agentTierMatch = fm.match(/^tier:\s*(.*)$/m);
    if (!agentTierMatch) return;
    const agentTier = agentTierMatch[1].trim();
    
    // Find tier in registry (very simple regex for the catalog entry)
    const registryEntryRegex = new RegExp(`${agentId}:[\\s\\S]*?tier:\\s*(.*)`, "m");
    const registryMatch = registryContent.match(registryEntryRegex);
    
    if (registryMatch) {
      const registryTier = registryMatch[1].trim();
      
      if (registryTier !== agentTier) {
        console.error(`❌ Tier mismatch for ${agentId}: Registry=${registryTier}, AgentFile=${agentTier}`);
        errors++;
      }
    }
  }
});

if (errors > 0) {
  console.error(`\nFound ${errors} tier parity errors.`);
  process.exit(1);
}

console.log("✅ Agent tier parity check passed.");
process.exit(0);

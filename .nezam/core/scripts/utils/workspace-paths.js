#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

/**
 * Parses a simple flat YAML file into paths and hardlocks configurations dynamically.
 * Zero external dependencies. Extremely portable for CI/CD environments.
 * 
 * @param {string} [repoRoot=process.cwd()] 
 * @returns {{ paths: Record<string, string>, hardlocks: Record<string, string> }}
 */
function getWorkspacePaths(repoRoot = process.cwd()) {
  const yamlPath = path.join(repoRoot, ".nezam", "workspace.paths.yaml");
  if (!fs.existsSync(yamlPath)) {
    throw new Error(`NEZAM Canonical Workspace Paths Configuration not found at: ${yamlPath}`);
  }

  const content = fs.readFileSync(yamlPath, "utf8");
  const config = { paths: {}, hardlocks: {} };
  let currentSection = null;

  for (let line of content.split("\n")) {
    const rawLine = line;
    line = line.trim();
    if (!line || line.startsWith("#")) continue;

    // Detect top-level sections
    if (line.startsWith("paths:")) {
      currentSection = "paths";
      continue;
    } else if (line.startsWith("hardlocks:")) {
      currentSection = "hardlocks";
      continue;
    } else if (line.endsWith(":") && !line.includes(" ")) {
      currentSection = null;
      continue;
    }

    // Extract key-value pairs
    if (currentSection && line.includes(":")) {
      const colonIdx = line.indexOf(":");
      const key = line.slice(0, colonIdx).trim();
      let val = line.slice(colonIdx + 1).trim();

      // Remove comments (trailing)
      const commentIdx = val.indexOf("#");
      if (commentIdx !== -1) {
        val = val.slice(0, commentIdx).trim();
      }

      // Remove surrounding quotes
      val = val.replace(/^["']|["']$/g, "").trim();
      config[currentSection][key] = val;
    }
  }

  return config;
}

module.exports = { getWorkspacePaths };

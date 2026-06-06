import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const registryPath = path.resolve(__dirname, '../.nezam/templates/wireframe-server/block_registry.json');

console.log(`Validating block registry at: ${registryPath}`);

if (!fs.existsSync(registryPath)) {
  console.error(`Error: block_registry.json not found at ${registryPath}`);
  process.exit(1);
}

try {
  const fileContent = fs.readFileSync(registryPath, 'utf8');
  const registry = JSON.parse(fileContent);

  if (!registry.blocks || typeof registry.blocks !== 'object') {
    console.error('Error: registry.blocks is missing or not an object');
    process.exit(1);
  }

  let hasErrors = false;

  for (const [category, blocks] of Object.entries(registry.blocks)) {
    if (!Array.isArray(blocks)) {
      console.error(`Error: Category "${category}" is not an array`);
      hasErrors = true;
      continue;
    }

    blocks.forEach((block, index) => {
      const blockId = `${category}[${index}] (${block.type || 'unknown type'})`;

      if (!block.name || typeof block.name !== 'string' || block.name.trim() === '') {
        console.error(`Error in ${blockId}: "name" is required and must be a non-empty string`);
        hasErrors = true;
      }

      if (!block.type || typeof block.type !== 'string' || block.type.trim() === '') {
        console.error(`Error in ${blockId}: "type" is required and must be a non-empty string`);
        hasErrors = true;
      }

      if (!block.description || typeof block.description !== 'string' || block.description.trim() === '') {
        console.error(`Error in ${blockId}: "description" is required and must be a non-empty string`);
        hasErrors = true;
      }

      if (!Array.isArray(block.canvas_modes) || block.canvas_modes.length === 0) {
        console.error(`Error in ${blockId}: "canvas_modes" must be a non-empty array`);
        hasErrors = true;
      }
    });
  }

  if (hasErrors) {
    console.error('Block registry validation failed.');
    process.exit(1);
  } else {
    console.log('Block registry validation passed successfully.');
    process.exit(0);
  }
} catch (error) {
  console.error('Failed to parse or validate block registry:', error);
  process.exit(1);
}

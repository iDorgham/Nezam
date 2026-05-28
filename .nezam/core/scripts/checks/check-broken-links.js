const fs = require('fs');
const path = require('path');

const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  '.DS_Store',
  'dist',
  'build',
  '.remember',
  '.corepack-home',
  '.next',
  '.claude',
  '.codex',
  '.gemini',
  '.opencode',
  '.qwen',
  '.antigravity',
  '.antigravitycli',
  '.kilocode',
  '.kiro',
  '.specstory',
  '.vscode',
  '.windsurf',
  '.agents',
  '.cursor',
  'workspace',
  'templates',
  'design',
  'archive',
  'plans',
  'reports',
  'wiki',
  'prd'
]);

const EXTENSIONS = new Set(['.md', '.mdc']);

let totalFilesChecked = 0;
let brokenLinksCount = 0;
const brokenLinks = [];

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!IGNORED_DIRS.has(file)) {
        walk(fullPath);
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (EXTENSIONS.has(ext)) {
        checkFile(fullPath);
      }
    }
  }
}

function checkFile(filePath) {
  totalFilesChecked++;
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // Regex patterns
  const mdLinkRegex = /\[([^\]]*?)\]\((.*?)\)/g;
  const mdImgRegex = /!\[([^\]]*?)\]\((.*?)\)/g;
  const htmlLinkRegex = /<a\s+(?:[^>]*?\s+)?href=["'](.*?)["']/gi;
  const htmlImgRegex = /<img\s+(?:[^>]*?\s+)?src=["'](.*?)["']/gi;

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Check standard markdown links
    let match;
    while ((match = mdLinkRegex.exec(line)) !== null) {
      validateLink(match[2], filePath, lineNum, match[0]);
    }
    mdLinkRegex.lastIndex = 0;

    // Check markdown images
    while ((match = mdImgRegex.exec(line)) !== null) {
      validateLink(match[2], filePath, lineNum, match[0]);
    }
    mdImgRegex.lastIndex = 0;

    // Check HTML links
    while ((match = htmlLinkRegex.exec(line)) !== null) {
      validateLink(match[1], filePath, lineNum, match[0]);
    }
    htmlLinkRegex.lastIndex = 0;

    // Check HTML images
    while ((match = htmlImgRegex.exec(line)) !== null) {
      validateLink(match[1], filePath, lineNum, match[0]);
    }
    htmlImgRegex.lastIndex = 0;
  });
}

function validateLink(url, sourceFile, lineNum, originalText) {
  url = url.trim();
  if (!url) return;

  // Ignore remote protocols and local anchors
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('mailto:') ||
    url.startsWith('tel:') ||
    url.startsWith('sms:') ||
    url.startsWith('ftp:') ||
    url.startsWith('#') ||
    url.startsWith('javascript:')
  ) {
    return;
  }

  // Ignore dynamic onboarding directories (docs/plans/, docs/reports/, core/plans/, and core/reports/)
  if (
    url.includes('docs/plans/') ||
    url.includes('docs/reports/') ||
    url.includes('core/plans/') ||
    url.includes('core/reports/') ||
    url.includes('../plans/') ||
    url.includes('../reports/') ||
    url === 'docs/plans' ||
    url === 'docs/reports' ||
    url === 'docs/plans/' ||
    url === 'docs/reports/'
  ) {
    return;
  }

  // Strip anchor fragments
  const [cleanUrl] = url.split('#');
  if (!cleanUrl.trim()) return;

  let targetPath = cleanUrl.trim();

  // Handle file:// protocols
  if (targetPath.startsWith('file://')) {
    targetPath = targetPath.substring(7); // Strip 'file://'
    if (process.platform === 'win32' && targetPath.startsWith('/')) {
      targetPath = targetPath.substring(1);
    }
  }

  // Determine if it is absolute or relative
  let exists = false;
  let resolvedPath = '';

  if (path.isAbsolute(targetPath)) {
    resolvedPath = targetPath;
    exists = fs.existsSync(resolvedPath);
    if (!exists && !path.extname(resolvedPath)) {
      if (fs.existsSync(resolvedPath + '.md')) {
        exists = true;
        resolvedPath += '.md';
      } else if (fs.existsSync(resolvedPath + '.mdc')) {
        exists = true;
        resolvedPath += '.mdc';
      }
    }
  } else {
    resolvedPath = path.resolve(path.dirname(sourceFile), decodeURIComponent(targetPath));
    exists = fs.existsSync(resolvedPath);
    if (!exists && !path.extname(resolvedPath)) {
      if (fs.existsSync(resolvedPath + '.md')) {
        exists = true;
        resolvedPath += '.md';
      } else if (fs.existsSync(resolvedPath + '.mdc')) {
        exists = true;
        resolvedPath += '.mdc';
      }
    }
  }

  if (!exists) {
    brokenLinksCount++;
    brokenLinks.push({
      file: sourceFile,
      line: lineNum,
      linkText: originalText,
      url: url,
      resolved: resolvedPath
    });
  }
}

console.log('🔍 Starting Relative and Local Link Verification (focused on active source files)...');
try {
  walk('.');
  console.log(`\n📊 Verification Complete!`);
  console.log(`- Total markdown files scanned: ${totalFilesChecked}`);
  console.log(`- Broken links found: ${brokenLinksCount}`);

  if (brokenLinksCount > 0) {
    console.log('\n❌ Broken Links Report:');
    brokenLinks.forEach((item, idx) => {
      console.log(`[${idx + 1}] File: ${item.file}:${item.line}`);
      console.log(`    Link: ${item.linkText}`);
      console.log(`    URL:  ${item.url}`);
      console.log(`    Path: ${item.resolved}`);
    });
    process.exit(1);
  } else {
    console.log('\n✅ All local and relative links are verified and valid.');
    process.exit(0);
  }
} catch (error) {
  console.error('An error occurred during link scanning:', error);
  process.exit(1);
}

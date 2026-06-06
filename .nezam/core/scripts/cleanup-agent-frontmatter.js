const fs = require('fs')
const path = require('path')

const REPO_ROOT = path.resolve(__dirname, '..')
const AGENTS_DIR = path.join(REPO_ROOT, '.cursor/agents')

function cleanupAgents() {
  if (!fs.existsSync(AGENTS_DIR)) {
    console.error(`❌ Agents directory not found: ${AGENTS_DIR}`)
    return
  }

  const files = fs.readdirSync(AGENTS_DIR)
  let count = 0

  files.forEach(file => {
    if (!file.endsWith('.md') || file === 'README.md') return
    const filePath = path.join(AGENTS_DIR, file)
    let content = fs.readFileSync(filePath, 'utf8')

    // Find frontmatter
    const match = content.match(/^---([\s\S]*?)---/)
    if (match) {
      let fmText = match[1]
      const isCertified = fmText.match(/^certified:\s*true/m)

      if (!isCertified) {
        // Remove certified: false/provisional, last_eval_score, and changelog fields
        fmText = fmText
          .replace(/^certified:\s*.+$\n?/m, '')
          .replace(/^last_eval_score:\s*.+$\n?/m, '')
          .replace(/^changelog:[\s\S]*?(?=\n\w+:|\n---)/m, '')
          .replace(/^\s*\n/gm, '') // Clean up empty lines

        const updatedContent = content.replace(/^---([\s\S]*?)---/, `---${fmText}---`)
        fs.writeFileSync(filePath, updatedContent, 'utf8')
        count++
      }
    }
  })

  console.log(`✅ Cleaned up frontmatter in ${count} uncertified agent files.`)
}

cleanupAgents()

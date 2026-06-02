const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const specFile = process.argv[2]
if (!specFile) {
  console.error('❌ Missing SPEC.md file path argument.')
  process.exit(1)
}

function validateSpec() {
  if (!fs.existsSync(specFile)) {
    console.error(`❌ File not found: ${specFile}`)
    process.exit(1)
  }

  const content = fs.readFileSync(specFile, 'utf8')
  const match = content.match(/^---([\s\S]*?)---/)
  
  if (!match) {
    console.error(`❌ SPEC.md frontmatter not found in ${specFile}`)
    process.exit(1)
  }

  try {
    const data = yaml.load(match[1])
    
    // Validate spec_id format
    const specIdRegex = /^SPEC-[A-Z]+-[0-9]{3}(-v[0-9]+\.[0-9]+\.[0-9]+)?$/
    if (!data.spec_id || !specIdRegex.test(data.spec_id)) {
      console.error(`❌ SPEC.md Schema Violation in ${specFile}: "spec_id" missing or invalid format (got "${data.spec_id}")`)
      process.exit(1)
    }

    // Validate feature name
    if (!data.feature || typeof data.feature !== 'string') {
      console.error(`❌ SPEC.md Schema Violation in ${specFile}: "feature" missing or not a string`)
      process.exit(1)
    }

    // Validate acceptance criteria list
    if (!Array.isArray(data.acceptance_criteria) || data.acceptance_criteria.length === 0) {
      console.error(`❌ SPEC.md Schema Violation in ${specFile}: "acceptance_criteria" missing or empty`)
      process.exit(1)
    }

    const acIdRegex = /^AC-[0-9]{3}$/
    data.acceptance_criteria.forEach((ac, i) => {
      if (!ac.id || !acIdRegex.test(ac.id)) {
        console.error(`❌ SPEC.md Schema Violation in ${specFile}: acceptance_criteria[${i}].id missing or invalid format (got "${ac.id}")`)
        process.exit(1)
      }
      if (!ac.description || typeof ac.description !== 'string' || ac.description.length < 10) {
        console.error(`❌ SPEC.md Schema Violation in ${specFile}: acceptance_criteria[${i}].description missing or too short`)
        process.exit(1)
      }
    })

    console.log(`✅ SPEC.md validated: ${data.spec_id} - ${data.feature}`)
  } catch (e) {
    console.error(`❌ Error parsing SPEC.md yaml: ${e.message}`)
    process.exit(1)
  }
}

validateSpec()

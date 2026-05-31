/**
 * One-off refactor: topMenu + sidebarMenu → mainMenu + footerMenu (navmenu nodes).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/data/arch-profiles.ts')
let s = fs.readFileSync(file, 'utf8')

const menuDecl =
  /  const topMenu = p\('Top Navigation', '\/topnav-menu', rootApp\.id, 0, 'hidden', 'group', 'Menu', 'Top navigation menu'\)\n  const sidebarMenu = p\('Sidebar Navigation', '\/sidebar-menu', rootApp\.id, 1, 'hidden', 'group', 'Menu', 'Sidebar navigation menu'\)\n/g

const parts = s.split(/(?=function build\w+Profile\(\): ArchProfile \{)/)
let out = parts[0]

for (let i = 1; i < parts.length; i++) {
  let block = parts[i]
  const keyM = block.match(/const p = pageBuilder\('([^']+)'\)/)
  if (!keyM) {
    out += block
    continue
  }
  const key = keyM[1]

  if (!menuDecl.test(block)) {
    out += block
    continue
  }

  block = block.replace(
    menuDecl,
    `  const mainMenu = archMenu('${key}', rootApp.id, 'main', 0)\n  const footerMenu = archMenu('${key}', rootApp.id, 'footer', 1)\n`,
  )

  block = block.replace(/pages: \[rootApp, topMenu, sidebarMenu,/g, 'pages: [rootApp, mainMenu, footerMenu,')

  block = block.replace(/, sidebarMenu\.id,/g, ', mainMenu.id,')
  block = block.replace(/, topMenu\.id,/g, ', mainMenu.id,')

  block = block.replace(/sidebarMenu\.id/g, 'mainMenu.id')
  block = block.replace(/topMenu\.id/g, 'mainMenu.id')

  block = block.replace(
    /mainMenu\.id,(\s*\d+,\s*'footer')/g,
    'footerMenu.id,$1',
  )

  out += block
}

fs.writeFileSync(file, out)
console.log('refactored arch-profiles.ts')

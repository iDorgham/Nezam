export const BOX_CHARS = {
  topLeft: '┌',
  topRight: '┐',
  bottomLeft: '└',
  bottomRight: '┘',
  horizontal: '─',
  vertical: '│',
}

export function drawBox(title: string, width: number, height: number): string {
  const horizontal = BOX_CHARS.horizontal.repeat(width - 2)
  const top = BOX_CHARS.topLeft + title.padEnd(width - 2, BOX_CHARS.horizontal).substring(0, width - 2) + BOX_CHARS.topRight
  const bottom = BOX_CHARS.bottomLeft + horizontal + BOX_CHARS.bottomRight
  
  const lines = [top]
  for (let i = 0; i < height - 2; i++) {
    lines.push(BOX_CHARS.vertical + ' '.repeat(width - 2) + BOX_CHARS.vertical)
  }
  lines.push(bottom)
  
  return lines.join('\n')
}

export function drawTextInBox(text: string, width: number): string {
  const horizontal = BOX_CHARS.horizontal.repeat(width - 2)
  const top = BOX_CHARS.topLeft + horizontal + BOX_CHARS.topRight
  const bottom = BOX_CHARS.bottomLeft + horizontal + BOX_CHARS.bottomRight
  
  const lines = [top]
  const textLines = text.split('\n')
  
  for (const line of textLines) {
    const paddedLine = line.padEnd(width - 2, ' ').substring(0, width - 2)
    lines.push(BOX_CHARS.vertical + paddedLine + BOX_CHARS.vertical)
  }
  
  lines.push(bottom)
  return lines.join('\n')
}

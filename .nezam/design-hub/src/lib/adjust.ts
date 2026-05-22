import type { NodeStyle as ElementStyle } from '@/types'

/**
 * Translate a plain-language instruction into an element-style patch.
 * Powers the Inspector's offline "AI adjust" box.
 */
export function parseAdjust(
  prompt: string,
  kind: 'text' | 'section',
): { patch: Partial<ElementStyle>; summary: string } {
  const p = prompt.toLowerCase()
  const patch: Partial<ElementStyle> = {}
  const notes: string[] = []
  const has = (...words: string[]) => words.some((w) => p.includes(w))

  if (kind === 'text') {
    if (has('bigger', 'larger', 'huge', 'bold headline', 'grow')) {
      patch.fontScale = 1.35
      notes.push('larger text')
    }
    if (has('smaller', 'tiny', 'shrink', 'compact')) {
      patch.fontScale = 0.8
      notes.push('smaller text')
    }
    if (has('bold', 'bolder', 'heavy', 'strong', 'punch')) {
      patch.weight = 700
      notes.push('bold weight')
    }
    if (has('light', 'thin', 'delicate', 'subtle')) {
      patch.weight = 400
      notes.push('lighter weight')
    }
    if (has('center', 'centre', 'middle')) {
      patch.align = 'center'
      notes.push('centered')
    } else if (has('justify', 'justified')) {
      patch.align = 'justify'
      notes.push('justified')
    } else if (has('right', 'end')) {
      patch.align = 'end'
      notes.push('end-aligned')
    } else if (has('left', 'start')) {
      patch.align = 'start'
      notes.push('start-aligned')
    }
    if (has('airy', 'spaced', 'wide spacing', 'breathe', 'tracking')) {
      patch.letterSpacing = 0.08
      notes.push('wider tracking')
    }
    if (has('tight', 'condensed', 'narrow')) {
      patch.letterSpacing = -0.03
      notes.push('tighter tracking')
    }
    if (has('tall', 'roomy', 'more line', 'leading', 'relaxed')) {
      patch.lineHeight = 2
      notes.push('taller line height')
    }
    if (has('dense', 'snug', 'less line')) {
      patch.lineHeight = 1.15
      notes.push('snug line height')
    }
  } else {
    if (has('two column', '2 column', 'split in two', 'halves')) {
      patch.columns = 2
      notes.push('2 columns')
    } else if (has('three column', '3 column', 'thirds')) {
      patch.columns = 3
      notes.push('3 columns')
    } else if (has('four column', '4 column')) {
      patch.columns = 4
      notes.push('4 columns')
    } else if (has('five column', '5 column')) {
      patch.columns = 5
      notes.push('5 columns')
    } else if (has('one column', 'single column', 'one wide', 'full width')) {
      patch.columns = 1
      notes.push('single column')
    }
    if (has('more padding', 'roomy', 'spacious', 'breathing', 'pad it')) {
      patch.padding = 40
      notes.push('more padding')
    }
    if (has('less padding', 'tight', 'compact', 'snug')) {
      patch.padding = 6
      notes.push('tighter padding')
    }
    if (has('more margin', 'separate', 'gap')) {
      patch.margin = 32
      notes.push('more margin')
    }
    if (has('gradient')) {
      patch.bgFill = 'gradient'
      notes.push('gradient fill')
    }
    if (has('image', 'photo', 'picture')) {
      patch.bgFill = 'image'
      notes.push('image fill')
    }
    const colors: Array<[string[], string]> = [
      [['blue', 'ocean'], '#2563eb'],
      [['green', 'mint', 'forest'], '#16a34a'],
      [['red', 'crimson'], '#dc2626'],
      [['purple', 'violet'], '#7c3aed'],
      [['amber', 'gold', 'warm', 'orange'], '#d97706'],
      [['pink', 'rose'], '#db2777'],
      [['dark', 'black', 'ink'], '#0f1117'],
      [['white', 'light'], '#f7f8fa'],
    ]
    for (const [words, hex] of colors) {
      if (has(...words)) {
        patch.bg = hex
        if (!patch.bgFill) patch.bgFill = 'solid'
        notes.push(`${words[0]} background`)
        break
      }
    }
  }

  return {
    patch,
    summary: notes.length ? `Applied: ${notes.join(', ')}.` : '',
  }
}

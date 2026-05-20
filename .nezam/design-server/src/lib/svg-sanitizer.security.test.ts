import { describe, expect, it } from 'vitest'
import { containsTextElement } from './svg-sanitizer'

// T-Q-006 — Adversarial corpus against the SVG `<text>` hardlock.
// Each section maps to an attacker pattern documented in the test report.
// The contract is fail-closed: ambiguous / malformed inputs that *could*
// render text in a downstream parser must reject. Inputs that are unambiguously
// not a `<text>` element (encoded entities, different tag names, comments,
// CDATA) must pass through to give legitimate SVG payloads a way in.

describe('T-Q-006 · case mutation must reject', () => {
  it.each([
    '<svg><TEXT/></svg>',
    '<svg><Text/></svg>',
    '<svg><TexT>x</TexT></svg>',
    '<svg><tExT>x</tExT></svg>',
  ])('rejects %s', (svg) => {
    expect(containsTextElement(svg)).toBe(true)
  })
})

describe('T-Q-006 · whitespace tricks must reject', () => {
  it.each([
    '<svg><text  /></svg>',
    '<svg><text\n/></svg>',
    '<svg><text\t/></svg>',
    '<svg><text   x="0"   y="0">hi</text></svg>',
  ])('rejects %s', (svg) => {
    expect(containsTextElement(svg)).toBe(true)
  })
})

describe('T-Q-006 · namespace abuse must reject', () => {
  it.each([
    '<svg xmlns:xlink="..."><xlink:text/></svg>',
    '<svg xmlns:a="..."><a:text/></svg>',
    '<svg xmlns:custom-ns="..."><custom-ns:text/></svg>',
    '<svg><SVG:Text/></svg>',
  ])('rejects %s', (svg) => {
    expect(containsTextElement(svg)).toBe(true)
  })
})

describe('T-Q-006 · encoding bypass must accept (no real element)', () => {
  it.each([
    '<svg><desc>&lt;text&gt;hi&lt;/text&gt;</desc></svg>',
    '<svg><desc>&#60;text&#62;hi&#60;/text&#62;</desc></svg>',
    '<svg><desc>&#x3C;text&#x3E;hi&#x3C;/text&#x3E;</desc></svg>',
  ])('accepts %s', (svg) => {
    expect(containsTextElement(svg)).toBe(false)
  })
})

describe('T-Q-006 · comment / CDATA boundary leaks must reject', () => {
  it('rejects when the comment closes early and a real <text> follows', () => {
    expect(containsTextElement('<svg><!-- ok --><text/></svg>')).toBe(true)
  })

  it('rejects when CDATA closes early and a real <text> follows', () => {
    expect(containsTextElement('<svg><![CDATA[ok]]><text/></svg>')).toBe(true)
  })

  it('rejects nested-comment-looking payloads where outer comment ends early', () => {
    // XML does not allow nested comments. Browsers stop at the first `-->`,
    // so the trailing `<text/> --> -->` becomes a real element.
    expect(
      containsTextElement('<svg><!-- safe --> <text/> --> --></svg>'),
    ).toBe(true)
  })

  it('rejects mixed comment + cdata sandwich that leaves a <text> tail', () => {
    expect(
      containsTextElement('<svg><!-- a --><![CDATA[b]]><text/></svg>'),
    ).toBe(true)
  })
})

describe('T-Q-006 · tag disambiguation must accept', () => {
  it.each([
    '<svg><textPath href="#p">x</textPath></svg>',
    '<svg><textarea/></svg>',
    '<svg><g text="hello"/></svg>',
    '<svg><g title="x" data-text="y"/></svg>',
  ])('accepts %s (different element / attribute name)', (svg) => {
    expect(containsTextElement(svg)).toBe(false)
  })
})

describe('T-Q-006 · attribute-value leaks must reject (fail-closed)', () => {
  it('rejects literal `<text>` substring inside a malformed attribute value', () => {
    // Strictly invalid XML, but a permissive parser might recover and render
    // `<text>` as a real element. Reject rather than guess the parser.
    expect(
      containsTextElement('<svg><g title="<text>foo"/></svg>'),
    ).toBe(true)
  })

  it('rejects unbalanced quote that exposes a `<text/>` to the parser', () => {
    expect(
      containsTextElement('<svg><g title=" "><text/></g></svg>'),
    ).toBe(true)
  })
})

describe('T-Q-006 · control-character injection must reject', () => {
  it('rejects `<text>` with a NUL byte interleaved', () => {
    // Some parsers tolerate NUL bytes inside tag names and still render text.
    expect(containsTextElement('<svg><te\x00xt/></svg>')).toBe(true)
  })

  it('rejects `<text>` with a zero-width space interleaved', () => {
    expect(containsTextElement('<svg><te​xt/></svg>')).toBe(true)
  })

  it('rejects `<text>` with a vertical tab interleaved', () => {
    expect(containsTextElement('<svg><text/></svg>')).toBe(true)
  })
})

describe('T-Q-006 · polyglot wrappers must reject', () => {
  it.each([
    '<html><body><svg><text/></svg></body></html>',
    '<?xml version="1.0"?><svg><text/></svg>',
    '<!DOCTYPE svg><svg><text>x</text></svg>',
  ])('rejects %s', (svg) => {
    expect(containsTextElement(svg)).toBe(true)
  })
})

import { describe, expect, it } from 'vitest'
import { containsTextElement } from './svg-sanitizer'

// F-008 §11 (ARCHITECTURE.md) — Recursive <text> detection is the SVG hardlock.
// "Reject on ANY text node" — at any depth, behind any namespace prefix, with
// any case. Comments, CDATA, and attribute strings that *contain* the literal
// "<text>" must NOT trigger a false positive.

describe('containsTextElement · positive detection (recursive)', () => {
  it('returns true for a <text> child at the SVG root', () => {
    expect(containsTextElement('<svg><text>hello</text></svg>')).toBe(true)
  })

  it('returns true when <text> is nested inside a <g> group', () => {
    expect(
      containsTextElement('<svg><g><text>nested</text></g></svg>'),
    ).toBe(true)
  })

  it('returns true when <text> is deeply nested', () => {
    expect(
      containsTextElement(
        '<svg><g><g><g><text x="0" y="0">deep</text></g></g></g></svg>',
      ),
    ).toBe(true)
  })

  it('returns true for a self-closing <text/>', () => {
    expect(containsTextElement('<svg><text/></svg>')).toBe(true)
  })

  it('matches uppercase <TEXT>', () => {
    expect(containsTextElement('<svg><TEXT>x</TEXT></svg>')).toBe(true)
  })

  it('matches namespace-prefixed <svg:text>', () => {
    expect(
      containsTextElement('<svg xmlns:svg="..."><svg:text>x</svg:text></svg>'),
    ).toBe(true)
  })
})

describe('containsTextElement · negative detection', () => {
  it('returns false for an empty <svg/>', () => {
    expect(containsTextElement('<svg></svg>')).toBe(false)
  })

  it('returns false for an SVG with only non-text shapes', () => {
    expect(
      containsTextElement('<svg><circle cx="50" cy="50" r="40"/></svg>'),
    ).toBe(false)
  })

  it('does not match <textPath> (different element name)', () => {
    expect(
      containsTextElement('<svg><textPath href="#p">x</textPath></svg>'),
    ).toBe(false)
  })

  it('does not false-positive on the literal string "<text>" inside an XML comment', () => {
    expect(containsTextElement('<svg><!-- <text>x</text> --></svg>')).toBe(false)
  })

  it('does not false-positive on the literal string "<text>" inside CDATA', () => {
    expect(
      containsTextElement('<svg><![CDATA[<text>x</text>]]></svg>'),
    ).toBe(false)
  })

  it('does not false-positive on the literal string "<text>" inside an attribute value', () => {
    expect(
      containsTextElement('<svg><desc title="see &lt;text&gt; below">y</desc></svg>'),
    ).toBe(false)
  })
})

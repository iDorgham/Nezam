// F-008 §11 / ARCHITECTURE.md §11 — SVG hardlock: reject any <text> element
// at any depth, in any namespace, in any case. Pure string-based scanner so
// the function runs in the API route's Node runtime with zero dependencies.
//
// Pipeline (run on a scanning *copy* — the original bytes are untouched):
//   1. Strip invisible / control characters that some parsers tolerate
//      inside tag names (NUL bytes, zero-width spaces, bidi marks, etc.).
//      Keeps legitimate XML whitespace (\t \n \r \f).
//   2. Strip XML comments — they render nothing.
//   3. Strip CDATA sections — same.
//   4. Match `<text>` (with optional namespace prefix) followed by a tag
//      terminator. The lookahead prevents `<textPath>` / `<textarea>` from
//      false-positive.

// Built via `new RegExp` because raw control characters in a /…/ literal
// confuse the source-file parser. \t \n \f \r are kept; everything else in
// the C0 range, DEL, the zero-width / bidi block, and the BOM is dropped.
const INVISIBLE = new RegExp(
  '[\\u0000-\\u0008\\u000B\\u000E-\\u001F\\u007F\\u200B-\\u200F\\u2028-\\u202E\\u2060-\\u206F\\uFEFF]',
  'g',
)
const XML_COMMENT = /<!--[\s\S]*?-->/g
const XML_CDATA   = /<!\[CDATA\[[\s\S]*?\]\]>/g
// Tag opener: `<`, an optional `namespace:` prefix, the local name `text`,
// then a tag terminator (whitespace, `>`, or `/`). The terminator lookahead
// keeps `<textPath>` and `<textarea>` from matching even though they share
// the `text` prefix.
const TEXT_TAG = /<(?:[a-z][\w-]*:)?text(?=[\s/>])/i

export function containsTextElement(svg: string): boolean {
  const stripped = svg
    .replace(INVISIBLE,    '')
    .replace(XML_COMMENT,  '')
    .replace(XML_CDATA,    '')
  return TEXT_TAG.test(stripped)
}

---
created: "2026-05-10"
version: "1.0.0"
owner: PM-01
---

# NEZAM Wiki (site shell)

Markdown pages in this folder are readable on GitHub as normal files. For a **custom sidebar and footer**, this directory includes a [Docsify](https://docsify.js.org/) shell:

| File | Role |
|------|------|
| [`index.html`](index.html) | Docsify app, theme, search |
| [`_sidebar.md`](_sidebar.md) | Left navigation |
| [`_footer.md`](_footer.md) | Global footer on every page |

## Preview locally

From the repository root:

```bash
pnpm docs:wiki
```

Then open **http://127.0.0.1:3040** (or the URL printed in the terminal).

## Publish (optional)

To host on **GitHub Pages** from `/docs`, enable Pages with source `main` + `/docs` and set the site subpath if needed, or publish only `docs/wiki/` as the Pages root (project settings → Pages → folder).

An empty [`.nojekyll`](.nojekyll) file is included so GitHub Pages does not ignore paths starting with `_`.

# Design catalog (moved)

The brand design catalog **no longer lives under `docs/reference/design/`**.

## Canonical location

- **`.cursor/design/<brand>/design.md`** — each folder name is the **brand** slug (e.g. `default`, `vercel`, `stripe`).
- **`catalog.json`** and the catalog **`README.md`** are at [`.cursor/design/catalog.json`](../../../.cursor/design/catalog.json) and [`.cursor/design/README.md`](../../../.cursor/design/README.md).

## Choosing a brand

1. List folders under `.cursor/design/` (exclude `README.md` / `catalog.json`).
2. Set **active brand** in [`docs/context/project.md`](../../context/project.md) and align root [`DESIGN.md`](../../../DESIGN.md) tokens and narrative with that brand’s `design.md`.

Bookmark updates: replace old `docs/reference/design/...` paths with `.cursor/design/...`.

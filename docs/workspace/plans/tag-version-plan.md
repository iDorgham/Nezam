# Tag and Version Plan

## SemVer Mapping Rules

- Patch bump: content fixes, SEO tweaks, compliance copy changes.
- Minor bump: design system completion, new features, backend API additions.
- Major bump: full release after hardening.

## Tag Naming

Use: `v<major>.<minor>.<patch>[-prerelease]`

## Tag Triggers

- After `02-design/04-pages` completion -> `v0.1.0-alpha`
- After `03-build/06-release` completion -> `v0.1.0`
- After `05-ship` completion -> `v1.0.0` (final)

## Release Notes Template

- Major changes:
  - ...
- Breaking changes:
  - ...
- Migration steps:
  - ...
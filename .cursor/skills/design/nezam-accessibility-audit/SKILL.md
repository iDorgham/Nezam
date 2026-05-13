---
name: "nezam-accessibility-audit"
description: Comprehensive framework for checking WCAG 2.2 AA compliance, keyboard navigation, and screen reader compatibility.
version: 1.0.0
updated: 2026-05-12
changelog:
  - 1.0.0: Initial release as part of the Design Skill Gap Fill.
---
# Accessibility Audit Skill

## Purpose

Ensure the product is inclusive and compliant with WCAG 2.2 AA standards from the design phase through deployment. This skill provides the framework for auditing UI designs and codebases for accessibility barriers.

## Procedure

### 1. Design-Stage Audit
- Check color contrast (ratio ≥ 4.5:1 for normal text).
- Verify target sizes (min 44x44px or 24x24px with spacing).
- Map focus order and landmarks.
- Ensure text is legible at 200% zoom.

### 2. Implementation Audit
- Validate semantic HTML usage (headings, buttons vs links).
- Check ARIA labels and roles for custom components.
- Test keyboard-only navigation (no focus traps).
- Verify "Skip to Content" links exist.

### 3. Screen Reader Testing
- Audit document hierarchy (single H1, nested H2-H6).
- Check image alt text (descriptive vs decorative).
- Test interactive elements (modals, dropdowns) for state announcements.

## Output Artifacts

1. `docs/reports/a11y/A11Y_AUDIT.md`: Detailed findings and remediation steps.
2. Updated `docs/plan/design/WIREFRAMES.md`: Inclusion of A11y maps/tab order.
3. `docs/reports/a11y/WCAG_CHECKLIST.md`: Pass/fail status for AA criteria.

## Validation Checklist

- [ ] Zero "Critical" accessibility errors found in `scan all`.
- [ ] Keyboard navigation is fully functional.
- [ ] Contrast ratios are verified for all surface/text combinations.
- [ ] Screen reader announcements are accurate for complex UI states.

# Design System v1 (Audit Baseline)

## Audience
- Primary: Spanish-speaking women (30+) managing type 2 diabetes or insulin resistance.
- UX goal: trust, clarity, emotional safety, and action confidence.

## Typography Roles
- `display-title`: Main H1 only (hero).
- `section-title`: Main section H2 headings.
- `subsection-title`: Prominent H3 or signature-level supporting headings.
- `card-title`: Product/bonus card headings.
- `lead-copy`: Emphasis intro sentence before body paragraphs.
- `body-copy`: Default paragraph text.
- `label-copy`: Supporting labels near controls, trust lines, and header labels.
- `meta-copy`: Secondary metadata (country, tiny support text).

## CTA Roles
- `cta-shell`: Shared CTA container shape, spacing, interaction, and motion behavior.
- `cta-main`: Main action phrase inside CTA.
- `cta-price`: Price subline in CTA.

## Pricing Roles
- `price-display`: Large price emphasis text in offer cards.

## Utility Roles
- `tag-pill`: Compact highlight tag (e.g., "Incluido hoy...").
- `faq-question`: FAQ button question text role.

## Spacing Roles
- `section-shell`: Default section vertical rhythm.
- `section-shell-tight`: Tighter hero-level section rhythm.
- `section-stack`: Standard vertical stack inside a section.
- `section-stack-compact`: Compact stack for narrower layouts.

## Rules
- Keep one semantic level per heading role (`h1`, `h2`, `h3`) and avoid skipping levels.
- Prefer role classes over inline text-size classes.
- Use body readability first: avoid dense paragraphs and keep line length moderate.
- Keep CTA structure stable across sections for recognition and trust.

## Versioning
- Current: v1 audit baseline.
- Any typography or spacing change should update this file with a short changelog entry.

## Changelog
- 2026-04-05:
  - `meta-copy` readability increased from `text-xs` baseline to `text-sm` / `md:text-base`.
  - Sticky header timer rendering stabilized for hydration consistency and mobile resume behavior.
- 2026-04-04:
  - Hero simplified to single primary headline (removed optional subheadline block in UI).

## Do and Don't

| Area | Do | Don't |
| --- | --- | --- |
| Headings | Use semantic order (`h1` -> `h2` -> `h3`) and role classes (`display-title`, `section-title`, `subsection-title`) | Skip heading levels or set one-off text sizes directly in components |
| Body Text | Use `body-copy` for all paragraph content and `lead-copy` only for intro emphasis | Mix random `text-*` classes for paragraph sizes across sections |
| Labels and Meta | Use `label-copy` for supportive UI labels and `meta-copy` for secondary metadata | Style labels with custom one-off font sizes unless strictly necessary |
| CTA | Keep two-line structure (`cta-main`, `cta-price`) and same shape/motion behavior across sections | Create section-specific CTA typography variants that reduce recognition |
| CTA Container | Use `cta-shell` for visual consistency of button size, spacing, focus, and hover states | Copy long inline class strings per component |
| Tags and Badges | Use `tag-pill` for short highlight labels (e.g., included/bonus chips) | Create custom chip styles per section with inconsistent radius/padding |
| Price Emphasis | Use `price-display` for big offer price moments | Recreate large price styles ad hoc in each section |
| Spacing | Use `section-shell`/`section-shell-tight` + `section-stack`/`section-stack-compact` tokens | Hardcode unique vertical spacing patterns in each section |

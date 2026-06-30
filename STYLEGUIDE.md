# Potter Academy — Bundle Style Guide

This guide documents the visual language encoded in `bundle/styles.css`. Use it to keep new pages, sections, and components consistent with the existing bundle design.

---

## 1. Design Principles

- **High-contrast editorial dark mode** with a single neon accent.
- **Brutalist-leaning UI**: sharp corners, thick borders, blocky shadows, uppercase headings.
- **Type-driven hierarchy**: display type for impact, mono for body/structure, serif for warmth.
- **Restrained motion**: transitions should feel fast (0.15–0.35 s) and purposeful.
- **Green is sacred**: only `#39ff14` is used for primary emphasis, hover states, and selection.

---

## 2. Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--green` | `#39ff14` | Primary accent, CTAs, selection, hover borders, emphasis |
| `--bg-dark` | `#0a0a0a` | Default page background |
| `--bg-light` | `#f5f5f0` | Alternate light section background |
| `--text-dark` | `#0a0a0a` | Text on light backgrounds |
| `--text-light` | `#e8e8e0` | Text on dark backgrounds |
| `--surface` | `#1a1a1a` | Cards, panels, elevated surfaces |
| `--border-dark` | `#2a2a2a` | Dividers and borders on dark sections |
| `--border-light` | `#ddddd8` | Dividers and borders on light sections |
| `--highlight` | `rgba(57, 255, 20, 0.08)` | Subtle green wash |

### Section Themes
- `.section-dark` → `bg-dark` + `text-light`
- `.section-light` → `bg-light` + `text-dark`

Both themes expose scoped tokens:
- `--section-border`
- `--section-surface`

Always use these scoped tokens inside reusable components so they adapt automatically to the parent theme.

---

## 3. Typography

### Font Families

| Token | Font | Role |
|-------|------|------|
| `--font-display` | `Archivo`, sans-serif | Headings, buttons, labels, nav |
| `--font-body` | `JetBrains Mono`, monospace | Body text, lists, captions, UI metadata |
| `--font-accent` | `Fraunces`, serif | Italic emphasis, quotes, human touches |
| `--font-syne` | `Syne`, sans-serif | Pricing extras (was/save labels) |

### Type Rules
- **All headings** are uppercase, `letter-spacing: -0.02em`, `line-height: 1.1`.
- **`<em>` inside headings or body** switches to `Fraunces` italic, no transform, normal spacing, `font-weight: 400`.
- **Body** is 17 px, `line-height: 1.7`, `JetBrains Mono`.
- **Labels / microcopy** use uppercase, wide tracking (`0.1em–0.15em`), small sizes (11–13 px).

### Heading Scale

| Level | Typical Size | Notes |
|-------|--------------|-------|
| H1 / Hero title | `3rem` → `1.75rem` mobile | `.title-combined` |
| Section title | `4.5rem` → `1.875rem` mobile | `.section-title` |
| H2 / CTA | `3rem` → `2.25rem` mobile | `.final-cta-inner h2` |
| Card title | `1.5rem` → `1rem` mobile | `.course-title` |
| FAQ question | `1.875rem` → `0.9375rem` mobile | `.faq-q` |

---

## 4. Layout & Spacing

### Container
- Max content width: `1200px` (`var(--max-w)`).
- Standard horizontal padding: `1.5rem` desktop, `1rem` mobile.

### Section Padding

| Context | Vertical Padding |
|---------|------------------|
| Large sections (`pitch`, `courses`, `testimonials`, `faq`, `learn`, `final-cta`) | `10rem` top/bottom |
| Medium sections (`guarantee`, `pricing`) | `6rem` top, `10rem` bottom for pricing |
| Hero | `6rem` top, `0` bottom content area |

### Responsive Scaling
At `900px` and `768px`, most large sections collapse to `6rem` / `5rem` vertical padding. Type scales down aggressively at `768px` and `580px`.

---

## 5. Components

### 5.1 Navigation
- Fixed top, full-width, `z-index: 100`.
- Background `bg-dark`, bottom border `border-dark`.
- Logo: `Archivo`, uppercase, bold. Green dot/span via `span`.
- CTA: green pill-like button, black text, `letter-spacing: 0.15em`, 12 px.

### 5.2 Buttons

#### `.btn-primary`
- Green background, black text.
- `Archivo`, 900 weight, uppercase, `letter-spacing: 0.1em`.
- Padding `14px 32px`; `.btn-large` is `18px 40px`.
- Hover: `scale(1.02)` + green glow `0 0 24px rgba(57,255,20,0.25)`.
- No border-radius.

#### `.btn-buy`
- Full-width black button with light text.
- Border `2px solid bg-dark`.
- Hover: green background, black text, shifts `(-2px, -2px)` + hard shadow `4px 4px 0 text-dark`.
- Use inside pricing cards or checkout contexts.

### 5.3 Cards

#### Course Card (`.course-card`)
- 2-column grid desktop, 1 column mobile.
- Border `1px solid var(--section-border)`.
- Background `var(--section-surface)`.
- Hover: lift `-6px`, green border, soft green shadow.
- Thumbnail `16:9`, image zoom `1.05` on hover.
- Value badge: absolute bottom-right, green, black text, uppercase.

#### Testimonial Card (`.testimonial-card`)
- Width `340px` (or `min(300px, 80vw)` mobile).
- Background `surface`, border `border-dark`.
- Green stars, `Fraunces` italic quote, footer split between author and course label.

#### Pricing Card (`.pricing-card`)
- Light theme card: `bg-light`, `text-dark`, `border: 2px solid text-dark`.
- Hard offset shadow: `6px 6px 0 var(--green)`.
- Centered, max-width `680px`.
- Checklist in a 2-column bordered grid (1 column mobile).

### 5.4 Dividers

| Class | Appearance |
|-------|------------|
| `.divider` | 1 px, fades from transparent to `--border-dark` and back |
| `.divider-light` | Same, uses `--border-light` |
| `.divider-accent` | 2 px, green, lower opacity (`0.35`) |

### 5.5 Hero
- Centered flex column.
- Background layers with cross-fade transition (`0.7s`).
- Gradient mask `hero-bg-mask` for text legibility.
- Title highlight is a green box drawn via `::before` pseudo-element behind black text.
- During slide transitions, green box scales to `0.94` and fades to `0.55`.

---

## 6. Interaction & Motion

### Easing Standards
- **Primary ease**: `cubic-bezier(0.22, 1, 0.36, 1)` — smooth deceleration.
- **Snappy ease**: `cubic-bezier(0.4, 0, 0.2, 1)` — for fades/slides.
- **Linear**: infinite marquee/carousels.

### Transition Durations
| Use Case | Duration |
|----------|----------|
| Button hover | `0.15s` |
| Card hover | `0.3s` |
| Fade / reveal | `0.35s–0.6s` |
| Carousel slide | `0.8s` |
| Hero background cross-fade | `0.7s` |
| FAQ expand/collapse | `0.5s` |

### Scroll Animations
- `.reveal` starts `opacity: 0`, `translateY(24px)`.
- `.reveal.visible` animates to fully visible.
- Delay utilities: `.reveal-delay-1` (`0.08s`), `.reveal-delay-2` (`0.16s`), `.reveal-delay-3` (`0.24s`).

### Carousels
- Hero carousel: manual prev/next, 900px slides, gradient edge masks.
- Testimonials: infinite CSS marquee via duplicated track, `--duration` defaults to `100s` (speeds up to `35s` on mobile).

### FAQ Accordion
- Header grid `60px 1fr 50px`.
- Entire row turns green on hover, text flips to dark.
- Active state uses green inset shadow instead of background fill.
- Answer expands with `max-height` + opacity transition.

---

## 7. Responsive Breakpoints

| Breakpoint | Target |
|------------|--------|
| `1024px` | Tablet landscape: smaller carousel slides, section titles scale down |
| `900px` | Tablet portrait: pricing checklist single-column, timeline collapses, FAQ compresses |
| `768px` | Large phones: hero background removed, nav tightens, sections reduce padding |
| `580px` | Small phones: hero footer stacks, FAQ grid shrinks, type scales further |
| `380px` | Tiny screens: final aggressive type and spacing reductions |

### Responsive Patterns
- **Hero background layers** are hidden below `768px`; rely on solid `bg-dark`.
- **Learn timeline** collapses to stacked cards below `900px`; the center line is hidden.
- **Course grid** goes 2 → 1 column at `768px`.
- **Pricing checklist** goes 2 → 1 column at `900px`.
- **Carousel slides** shrink progressively from `900px` → `380px` → `260px` → `220px`.

---

## 8. Do's and Don'ts

### Do
- Use `--green` for every primary CTA, hover state, and accent.
- Keep headings uppercase and tight.
- Use `--section-border` and `--section-surface` so components work in both dark and light sections.
- Reserve `Fraunces` italic for emotional emphasis and quotes.
- Add `scroll-margin-top: 100px` to anchored sections.

### Don't
- Introduce new accent colors.
- Round corners on buttons or cards.
- Use low-contrast text on dark backgrounds.
- Add heavy shadows outside the green/offset-shadow vocabulary.
- Use long transitions (>0.5s) for hover feedback.

---

## 9. Quick Reference: Class Naming Conventions

| Prefix / Pattern | Meaning |
|------------------|---------|
| `.section-dark` / `.section-light` | Theme wrapper |
| `.btn-*` | Button variants |
| `.pitch-*` | Problem/agitation section |
| `.courses-*` | Course listing |
| `.pricing-*` | Pricing card |
| `.faq-*` | Accordion |
| `.learn-*` | Timeline/features |
| `.guarantee-*` | Guarantee block |
| `.testimonial-*` | Testimonial carousel |
| `.reveal*` | Scroll-triggered fade-in |
| `.carousel-*` | Carousel mechanics |

---

*Generated from `bundle/styles.css`.*

# Design Brief

## Direction

Premium Dark Multitool — Luxury productivity dashboard with glassmorphic depth and refined minimalism, delivering sophisticated tool access with visual sophistication.

## Tone

Refined minimalism meets modern luxury, avoiding generic dark defaults through intentional depth, layered surfaces, and warm accent accents.

## Differentiation

Glassmorphic cards with frosted glass effects and backdrop blur create a multi-dimensional, premium productivity space that feels intentional and elevated.

## Color Palette

| Token      | OKLCH           | Role                                |
| ---------- | --------------- | ----------------------------------- |
| background | Light: 0.98 0.008 230 / Dark: 0.14 0.02 280 | Primary surface |
| foreground | Light: 0.18 0.015 230 / Dark: 0.95 0.01 280 | Text & primary content |
| card       | Light: 1.0 0.004 230 / Dark: 0.19 0.025 280 | Card & glass surfaces |
| primary    | Light: 0.45 0.2 265 / Dark: 0.65 0.25 300 | Vivid violet accent, CTAs |
| accent     | Light: 0.6 0.15 170 / Dark: 0.75 0.18 55 | Warm amber highlights |
| muted      | Light: 0.94 0.01 230 / Dark: 0.24 0.03 280 | Secondary surfaces |

## Typography

- Display: Space Grotesk — Modern geometric, premium tech aesthetic, headings & branding
- Body: Plus Jakarta Sans — Clean contemporary, highly readable UI & content
- Mono: JetBrains Mono — Technical clarity for tool labels & code
- Scale: Hero `text-5xl md:text-7xl font-bold tracking-tight`, h2 `text-3xl font-bold tracking-tight`, label `text-sm font-semibold uppercase`, body `text-base`

## Elevation & Depth

Layered glassmorphism with subtle backdrop blur, frosted glass cards, and contextual shadows creates visual hierarchy without heaviness.

## Structural Zones

| Zone    | Background       | Border         | Notes                                  |
| ------- | ---------------- | -------------- | -------------------------------------- |
| Header  | Solid bg-primary/10 | border-border/30 | Fixed, branded, theme toggle right |
| Content | bg-background    | —              | Main grid area, 2-4 column responsive |
| Cards   | glass effect     | border/30      | Frosted backdrop blur, card shadows   |
| Footer  | bg-muted/40      | border-t       | "Made by AppMedo" attribution         |

## Spacing & Rhythm

Spacious layout with consistent 24px gaps between card columns, 16px internal card padding, and alternating section backgrounds for rhythm.

## Component Patterns

- Buttons: Primary violet (`bg-primary`), rounded-lg, hover glow effect, smooth transitions
- Cards: Glass effect with backdrop-blur-md, rounded-xl, subtle shadows, hover lift animation
- Icons: Gradient overlays on tool icons, warm-to-cool gradients for visual interest

## Motion

- Entrance: Fade-in 0.4s with staggered slide-up for cards
- Hover: Smooth lift, border glow, bg lightness increase on card hover
- Decorative: Pulse-soft 2s loop on status indicators

## Constraints

- No raw color literals; use OKLCH tokens exclusively
- Glassmorphism only on card/popover layers, not every element
- Animations max 0.5s for productivity context, no bouncy effects
- Hamburger menu quick-jump navigation to 12 tools, responsive collapse

## Signature Detail

Glassmorphic card design with frosted effect — frosted glass aesthetic transforms a productivity tool into a premium digital experience.

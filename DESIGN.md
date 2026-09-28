# Design system: redesign-lusion

Visual mix: 24% AI-engineer portfolio (identity, metrics, credibility) + 76% Lusion
(cinematic scroll, spatial depth, engineered whitespace). Zero CLI/terminal language.

## Color

- `ink-950 #F4F2EE` page base: warm ivory paper (light editorial theme)
- `ink-900 #FBFAF8`, `ink-850 #F1EFE9`, `ink-800 #E7E4DC`, `ink-700 #D8D4C9`
  raised surfaces and tracks
- `fog-hi #1A1913` primary text (warm ink), `fog-mid #52504A` body,
  `fog-low #6E6B63` captions
- `line rgba(26,25,19,0.10)` hairlines, the only "card" device
- Monochrome-on-light: ink is the only accent (`acc #1A1913`), used for active
  states, focus rings, primary buttons, the field's darkest particles. The
  canvas carries the mood with dark warm-gray particles on ivory; no colored
  accents in UI chrome. No gradient buttons, no purple AI gradients, no green.

## Typography

- Inter (variable) is the only text face. Display weight 250-350, body 400,
  emphasis 500. JetBrains Mono exists ONLY as 10-11px micro-labels
  (uppercase, tracking 0.16em): indices, coordinates, meta. Mono is annotation,
  never layout, never prompts.
- Hero name: sentence case, clamp(3.6rem, 10.5vw, 10rem), w275, lh 0.93, ls -0.035em
- Section titles: clamp(2.2rem, 5vw, 4.2rem), w500, ls -0.03em, sentence case
- Editorial statements: clamp(1.7rem, 3.6vw, 3rem), w350, lh 1.25
- Metric numerals: clamp(3.6rem, 8.5vw, 8rem), w250, tabular-nums
- Body: 15-17px, lh 1.7, fog-mid; key figures inline fog-hi

## Space + structure

- Container: max-w 1400px, px 24/40/64
- Sections: py-28 md:py-40; hairline rules separate rows; no boxed cards except
  the education panels (rounded-2xl, ink-900/40, hairline border)
- Section header: micro-label "0X / NAME" + hairline, title below, optional lede
- Chapter rhythm: generous 8rem whitespace, sparse registration marks, lowercase
  bullet-separated tag lines (Lusion style)

## Motion

- MICRO 150-250ms ease-out: hovers, link underlines, button states
- MEDIUM 0.6-0.9s cubic-bezier(0.22,0.61,0.21,1): [data-reveal] opacity+Y18+blur5,
  IntersectionObserver once, 60-140ms stagger; SVG micro-visualizations draw on reveal
- LARGE scroll-linked, never scroll-jacked: hero camera pulls back and tilts with
  scroll progress; experience chapters brighten as they enter; native scroll only
- Loops are slow and few: dash-flow 1.1-4s, pulses 4-8s, canvas drift sine ~0.07Hz
- prefers-reduced-motion: reveals instant, all loops killed, canvas not mounted
  (static SVG field stands in), animateMotion elements not rendered

## Depth / 3D rules

- One WebGL scene: the hero "latent field". Points on a plane displaced by layered
  sine fields + a traveling swell; 6 signal pulses riding spline trajectories.
  Camera: slow drift + mouse parallax (0.9/0.5 amplitude, 0.04 lerp) + scroll
  pull-back. No post-processing, no lights, no meshes.
- Budgets: DPR <= 1.8 desktop / 1.25 mobile; particles 12.6k desktop / 3.5k mobile;
  additive blending, depthWrite off; pauses via IntersectionObserver + tab hidden.
- Project scenes are animated SVG (dash flow + motion dots), not canvases.
- Fallback ladder: no-JS -> server-rendered SVG field visible (content unaffected);
  no WebGL or reduced motion -> same SVG, no canvas; low-power -> fewer particles,
  DPR 1, no parallax.

## Accessibility

Semantic landmarks, one h1 (name), logical heading order. All interaction keyboard
reachable; visible 2px acc focus ring. Decorative canvases/SVG aria-hidden.
No information depends on animation completing; dimmed inactive chapters never
below 0.65 opacity. Contrast: body fog-mid on ink-950 > 7:1, captions > 4.5:1.
No sound, no strobe; loops slower than 1s periods avoid flash patterns.

## Page flow

Nav (transparent -> floating pill) -> 01 Intro -> 02 Technical proof (4 metric
rows w/ SVG micro-viz) -> 03 Experience (chapters, Ericsson featured) -> 04
Selected work (statement + 3 project scenes: S4->Mamba-3 evolution, AIRE
evaluation pipeline, agent state ring) -> 05 Research notes -> 06 Capabilities
-> 07 Foundations (IISc, Oracle, Rhapsody, JEE) -> 08 Contact closing -> footer.

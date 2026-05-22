# Design System Inspired by Masri (Cairo & Sahel Roots)

> Category: mena
> Description: A premium Egyptian-Arabic aesthetic celebrating warm terracotta, desert sands, Sahara gold, and deep Nile indigo. Optimized for modern, responsive layouts with rich Arabic/RTL typographic hierarchies.

## 1. Visual Theme & Atmosphere

Inspired by the vibrant contrast of Cairo's historic red bricks (terracotta) and modern Sahel golden sands. This profile represents high contrast, warm editorial feeling, and modern premium luxury in Masri culture. It features deep cultural relevance with a highly polished design stance.

- **Visual style:** warm, cultural, luxury, responsive
- **Color stance:** rich terracotta primary, Sahara gold accent, sand pearl text, deep Nile indigo surfaces
- **Design intent:** Elevate modern Egyptian/MENA web applications with responsive RTL layouts, premium typography (Outfit/Inter), and warm, high-contrast cultural tones.

## 2. Color

- **Primary:** `#D05A3F` — Terracotta Warm Clay (حمرة الطوب المصري).
- **Secondary:** `#D4AF37` — Sahara Gold (دهب الصحراء).
- **Success:** `#10B981` — Nile Green (خضار النيل).
- **Warning:** `#F39C12` — Sun Amber (شمس المحروسة).
- **Danger:** `#C0392B` — Red Sea (بحر القلزم).
- **Surface:** `#0E1424` — Deep Nile Indigo (ليل النيل الغريق).
- **Text:** `#F5ECE1` — Desert Sand Pearl (لؤلؤ الرملة).
- **Neutral:** `#1C2541` — Cairo Dusk (غروب القاهرة).

- Favor Primary (`#D05A3F`) for call-to-actions, primary highlights, and button backgrounds to capture Egyptian warmth.
- Use Sahara Gold (`#D4AF37`) for subtle accents, badges, and premium border highlights.
- Keep background on Deep Nile Indigo (`#0E1424`) and text on Sand Pearl (`#F5ECE1`) to secure outstanding contrast and premium glassmorphism effects.

## 3. Typography

- **Scale:** Expressive high-contrast typography designed for elegant bilingual (English & Masri Arabic) layouts.
- **Families:** display=Outfit, primary=Inter, mono=JetBrains Mono
- **Weights:** `300`, `400`, `500`, `600`, `700`
- **Scale:** baseSize=16, scale=1.25
- Display titles carry Outfit for a geometric, friendly yet premium luxury feel. Body text uses Inter to ensure maximum legibility for long paragraphs and Arabic glyph alignments.

## 4. Spacing & Grid

- **Spacing scale:** `4px` / `8px` / `12px` / `16px` / `24px` / `32px` / `48px` / `64px`
- Keep a tight vertical rhythm using dynamic CSS calc multipliers for spacing to ensure perfect scaling across desktop and mobile viewports.

## 5. Layout & Composition

- Prefer elegant containers with subtle glowing gold or terracotta borders.
- Keep logical layout structure RTL-first (`dir="rtl"`) when Arabic is selected, utilizing logical properties like `margin-inline-start` and mirroring layouts naturally.
- Emphasize white space to reflect the grand expanses of the desert, focusing on breathable but dense information hubs.

## 6. Components

- Buttons: Primary uses Terracotta (`#D05A3F`) with sand-pearl text and a hover transition to Sahara Gold (`#D4AF37`).
- Form Fields: Deep Nile Dusk (`#1C2541`) background with a 1px border that glows gold upon focus.
- Navigation: Floating header bar utilizing glassmorphism blur and deep indigo semi-transparent backing.

## 7. Motion & Interaction

- **Duration:** 150 ms - 350 ms
- Transitions should mimic the smooth flow of the Nile, starting fast and easing into place gracefully.
- Hover animations on interactive items include micro-scaling (1.02x) and shadow glow shifts.

## 8. Voice & Brand

- Tone: Warm, welcoming, proud, Egyptian-Arabic inspired yet globally professional.
- Localized copywriting should feel authentic, avoiding literal modern standard translations in favor of Masri friendly professional voice.

## 9. Anti-patterns

- Avoid cold greys or generic solid blacks.
- Never use high-opacity solid backgrounds for components that should feel like layered glass.
- Avoid default browser serif fonts; always load premium localized fonts with correct Arabic subsetting.

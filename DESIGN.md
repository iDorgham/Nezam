# DESIGN.md — Spotify Inspired Design System

> **Vibe:** Dark immersive, vibrant green accents, bold typography, media-heavy.
> **Target:** Nightclub Reservation & Guest List System

## 1. Visual Theme & Atmosphere
- **Theme:** Dark Mode by default. Immersive late-night vibe.
- **Atmosphere:** Energetic, clean, and professional.
- **Core Elements:** Rounded corners, glassmorphism overlays, and high-contrast green accents.

## 2. Color System
- **Backgrounds:**
  - Base: `#121212` (Deep dark)
  - Surface: `#181818` (Cards, sidebars)
  - Surface Elevated: `#282828` (Hover states, modals)
- **Accents:**
  - Primary: `#1DB954` (Spotify Green)
  - Primary Hover: `#1ED760`
- **Text:**
  - High Contrast: `#FFFFFF`
  - Medium Contrast: `#B3B3B3` (Descriptions, secondary text)
  - Low Contrast: `#535353` (Placeholders, disabled text)
- **Status:**
  - Success: `#1DB954`
  - Warning: `#FFA726`
  - Danger: `#E53935`

## 3. Typography
- **Font Families:**
  - Sans-Serif: `Inter`, system-ui, sans-serif (Clean, readable)
  - Display: `Outfit` or `Poppins` (Bold, geometric for headings)
  - Mono: `Fira Code`, monospace (For IDs and metrics)
- **Scale:**
  - Display: 32px / Leading 40px (Bold)
  - Heading: 24px / Leading 32px (Bold)
  - Title: 18px / Leading 24px (Semi-bold)
  - Body: 14px / Leading 20px (Regular)
  - Caption: 12px / Leading 16px (Regular)

## 4. Components & Layout
- **Visual Table Layout:**
  - Use a grid or canvas background with `#181818`.
  - Tables represented as rounded shapes (circles/rectangles) with `#282828`.
  - Selected or reserved tables glow with `#1DB954` shadow.
- **Leaderboard:**
  - List items with alternating backgrounds or subtle separators.
  - Progress bars or rank numbers in `#1DB954`.
- **QR Scanner:**
  - Camera view with a green target box overlay.
  - Large success/failure banners covering the screen momentarily.

## 5. RTL & MENA Support
- Since the target market is MENA, layouts must flip correctly in RTL mode.
- Use CSS logical properties (e.g., `padding-inline-start` instead of `padding-left`).
- Ensure font fallback includes a clean Arabic typeface (e.g., `IBM Plex Sans Arabic`).

## 6. Motion & Animation
- **Hover Transitions:** 200ms ease-in-out for cards and buttons.
- **Glow Effects:** Subtle pulse animations for active/reserved tables.
- **Scan Success:** Quick scale-up and fade-out animation for success checkmarks.

## 7. Wireframe Selections (Locked)
- **Web Navigation:** Option C (Collapsible Sidebar)
- **Floor Plan Editor:** Option B (Full Screen Canvas with Floating Toolbar)
- **Sales App:** Option A (Dashboard First)
- **Security App:** Option B (Split Screen)

# Website Architecture & Recreation Guide: Pixel Craze

## Overview
This directory contains the front-end code for "Pixel Craze | Design & Automation Studio". It is a static, modern, minimalist single-page website built with raw HTML, CSS, and JavaScript.

**Files:**
1. `index.html`: The structural markup.
2. `style.css`: The styling rules, variables, and responsive media queries.
3. `main.js`: IntersectionObserver logic for scroll animations and dynamic footer year (Note: currently unlinked in `index.html`).

---

## 1. Structure & Contents (`index.html`)

The HTML document follows semantic HTML5 standards and relies on a Google Fonts import (Inter and Playfair Display).

### Sections:
1. **Global/Background Elements:**
   - `<div class="noise-overlay"></div>`: A fixed, full-screen div used to apply a grainy gradient SVG (`https://grainy-gradients.vercel.app/noise.svg`) via CSS for a textured background effect.

2. **Navigation (`nav.navbar`)**:
   - Contains a centered `div.container.nav-content`.
   - **Logo**: `<a href="#" class="logo">PIXELCRAZE<span>.</span></a>`. The span is for accent color.
   - **Links**: Container `div.nav-links` with anchor tags mapped to IDs (`#capabilities`, `#philosophy`) and a call-to-action pill button (`#contact` with class `cta-pill`).

3. **Hero Section (`section.hero`)**:
   - Contains a container with a primary heading `h1.hero-text`.
   - Typography mixing: Uses `<span class="serif-italic">` to switch fonts mid-heading for aesthetic impact.
   - Subtitle: `p.hero-sub`.

4. **Capabilities (Bento Grid) (`section#capabilities.capabilities`)**:
   - Features a section label (`span.section-label`).
   - Uses a CSS Grid container (`div.bento-grid`).
   - **Cards**: Contains 4 `div.bento-card` elements.
     - Card 1: `card-wide` (spans 2 columns).
     - Card 2: `card-tall` (spans 2 rows).
     - Card 3: Standard size.
     - Card 4: `card-wide` (spans 2 columns).
   - Each card contains an absolute positioned number (`span.card-num`) and inner text content (`div.card-inner` -> `h3`, `p`).

5. **Philosophy (`section#philosophy.philosophy`)**:
   - Layout: `div.philosophy-wrapper` inside the container.
   - Contains a section label, large heading (`h2.big-text`), and a two-column text layout (`div.philosophy-content` with two `<p>` tags).

6. **Footer (`footer#contact`)**:
   - Three-column grid layout (`div.footer-grid`).
   - Column 1: Brand logo and short description (`div.footer-brand`).
   - Column 2 & 3: Navigation and Connect links (`div.footer-nav` with `h4` headers and `a` links).
   - Bottom bar (`div.footer-bottom`): Contains hardcoded copyright (`&copy; 2026 Pixel Craze. All rights reserved.`) and a "Back to top" link.

---

## 2. Styling Rules (`style.css`)

The CSS uses a global `var()` system in `:root` and relies on a mobile-first/desktop-first hybrid approach (desktop is default, scaling down via max-width queries).

### Design Tokens (CSS Variables):
- `--bg`: `#0a0a0b` (Very dark background)
- `--card-bg`: `#141416` (Slightly lighter dark card)
- `--text`: `#f4f4f5` (Off-white text)
- `--text-muted`: `#a1a1aa` (Gray muted text)
- `--accent`: `#7c7cff` (Soft purple/blue accent)
- `--border`: `rgba(255, 255, 255, 0.08)` (Subtle borders)
- `--nav-height`: `90px`
- `--section-spacing`: `160px`

### Layout Patterns to Maintain:
- **Container**: `max-width: 1200px`, centered via `margin: 0 auto`, `padding: 0 40px`.
- **Typography**: Primary font is 'Inter', accented with 'Playfair Display' (italic).
- **Sticky Navbar**: Uses `position: sticky; top: 0;` with a blur `backdrop-filter: blur(20px);` and `.85` opacity background.
- **Bento Grid**: Based on `display: grid`.
  - Default: 3 columns (`grid-template-columns: repeat(3, 1fr)`), `280px` auto rows.
  - Sizing classes: `.card-wide` (`grid-column: span 2`), `.card-tall` (`grid-row: span 2`).

### Responsive Breakpoints:
- **`max-width: 1024px`**: Bento grid reduces to 2 columns (`1fr 1fr`).
- **`max-width: 768px`**:
  - Navbar height shrinks to `80px`, nav links are hidden (`display: none`).
  - Hero and section paddings are reduced.
  - Bento grid collapses to a single column stack (`1fr`), disabling `card-wide` and `card-tall` overrides.
  - Philosophy and footer grids collapse to single columns.

---

## 3. Interactivity (`main.js`)

*(Note: Currently, `main.js` is not imported via `<script>` in `index.html`. To activate it, add `<script src="main.js"></script>` before the closing `</body>` tag.)*

**Functionality includes:**
1. **Dynamic Year**: Targets an element with `id="year"` to inject the current year. (The `index.html` currently uses a hardcoded year. To fix, update footer text to: `<p>&copy; <span id="year"></span> Pixel Craze...</p>`).
2. **Scroll Reveal Animation**:
   - Uses `IntersectionObserver` (threshold `0.15`).
   - Targets `.bento-card`, `.philosophy`, and `.cta-inner`.
   - Dynamically injects a `<style>` tag applying a `transform: translateY(40px)` and `opacity: 0` (`.reveal-hidden`), transitioning to `transform: translateY(0)` and `opacity: 1` (`.visible`) using a cubic-bezier easing curve for a smooth slide-up effect.

---

## 4. How to Add Elements Without Breaking It

To seamlessly extend the website while preserving its architectural integrity, follow these rules:

### A. Creating New Sections
1. Always wrap new sections in a `<section>` tag with an appropriate ID and class.
2. Inside the `<section>`, immediately nest a `<div class="container">` to maintain alignment.
3. Maintain vertical rhythm by applying `padding: var(--section-spacing) 0;` in CSS.
4. If the section requires a label, use `<span class="section-label">Label Name</span>` before the section heading or grid.

### B. Adding to the Bento Grid
The bento grid relies on exact row/column spanning across 3 columns.
1. Add new `<div class="bento-card">` elements inside `<div class="bento-grid">`.
2. **Crucial Rule**: Ensure the math adds up. A standard card takes 1 column. A `.card-wide` takes 2 columns. A `.card-tall` takes 1 column but 2 rows. When adding new elements, visualize the 3-column grid to prevent orphaned gaps or broken rows.
3. Structure inside the card must be:
   ```html
   <div class="bento-card [card-wide|card-tall]">
       <span class="card-num">05</span>
       <div class="card-inner">
           <h3>Title</h3>
           <p>Description</p>
       </div>
   </div>
   ```

### C. Adding Text/Typography
- For massive, impact headings, use the class `.big-text` or mimic `.hero-text`.
- For accentuating specific words, wrap them in `<span class="serif-italic">word</span>`.
- For muted descriptions, use `<p>` (inherits muted styling inside grids) or apply `color: var(--text-muted);`.

### D. Adding Navigation Links
- Add new anchor tags `<a href="#new-id">Link Name</a>` inside `.nav-links` (desktop) and `.footer-nav`.
- **Warning**: Mobile navigation (`.nav-links` at `< 768px`) is currently set to `display: none;` without a hamburger menu implementation. If you add many links, you will need to build a mobile menu toggle mechanism to maintain functionality on small screens.

### E. Adding Animations
- If you link `main.js`, any element you want to fade in on scroll can simply be added to the `document.querySelectorAll()` list in the JS file (e.g., adding `.hero` or creating a `.fade-in` class and targeting that).

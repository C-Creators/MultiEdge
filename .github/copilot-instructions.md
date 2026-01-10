# Copilot Instructions for Duplifinance

## 🚨 GOLDEN RULE

**NEVER RUN THE APPLICATION OR DEV SERVER.**

The user will handle all application execution, testing, and preview tasks. Do not use `npm run dev`, `npm start`, `npm run build`, or any similar commands to start/run the application.

---

## Project Overview

**Duplifinance** is a multilingual landing page for a trading/forex bot service. It showcases bot performance metrics, trading philosophy, supported brokers, and provides calls-to-action for users to get started with the service.

### Tech Stack

- **Framework:** [Astro](https://astro.build/) - Static site generator
- **Styling:** Vanilla CSS with CSS custom properties (CSS variables)
- **Icons:** Lucide Icons (loaded via CDN)
- **Languages:** TypeScript for logic, Astro components for templating
- **i18n:** Custom internationalization system (English & Spanish)

---

## Project Structure

```
Duplifinance/
├── astro.config.mjs      # Astro configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── public/               # Static assets (images, fonts, etc.)
├── src/
│   ├── components/       # Astro components
│   │   ├── About.astro        # About section
│   │   ├── Audience.astro     # Target audience section
│   │   ├── BotDetails.astro   # Bot performance metrics & modal
│   │   ├── Brokers.astro      # Supported brokers section
│   │   ├── FAQ.astro          # Frequently asked questions
│   │   ├── FinalCTA.astro     # Final call-to-action band
│   │   ├── Footer.astro       # Site footer
│   │   ├── Hero.astro         # Hero section with stats
│   │   ├── LanguageSwitcher.astro  # EN/ES language toggle
│   │   ├── Navbar.astro       # Navigation bar & mobile drawer
│   │   ├── Philosophy.astro   # Trading philosophy section
│   │   └── Systems.astro      # Trading systems section
│   ├── i18n/
│   │   ├── translations.ts    # All translation strings (EN & ES)
│   │   └── utils.ts           # i18n utility functions
│   ├── layouts/
│   │   └── Layout.astro       # Main HTML layout wrapper
│   ├── pages/
│   │   └── index.astro        # Main page (assembles all components)
│   └── styles/
│       ├── global.css         # Global styles, CSS variables, responsive breakpoints
│       ├── buttons.css        # Button, badge, chip, and link styles
│       ├── components.css     # Bot cards, FAQ, modal, footer styles
│       ├── hero.css           # Hero section styles
│       ├── nav.css            # Navbar and mobile drawer styles
│       └── sections.css       # Section layouts, cards, grids, bands
└── html-reference.html   # Reference HTML file (not part of active site)
```

---

## Key Concepts

### Internationalization (i18n)

- Translations are stored in `src/i18n/translations.ts` with `en` and `es` objects
- Components use `data-i18n` attributes for translatable text
- Language switching is handled client-side via JavaScript
- Always update BOTH English and Spanish translations when adding/modifying text

### Styling Architecture

- **Mobile-first responsive design** with breakpoints at:
  - 320px (small phones)
  - 375px (medium phones)
  - 520px (large phones)
  - 768px (tablets)
  - 980px (small laptops)
- CSS custom properties defined in `:root` and `[data-theme="dark"]`
- Dark mode support via `data-theme` attribute

### Component Pattern

- Each section is a self-contained `.astro` component
- Components are assembled in `src/pages/index.astro`
- Static data (like bot metrics) is defined in component frontmatter

---

## Common Tasks

### Adding a new translation
1. Add the key to both `en` and `es` objects in `src/i18n/translations.ts`
2. Use `data-i18n="section.key"` attribute in the component

### Modifying styles
1. Find the relevant CSS file in `src/styles/`
2. Responsive styles are consolidated in `global.css` at the bottom
3. Use existing CSS variables when possible

### Adding a new section
1. Create a new `.astro` file in `src/components/`
2. Import and add it to `src/pages/index.astro`
3. Add any translations to `src/i18n/translations.ts`
4. Add component-specific styles to appropriate CSS file

---

## Important Notes

- The `html-reference.html` file is a legacy reference and is NOT part of the active site
- Bot metrics data is hardcoded in `BotDetails.astro` (not fetched from API)
- All external links should use `target="_blank" rel="noopener"`
- The site supports both light and dark themes

# Design System & UI Specification: RED CAT PICTURES

This document outlines the technical UI architecture, design tokens, layout structures, and component guidelines for **RED CAT PICTURES** (Tech-enabled Creative Media Agency).

---

## 1. Technical Framework & Styling Architecture

The application is built on **Nuxt 3** (Vue 3 + TypeScript) with a hybrid rendering and rich media stack.

- **CSS Framework**: [Tailwind CSS](https://tailwindcss.com/) via `@nuxtjs/tailwindcss`
- **Theme Management**: `@nuxtjs/color-mode` configured for class-based dark mode (`darkMode: 'class'`)
- **Iconography**: Custom SVG icon system powered by `@nuxt/icon` (`<NuxtIcon name="local:<icon-name>" />`)
- **Media Optimization**: Nuxt Image (`<NuxtImg />`) and custom video components (`NuxtVideo.vue`)
- **Interactive Shaders & 3D**: REGL WebGL shaders (burn/fly-in canvas animations) and Tres.js/Three.js (`<TresCanvas />`, `<TresGroup />`) for 3D components (`PhotoFrame.vue`)

---

## 2. UI Design Tokens

All design tokens are defined in [`tailwind.config.ts`](file:///d:/Projects/Public/red-cat-pictures/code/tailwind.config.ts) and [`app/app.vue`](file:///d:/Projects/Public/red-cat-pictures/code/app/app.vue).

### 2.1 Color Palette & Theme System

The color palette features curated high-contrast neutrals with a signature vibrant crimson primary accent.

| Token Group             | Shade         | Hex / Value | Usage Description                                      |
| :---------------------- | :------------ | :---------- | :----------------------------------------------------- |
| **Canvas**              | `white`       | `#FFFFFF`   | Bright backgrounds, light card text, dark mode accents |
|                         | `black`       | `#000000`   | Deep dark accents, full dark background highlights     |
| **Light Theme**         | `light-400`   | `#F8FAFC`   | Light mode primary body background                     |
|                         | `light-500`   | `#F1F5F9`   | Light mode card surface & container background         |
|                         | `light-600`   | `#CBD5E1`   | Light mode borders, dividers & scrollbar thumb         |
| **Dark Theme**          | `dark-400`    | `#171717`   | Dark mode primary body background                      |
|                         | `dark-500`    | `#262626`   | Dark mode card surface & container background          |
|                         | `dark-600`    | `#404040`   | Dark mode borders, dividers & scrollbar thumb          |
| **Primary (Brand Red)** | `primary-400` | `#FB3737`   | Hover states, bright accent highlights                 |
|                         | `primary-500` | `#CD2D2D`   | Main brand crimson accent, active states, progress bar |
|                         | `primary-600` | `#813232`   | Darkened crimson accent for shadows & deep states      |
| **Success**             | `success-400` | `#89E774`   | Light green status indicators                          |
|                         | `success-500` | `#4AD42B`   | Standard success green                                 |
|                         | `success-600` | `#66BE52`   | Dark success green                                     |
| **Warning**             | `warning-400` | `#F0CD42`   | Light warning yellow                                   |
|                         | `warning-500` | `#ECC113`   | Standard warning yellow                                |
|                         | `warning-600` | `#D7B942`   | Dark warning tone                                      |
| **Alert / Destructive** | `alert-400`   | `#F24067`   | Light alert state                                      |
|                         | `alert-500`   | `#E11D48`   | Primary danger/alert rose red                          |
|                         | `alert-600`   | `#C02650`   | Dark alert tone                                        |

---

### 2.2 Typography System

The application uses **Oxanium** as the primary and secondary font family (`font-main` and `font-sub`).

#### Font Families & Weights

- **Primary Font**: `Oxanium`, sans-serif
- **Secondary Font**: `Oxanium`, sans-serif
- **Font Weights**:
  - `light`: `300`
  - `regular`: `400`
  - `semi-bold`: `500`
  - `bold`: `600`

#### Font Scale Table

| Token  | Font Size (rem) | Line Height (rem) | Pixel Equivalent | Typical Usage                      |
| :----- | :-------------- | :---------------- | :--------------- | :--------------------------------- |
| `3xs`  | `0.5rem`        | `0.5625rem`       | 8px / 9px        | Micro badges & fine print          |
| `2xs`  | `0.625rem`      | `0.75rem`         | 10px / 12px      | Compact labels & metadata          |
| `xs`   | `0.75rem`       | `0.875rem`        | 12px / 14px      | Subtitles, feature list items      |
| `sm`   | `0.875rem`      | `1.0625rem`       | 14px / 17px      | Secondary body text, sub-menus     |
| `base` | `1rem`          | `1.5rem`          | 16px / 24px      | Standard body text, main buttons   |
| `lg`   | `1.25rem`       | `1.5625rem`       | 20px / 25px      | Subheadings, primary button labels |
| `xl`   | `1.5rem`        | `1.875rem`        | 24px / 30px      | Card titles, modal headers         |
| `2xl`  | `2rem`          | `2.5rem`          | 32px / 40px      | Section titles, price displays     |
| `3xl`  | `2.5rem`        | `3.125rem`        | 40px / 50px      | Major section headers              |
| `4xl`  | `3rem`          | `3.625rem`        | 48px / 58px      | Hero subheadings, display text     |
| `5xl`  | `3.5rem`        | `4.1875rem`       | 56px / 67px      | Hero main titles                   |

---

### 2.3 Custom Utility & Animation Tokens

Global utility classes defined in [`app/app.vue`](file:///d:/Projects/Public/red-cat-pictures/code/app/app.vue):

- **Brand Background Gradient** (`.gradient`):
  ```css
  bg-gradient-to-br from-primary-500/50 to-transparent to-40%
  ```
- **Shimmer Light Reflection Effect** (`.shimmer-overlay` / `.shimmer`):
  Sweeps a light diagonal beam across call-to-action buttons (`2s infinite`).
- **Sweep Text Gradient** (`.sweep-gradient`):
  Linear text clipping gradient animation moving horizontally (`2.5s alternate infinite`).
- **Overlay Vignette** (`.overlay`):
  Adds top-to-bottom dark gradient vignette to page content (`after:bg-gradient-to-b after:from-black/40 after:to-black/40`).
- **Continuous Ticker Scroll** (`.autoscroll-x`, `.autoscroll-y`):
  Infinite keyframe scrolling for client brand logos and media carousels.
- **Backdrop Text Shadow** (`.text-shadow-lg`):
  Provides subtle shadow drop for readability over complex hero backdrops.

---

## 3. Layout Structures

The application utilizes two distinct Nuxt layout wrappers located in `app/layouts/`:

```
app/layouts/
├── default.vue
└── landing.vue
```

### 3.1 Default Layout (`default.vue`)

- **Structure**:
  ```html
  <div class="gradient isolate flex min-h-screen w-screen flex-col items-center justify-start">
    <LazyAppHeader :color-mode="isLightMode ? 'light' : isDarkMode ? 'dark' : 'auto'" />
    <main class="relative mx-auto flex w-full grow flex-col gap-4 px-2 md:px-4">
      <slot />
    </main>
    <LazyAppFooter :has-floating-action-button="hasFloatingActionButton" />
  </div>
  ```
- **Key Characteristics**:
  - Encapsulated by ambient red top-left gradient background (`.gradient`).
  - Constrained main content container with responsive padding (`px-2 md:px-4`).
  - Dynamic `AppHeader` color mode detection based on active route path (e.g. `/blog/` vs `/episode/`).

### 3.2 Landing Layout (`landing.vue`)

- **Structure**:
  ```html
  <div class="isolate flex min-h-screen w-screen flex-col items-center justify-start">
    <LazyAppHeader :color-mode="isLightMode ? 'light' : isDarkMode ? 'dark' : 'auto'" />
    <main class="relative mx-auto flex w-full grow flex-col gap-4">
      <slot />
    </main>
    <div class="w-full bg-light-400 dark:bg-dark-400">
      <LazyAppFooter :has-floating-action-button="hasFloatingActionButton" />
    </div>
  </div>
  ```
- **Key Characteristics**:
  - Full-bleed main section container without edge padding for edge-to-edge media sections (hero video, brand slider).
  - Explicit theme-aware wrapper for the footer.

---

## 4. Component Hierarchy & Architectural Rules

Components are organized by atomic domain in `app/components/`:

```
app/components/
├── AppFooter.vue
├── AppHeader.vue
├── AppNavbar.vue
├── BrandSlider.vue
├── LinkToolTip.vue
├── MarkdownContent.vue
├── NuxtVideo.vue
├── PhotoFrame.vue
├── SectionLabel.vue
├── StatusBar.vue
├── Button/
│   ├── ColorMode.vue
│   ├── CTA.vue
│   ├── FloatingAction.vue
│   ├── Label.vue
│   └── Slide.vue
├── Card/
│   ├── Content.vue
│   ├── Member.vue
│   └── Package.vue
├── Modal/
│   ├── Base.vue
│   ├── Contact.vue
│   └── Offer.vue
└── Section/
    ├── Apps.vue
    ├── Branding.vue
    ├── FeaturedPhoto.vue
    ├── Hero.vue
    ├── Packages.vue
    ├── PhotoGallery.vue
    └── VideoGallery.vue
```

---

### 4.1 Component Rules & Coding Standards

#### Rule 1: Theme Consistency

- Every card, surface, and modal **MUST** support dark and light mode seamlessly.
- Use pairings:
  - Surface: `bg-light-500 dark:bg-dark-500`
  - Body Background: `bg-light-400 dark:bg-dark-400`
  - Border: `border-light-600 dark:border-dark-600` or `border-primary-500`
  - Text: `text-black dark:text-white` or `text-primary-500`

#### Rule 2: Typography Standard

- Do not hardcode custom `font-size` or `font-family` classes. Use the defined typography tokens: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `font-semi-bold`, `font-bold`.

#### Rule 3: Hydration & Lazy Loading

- Non-critical global overlay components (Modals, Footer, Color Switcher) **MUST** use Nuxt lazy component resolution with explicit hydration triggers (`hydrate-on-idle` or `hydrate-on-visible`):
  ```html
  <LazyAppHeader hydrate-on-idle /> <LazyModalContact hydrate-on-visible :is-open="isContactOpen" />
  ```

#### Rule 4: Aspect Ratio & Image Layout Shift Prevention

- Media containers must define explicit aspect ratios to prevent Cumulative Layout Shift (CLS):
  - Episode / Blog Cards: `aspect-[32/28]` or `aspect-[13/7]`
  - Member Profiles: `aspect-square` / image `aspect-[2/3]`
  - Package Cards: `aspect-[418/628]`
  - Photos/Videos: explicit `fit="cover"` with `width` and `height` attributes specified.

#### Rule 5: Section Branding Header

- All major page sections must utilize the standard `<SectionLabel />` component:
  ```html
  <SectionLabel icon="camera" title="Our Portfolio" />
  ```

#### Rule 6: CTA Shimmer Standard

- Action buttons requiring visual prominence must implement the `shimmer-overlay` pattern:
  ```html
  <button class="shimmer-overlay z-40 bg-gradient-to-r from-primary-500 to-dark-400/60 text-white">
    <div class="shimmer flex items-center gap-3">
      <span>Book a Session</span>
    </div>
  </button>
  ```

---

## 5. WebGL Shader & Interactive Canvas Systems

The codebase incorporates high-performance custom WebGL shaders for interactive media presentation:

1. **REGL Shaders (`app/shaders/`)**:
   - `burnVert` & `burnFrag`: Creates an interactive burn/dissolve mask transition on team profile images (`Card/Member.vue`).
   - `flyInVert` & `flyInFrag`: Implements a 3D grid piece displacement fly-in animation triggered on mouse/touch interaction.
2. **Tres.js / Three.js Canvas (`PhotoFrame.vue`)**:
   - Renders 3D framed photo meshes with realistic depth, wood texture material maps, and plane geometry projection.

---

## Summary Checklist for New UI Components

- [ ] Uses `font-main` (`Oxanium`) typography tokens.
- [ ] Complies with `light-400`/`dark-400` surface color system.
- [ ] Incorporates `<NuxtIcon name="local:<icon-name>" />` for vector icons.
- [ ] Prevents layout shifts via explicit aspect ratios and image dimensions.
- [ ] Wraps lazy components with appropriate `hydrate-on-*` triggers where applicable.

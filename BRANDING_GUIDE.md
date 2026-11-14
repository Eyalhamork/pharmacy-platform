# 🎨 White-Label Branding & Dynamic Theming Guide

This pharmacy e-commerce platform is built from the ground up to be **fully white-label and dynamic**. Rebranding the platform for any pharmacy client or deployment takes less than 60 seconds.

---

## ⚡ Dynamic Color & Brand Architecture

The platform uses a **unified dynamic theming engine**:

1. **Central Brand Config (`lib/theme-config.ts`)**: Defines brand names, contact info, logo text, and HSL colors.
2. **Dynamic Root Injection (`app/layout.tsx`)**: Injects the active theme's colors directly into CSS custom properties (`--primary`, `--secondary`, `--accent`, `--muted`, etc.) in `<head>`.
3. **Tailwind Semantic Tokens (`tailwind.config.js`)**: All components and pages utilize semantic classes (`bg-primary`, `text-primary`, `bg-accent`, `bg-primary/10`, etc.) rather than hardcoded hex or color utilities.

Changing a color in `lib/theme-config.ts` **instantly propagates across the entire application** (buttons, header, hero sections, badges, links, cards, borders, and footer).

---

## 🚀 How to Rebrand in 2 Steps

### Step 1: Open `lib/theme-config.ts`

Select one of the pre-configured themes or add your own:

```typescript
// Choose your active theme:
export const activeTheme = themes.pharmacare; // or themes.nordic, themes.sapphire
```

To create a new theme for a client, add a new theme object:

```typescript
yourpharmacy: {
  name: 'Apex Health Pharmacy',
  colors: {
    primary: '188 72% 28%',       // Distinct Deep Teal (#146D7B)
    primaryForeground: '0 0% 100%',
    secondary: '188 45% 45%',
    secondaryForeground: '0 0% 100%',
    accent: '168 60% 40%',        // Clinical Mint
    accentForeground: '0 0% 100%',
    muted: '188 35% 96%',         // Soothing pastel background
    mutedForeground: '188 25% 40%',
  },
  logo: {
    initial: 'A',
    text: 'Apex Health',
    tagline: 'Healthcare & Pharmacy Platform',
  },
  contact: {
    phone: '+231 777 000 000',
    whatsapp: '+231 777 000 000',
    email: 'info@apexhealth.com',
    address: 'Monrovia, Liberia',
  },
}
```

### Step 2: Set as Active Theme

```typescript
export const activeTheme = themes.yourpharmacy;
```

**That's it!** The entire UI, SEO metadata, openGraph tags, and theme variables will immediately use your brand.

---

## 🎨 Color System Guide

- **Primary (`--primary`)**: Main brand color used for primary buttons, active nav elements, brand accents, and prominent icons.
  - *Default (PharmaCare)*: Distinct Deep Ocean Teal (`#146D7B` / `188 72% 28%`).
- **Secondary (`--secondary`)**: Complementary secondary tone for softer badges, gradient endpoints, and secondary controls.
- **Accent (`--accent`)**: Highlight tone for calls-to-action, alerts, and pill tags (e.g. Clinical Mint `#29A384` or Coral).
- **Muted (`--muted`)**: Soft, soothing pastel background tone matching the category card aesthetic (`#F0F9FA`).

### Converting Hex to HSL for `theme-config.ts`

Tailwind CSS variables expect HSL format without commas or the `hsl()` wrapper (e.g., `188 72% 28%`):
1. Pick your HEX color (e.g., `#146D7B`).
2. Convert using any color tool or calculator to HSL values (`H: 188, S: 72%, L: 28%`).
3. Enter as `'188 72% 28%'`.

---

## 📱 PWA & Favicon Branding

To customize the mobile app icon and install prompt:
- Update `public/manifest.json` (`name`, `short_name`, and `theme_color`).
- Place your 192x192 and 512x512 app icons in `public/icons/`.

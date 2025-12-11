# 🎨 Branding Customization Guide

This application is designed to be easily rebranded for different pharmacies. Follow this guide to customize the branding.

## Quick Start

### Option 1: Use Pre-configured Theme

We have pre-configured themes ready to use:

1. Open `lib/theme-config.ts`
2. Change the `activeTheme` to your pharmacy:
   ```typescript
   export const activeTheme = themes.mopharma;  // or themes.luckypharmacy
   ```
3. Update `app/globals.css` with the new theme colors (see below)

### Option 2: Create New Theme

1. Open `lib/theme-config.ts`
2. Add your pharmacy theme:
   ```typescript
   yourpharmacy: {
     name: 'Your Pharmacy Name',
     colors: {
       primary: '142 76% 36%',     // Your main brand color
       accent: '25 95% 53%',       // Your accent color
       // ... other colors
     },
     logo: {
       initial: 'Y',
       text: 'Your Pharmacy',
       tagline: 'Your Tagline',
     },
     contact: {
       phone: '+231 XXX XXX XXX',
       // ... other contact info
     },
   }
   ```

3. Set as active theme:
   ```typescript
   export const activeTheme = themes.yourpharmacy;
   ```

## Updating CSS Variables

After changing the theme in `theme-config.ts`, update `app/globals.css`:

```css
:root {
  --primary: 142 76% 36%;        /* Copy from theme-config.ts */
  --accent: 25 95% 53%;          /* Copy from theme-config.ts */
  /* ... other variables */
}
```

## Converting Colors to HSL

Your designer probably gave you HEX colors (#10B981). Here's how to convert:

1. Go to: https://www.cssportal.com/css-color-converter/
2. Input your HEX color (e.g., `#10B981`)
3. Copy the HSL values (e.g., `142, 76%, 36%`)
4. Format as: `142 76% 36%` (remove commas, no hsl() wrapper)

## Color Usage Guide

- **Primary**: Main brand color
  - Used for: Buttons, links, navigation highlights
  - Example: MoPharma green (#10B981)

- **Secondary**: Lighter version of primary
  - Used for: Hover states, backgrounds
  - Usually 10% lighter than primary

- **Accent**: Contrasting highlight color
  - Used for: Call-to-action buttons, badges, important alerts
  - Example: MoPharma orange (#FF6B35)

## Updating Brand Text

### 1. Header Component
Update: `components/shared/header.tsx`
- Logo initial (line 35)
- Pharmacy name (line 38)

### 2. Footer Component
Update: `components/shared/footer.tsx`
- Logo initial (line 13)
- Pharmacy name (line 16)
- Contact information (lines 80-100)

### 3. Homepage
Update: `app/page.tsx`
- All mentions of "MoPharma"

### 4. Layout (SEO)
Update: `app/layout.tsx`
- Page title
- Meta description

## Testing Your Changes

1. Save all files
2. Run: `npm run dev`
3. Open: http://localhost:3000
4. Check:
   - ✅ Logo and name updated
   - ✅ Colors match your brand
   - ✅ Contact info correct
   - ✅ All buttons use correct colors

## Example: Rebranding for Lucky Pharmacy

```typescript
// 1. In lib/theme-config.ts
export const activeTheme = themes.luckypharmacy;

// 2. In app/globals.css
:root {
  --primary: 217 91% 60%;
  --accent: 45 93% 47%;
}

// 3. In components/shared/header.tsx
<span className="text-2xl font-bold text-white">L</span>
<span className="text-xl font-bold text-primary">Lucky Pharmacy</span>

// 4. Done! Run npm run dev
```

## Need Help?

- Check the color picker: https://www.cssportal.com/css-color-converter/
- Test HSL colors: https://hslpicker.com/
- Questions? Contact: [your email]

## Current Theme: MoPharma

- **Primary Color**: Green (#10B981)
- **Accent Color**: Orange (#FF6B35)
- **Theme**: Modern, trustworthy, health-focused

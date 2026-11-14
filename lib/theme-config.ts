/**
 * Theme Configuration
 * 
 * This file allows easy customization of the pharmacy brand colors.
 * Changing the theme or colors here automatically updates the entire codebase dynamically!
 * 
 * Active Theme: PharmaCare (Deep Petrol Teal & Soothing Pastel Accents)
 */

export const themes = {
  // 1. PharmaCare (Recommended) - Distinct Deep Ocean Teal with soft medical mint & pastel accents
  pharmacare: {
    name: 'PharmaCare',
    colors: {
      // Primary color (Deep Petrol Teal) - Calm, distinct, and premium healthcare feel
      primary: '188 72% 28%',        // #145967 - non-harsh, distinct medical teal
      primaryForeground: '0 0% 100%',

      // Secondary color (Soft Sea Slate)
      secondary: '188 45% 45%',      // #408F9F
      secondaryForeground: '0 0% 100%',

      // Accent color (Soft Medical Mint)
      accent: '168 60% 40%',         // #29A384 - refreshing clinical mint
      accentForeground: '0 0% 100%',

      // Muted / Pastel backgrounds (gentle soothing tint, matches category cards aesthetic)
      muted: '188 35% 96%',          // #F0F9FA
      mutedForeground: '188 25% 40%',
    },
    logo: {
      initial: 'P',
      text: 'PharmaCare',
      tagline: 'Healthcare & Pharmacy Platform',
    },
    contact: {
      phone: '+231 777 000 000',
      whatsapp: '+231 777 000 000',
      email: 'info@pharmacare.com',
      address: 'Tubman Boulevard, Sinkor, Monrovia, Liberia',
    },
  },

  // 2. Nordic Indigo - Sophisticated slate-indigo with soft periwinkle & lavender tones
  nordic: {
    name: 'NordicCare',
    colors: {
      primary: '228 45% 35%',        // #314682
      primaryForeground: '0 0% 100%',
      secondary: '228 35% 55%',
      secondaryForeground: '0 0% 100%',
      accent: '255 55% 62%',         // Soft lavender/iris
      accentForeground: '0 0% 100%',
      muted: '228 30% 96%',          // Pastel periwinkle
      mutedForeground: '228 20% 45%',
    },
    logo: {
      initial: 'N',
      text: 'NordicCare',
      tagline: 'Modern Health & Pharmacy',
    },
    contact: {
      phone: '+231 777 000 000',
      whatsapp: '+231 777 000 000',
      email: 'info@nordiccare.com',
      address: 'Monrovia, Liberia',
    },
  },

  // 3. Clinical Sapphire - Clean medical royal slate
  sapphire: {
    name: 'CarePoint',
    colors: {
      primary: '210 65% 35%',
      primaryForeground: '0 0% 100%',
      secondary: '205 60% 50%',
      secondaryForeground: '0 0% 100%',
      accent: '185 70% 42%',
      accentForeground: '0 0% 100%',
      muted: '210 30% 96%',
      mutedForeground: '210 20% 45%',
    },
    logo: {
      initial: 'C',
      text: 'CarePoint',
      tagline: 'Pharmacy Platform',
    },
    contact: {
      phone: '+231 777 000 000',
      whatsapp: '+231 777 000 000',
      email: 'info@carepoint.com',
      address: 'Monrovia, Liberia',
    },
  },

  mopharma: {
    name: 'MoPharma',
    colors: {
      // Primary color (Green) - Used for main buttons, links, and primary actions
      primary: '142 76% 36%',        // hsl format for Tailwind
      primaryForeground: '0 0% 100%',

      // Secondary color (Light Green) - Used for hover states and secondary elements
      secondary: '142 71% 45%',
      secondaryForeground: '0 0% 100%',

      // Accent color (Orange) - Used for calls-to-action and highlights
      accent: '25 95% 53%',
      accentForeground: '0 0% 100%',

      // Muted backgrounds
      muted: '142 30% 96%',
      mutedForeground: '0 0% 45%',
    },
    logo: {
      initial: 'M',
      text: 'MoPharma',
      tagline: 'Online Pharmacy',
    },
    contact: {
      phone: '+231 777 123 456',
      whatsapp: '+231 777 123 456',
      email: 'info@mopharma.com',
      address: 'Tubman Boulevard, Sinkor, Monrovia, Liberia',
    },
  },

  demo: {
    name: 'PharmacyDemo',
    colors: {
      // Primary color (Blue)
      primary: '221 83% 53%',
      primaryForeground: '0 0% 100%',

      // Secondary color (Cyan)
      secondary: '199 89% 48%',
      secondaryForeground: '0 0% 100%',

      // Accent color (Coral)
      accent: '25 95% 53%',
      accentForeground: '0 0% 100%',

      // Muted backgrounds
      muted: '210 40% 96%',
      mutedForeground: '0 0% 45%',
    },
    logo: {
      initial: 'P',
      text: 'PharmacyDemo',
      tagline: 'Online Pharmacy',
    },
    contact: {
      phone: '+231 XXX XXX XXX',
      whatsapp: '+231 XXX XXX XXX',
      email: 'info@pharmacy.com',
      address: 'Monrovia, Liberia',
    },
  },
};

// Active theme - change this to switch pharmacy branding
export const activeTheme = themes.pharmacare;

/**
 * HOW TO REBRAND FOR A NEW PHARMACY:
 * 
 * 1. Add a new theme object to the 'themes' object above
 * 2. Update the colors using HSL format (Hue Saturation Lightness)
 * 3. Update logo text and contact information
 * 4. Change activeTheme to your new theme
 * 5. Run: npm run dev to see changes
 * 
 * COLOR TIPS:
 * - Primary: Main brand color (buttons, links)
 * - Secondary: Lighter version for hover states
 * - Accent: Contrasting color for CTAs and highlights
 * 
 * To find HSL values from hex colors:
 * - Use: https://www.cssportal.com/css-color-converter/
 * - Input your hex color (e.g., #10B981)
 * - Get HSL values (e.g., 142 76% 36%)
 * - Format as: '142 76% 36%' (without hsl() wrapper)
 */

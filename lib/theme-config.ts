/**
 * Theme Configuration
 * 
 * This file allows easy customization of the pharmacy brand colors.
 * Simply update the values below to rebrand the entire application.
 * 
 * Current Theme: MoPharma (Green & Orange)
 */

export const themes = {
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
  
  luckypharmacy: {
    name: 'Lucky Pharmacy',
    colors: {
      // Primary color (Blue)
      primary: '217 91% 60%',
      primaryForeground: '0 0% 100%',
      
      // Secondary color
      secondary: '217 85% 70%',
      secondaryForeground: '0 0% 100%',
      
      // Accent color (Gold)
      accent: '45 93% 47%',
      accentForeground: '0 0% 9%',
      
      // Muted backgrounds
      muted: '217 30% 96%',
      mutedForeground: '0 0% 45%',
    },
    logo: {
      initial: 'L',
      text: 'Lucky Pharmacy',
      tagline: 'Your Health Partner',
    },
    contact: {
      phone: '+231 XXX XXX XXX',
      whatsapp: '+231 XXX XXX XXX',
      email: 'info@luckypharmacy.com',
      address: 'Monrovia, Liberia',
    },
  },
  
  demo: {
    name: 'PharmacyDemo',
    colors: {
      // Primary color (Blue)
      primary: '221 83% 53%',
      primaryForeground: '0 0% 100%',
      
      // Secondary color (Green)
      secondary: '142 76% 36%',
      secondaryForeground: '0 0% 100%',
      
      // Accent color (Orange)
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
export const activeTheme = themes.luckypharmacy;

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

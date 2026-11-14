// lib/utils/image-placeholders.ts
// Category-based icon and gradient fallback system for products without images

import {
  Pill,
  Syringe,
  Leaf,
  Thermometer,
  Cross,
  Baby,
  Droplets,
  Activity,
  Package,
  Heart,
  Eye,
  Sparkles,
  Shield,
  Bone,
  Brain,
  type LucideIcon,
} from 'lucide-react';

/**
 * Category icon and gradient configuration
 */
export interface CategoryStyle {
  icon: LucideIcon;
  gradient: string;
  bgColor: string;
  iconColor: string;
  label: string;
}

/**
 * Map category names/slugs to their visual styles
 * Keys should match your category slugs or names (lowercase)
 */
export const categoryStyles: Record<string, CategoryStyle> = {
  // Pain Relief / Analgesics
  'pain-relief': {
    icon: Pill,
    gradient: 'from-red-500 to-rose-600',
    bgColor: 'bg-red-50',
    iconColor: 'text-red-500',
    label: 'Pain Relief',
  },
  'analgesics': {
    icon: Pill,
    gradient: 'from-red-500 to-rose-600',
    bgColor: 'bg-red-50',
    iconColor: 'text-red-500',
    label: 'Analgesics',
  },

  // Antibiotics
  'antibiotics': {
    icon: Syringe,
    gradient: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-500',
    label: 'Antibiotics',
  },
  'anti-infectives': {
    icon: Syringe,
    gradient: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-500',
    label: 'Anti-Infectives',
  },

  // Vitamins & Supplements
  'vitamins': {
    icon: Leaf,
    gradient: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-500',
    label: 'Vitamins',
  },
  'vitamins-supplements': {
    icon: Leaf,
    gradient: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-500',
    label: 'Vitamins & Supplements',
  },
  'supplements': {
    icon: Leaf,
    gradient: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-500',
    label: 'Supplements',
  },

  // Cold & Flu
  'cold-flu': {
    icon: Thermometer,
    gradient: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-500',
    label: 'Cold & Flu',
  },
  'respiratory': {
    icon: Thermometer,
    gradient: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-500',
    label: 'Respiratory',
  },

  // First Aid
  'first-aid': {
    icon: Cross,
    gradient: 'from-red-600 to-red-700',
    bgColor: 'bg-red-50',
    iconColor: 'text-red-600',
    label: 'First Aid',
  },
  'wound-care': {
    icon: Cross,
    gradient: 'from-red-600 to-red-700',
    bgColor: 'bg-red-50',
    iconColor: 'text-red-600',
    label: 'Wound Care',
  },

  // Baby Care
  'baby-care': {
    icon: Baby,
    gradient: 'from-pink-400 to-pink-600',
    bgColor: 'bg-pink-50',
    iconColor: 'text-pink-500',
    label: 'Baby Care',
  },
  'pediatric': {
    icon: Baby,
    gradient: 'from-pink-400 to-pink-600',
    bgColor: 'bg-pink-50',
    iconColor: 'text-pink-500',
    label: 'Pediatric',
  },

  // Personal Care
  'personal-care': {
    icon: Droplets,
    gradient: 'from-cyan-500 to-teal-600',
    bgColor: 'bg-cyan-50',
    iconColor: 'text-cyan-500',
    label: 'Personal Care',
  },
  'hygiene': {
    icon: Droplets,
    gradient: 'from-cyan-500 to-teal-600',
    bgColor: 'bg-cyan-50',
    iconColor: 'text-cyan-500',
    label: 'Hygiene',
  },

  // Diabetes Care
  'diabetes': {
    icon: Activity,
    gradient: 'from-orange-500 to-amber-600',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-500',
    label: 'Diabetes Care',
  },
  'diabetes-care': {
    icon: Activity,
    gradient: 'from-orange-500 to-amber-600',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-500',
    label: 'Diabetes Care',
  },

  // Heart & Blood Pressure
  'cardiovascular': {
    icon: Heart,
    gradient: 'from-rose-500 to-red-600',
    bgColor: 'bg-rose-50',
    iconColor: 'text-rose-500',
    label: 'Cardiovascular',
  },
  'heart-health': {
    icon: Heart,
    gradient: 'from-rose-500 to-red-600',
    bgColor: 'bg-rose-50',
    iconColor: 'text-rose-500',
    label: 'Heart Health',
  },

  // Eye Care
  'eye-care': {
    icon: Eye,
    gradient: 'from-sky-500 to-blue-600',
    bgColor: 'bg-sky-50',
    iconColor: 'text-sky-500',
    label: 'Eye Care',
  },
  'ophthalmic': {
    icon: Eye,
    gradient: 'from-sky-500 to-blue-600',
    bgColor: 'bg-sky-50',
    iconColor: 'text-sky-500',
    label: 'Ophthalmic',
  },

  // Skin Care
  'skin-care': {
    icon: Sparkles,
    gradient: 'from-fuchsia-500 to-purple-600',
    bgColor: 'bg-fuchsia-50',
    iconColor: 'text-fuchsia-500',
    label: 'Skin Care',
  },
  'dermatology': {
    icon: Sparkles,
    gradient: 'from-fuchsia-500 to-purple-600',
    bgColor: 'bg-fuchsia-50',
    iconColor: 'text-fuchsia-500',
    label: 'Dermatology',
  },

  // Immunity
  'immunity': {
    icon: Shield,
    gradient: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    label: 'Immunity',
  },
  'immune-support': {
    icon: Shield,
    gradient: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    label: 'Immune Support',
  },

  // Bone & Joint
  'bone-joint': {
    icon: Bone,
    gradient: 'from-amber-500 to-yellow-600',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
    label: 'Bone & Joint',
  },
  'orthopedic': {
    icon: Bone,
    gradient: 'from-amber-500 to-yellow-600',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
    label: 'Orthopedic',
  },

  // Mental Health / Neurological
  'mental-health': {
    icon: Brain,
    gradient: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-500',
    label: 'Mental Health',
  },
  'neurological': {
    icon: Brain,
    gradient: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-500',
    label: 'Neurological',
  },
};

/**
 * Default style for unknown categories
 */
export const defaultStyle: CategoryStyle = {
  icon: Package,
  gradient: 'from-gray-500 to-slate-600',
  bgColor: 'bg-gray-50',
  iconColor: 'text-gray-500',
  label: 'Product',
};

/**
 * Get category style by category name or slug
 * Normalizes the input to match against our style map
 */
export function getCategoryStyle(category: string | null | undefined): CategoryStyle {
  if (!category) return defaultStyle;

  // Normalize: lowercase, replace spaces with hyphens
  const normalized = category
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  // Try exact match first
  if (categoryStyles[normalized]) {
    return categoryStyles[normalized];
  }

  // Try partial match (category contains key or key contains category)
  for (const [key, style] of Object.entries(categoryStyles)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return style;
    }
  }

  // Fallback to default
  return defaultStyle;
}

/**
 * Get icon component for a category
 */
export function getCategoryIcon(category: string | null | undefined): LucideIcon {
  return getCategoryStyle(category).icon;
}

/**
 * Get gradient classes for a category
 */
export function getCategoryGradient(category: string | null | undefined): string {
  return getCategoryStyle(category).gradient;
}

/**
 * Generate inline style for gradient background
 * Use this when Tailwind classes aren't available
 */
export function getCategoryGradientStyle(category: string | null | undefined): React.CSSProperties {
  const style = getCategoryStyle(category);
  const gradientColors = style.gradient
    .replace('from-', '')
    .replace('to-', '')
    .split(' ');

  // Map Tailwind color names to approximate hex values
  const colorMap: Record<string, string> = {
    'red-500': '#ef4444',
    'rose-600': '#e11d48',
    'blue-500': '#3b82f6',
    'indigo-600': '#4f46e5',
    'green-500': '#22c55e',
    'emerald-600': '#059669',
    'purple-500': '#a855f7',
    'violet-600': '#7c3aed',
    'red-600': '#dc2626',
    'red-700': '#b91c1c',
    'pink-400': '#f472b6',
    'pink-600': '#db2777',
    'cyan-500': '#06b6d4',
    'teal-600': '#0d9488',
    'orange-500': '#f97316',
    'amber-600': '#d97706',
    'gray-500': '#6b7280',
    'slate-600': '#475569',
    'rose-500': '#f43f5e',
    'sky-500': '#0ea5e9',
    'blue-600': '#2563eb',
    'fuchsia-500': '#d946ef',
    'emerald-500': '#10b981',
    'amber-500': '#f59e0b',
    'yellow-600': '#ca8a04',
    'indigo-500': '#6366f1',
  };

  const fromColor = colorMap[gradientColors[0]] || '#6b7280';
  const toColor = colorMap[gradientColors[1]] || '#475569';

  return {
    background: `linear-gradient(135deg, ${fromColor} 0%, ${toColor} 100%)`,
  };
}

/**
 * Curated demo stock photography for categories/products when no custom image is uploaded
 */
export const categoryDemoImages: Record<string, string> = {
  'pain-relief': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
  'analgesics': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
  'antibiotics': 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80',
  'anti-infectives': 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80',
  'vitamins': 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=600&q=80',
  'vitamins-supplements': 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=600&q=80',
  'supplements': 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=600&q=80',
  'cold-flu': 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80',
  'respiratory': 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80',
  'first-aid': 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=600&q=80',
  'wound-care': 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=600&q=80',
  'baby-care': 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
  'pediatric': 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
  'personal-care': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
  'hygiene': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
  'diabetes': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
  'diabetes-care': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
  'cardiovascular': 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=600&q=80',
  'heart-health': 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=600&q=80',
  'eye-care': 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=600&q=80',
  'skin-care': 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
  'immunity': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
  'bone-joint': 'https://images.unsplash.com/photo-1550572017-ed21f64f895c?auto=format&fit=crop&w=600&q=80',
  'default': 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80',
};

export function getCategoryDemoImage(category: string | null | undefined, productName?: string): string {
  if (productName) {
    const lowerName = productName.toLowerCase();
    if (lowerName.includes('paracetamol') || lowerName.includes('panadol') || lowerName.includes('ibuprofen') || lowerName.includes('aspirin') || lowerName.includes('pain')) {
      return categoryDemoImages['pain-relief'];
    }
    if (lowerName.includes('amoxicillin') || lowerName.includes('cipro') || lowerName.includes('antibiotic') || lowerName.includes('capsule')) {
      return categoryDemoImages['antibiotics'];
    }
    if (lowerName.includes('vitamin') || lowerName.includes('zinc') || lowerName.includes('calcium') || lowerName.includes('multivitamin') || lowerName.includes('supplement')) {
      return categoryDemoImages['vitamins'];
    }
    if (lowerName.includes('syrup') || lowerName.includes('cough') || lowerName.includes('cold') || lowerName.includes('flu')) {
      return categoryDemoImages['cold-flu'];
    }
    if (lowerName.includes('bandage') || lowerName.includes('plaster') || lowerName.includes('gauze') || lowerName.includes('antiseptic') || lowerName.includes('first aid')) {
      return categoryDemoImages['first-aid'];
    }
    if (lowerName.includes('baby') || lowerName.includes('diaper') || lowerName.includes('infant')) {
      return categoryDemoImages['baby-care'];
    }
    if (lowerName.includes('soap') || lowerName.includes('shampoo') || lowerName.includes('lotion') || lowerName.includes('hygiene')) {
      return categoryDemoImages['personal-care'];
    }
  }

  if (!category) return categoryDemoImages['default'];
  const normalized = category.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  if (categoryDemoImages[normalized]) return categoryDemoImages[normalized];
  for (const [key, img] of Object.entries(categoryDemoImages)) {
    if (normalized.includes(key) || key.includes(normalized)) return img;
  }
  return categoryDemoImages['default'];
}

// Modern Design System - Minimalist & Premium
export const colors = {
  // Primary palette
  white: '#FFFFFF',
  black: '#1A1A1A',
  charcoal: '#2D3748',
  
  // Backgrounds
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceHover: '#F1F5F9',
  
  // Text
  textPrimary: '#1A1A1A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  
  // Borders
  border: '#E2E8F0',
  borderHover: '#CBD5E1',
  
  // Interactive
  primary: '#2563EB',
  primaryHover: '#1D4ED8',
  secondary: '#F1F5F9',
  secondaryHover: '#E2E8F0',
  
  // Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  
  // Price colors
  priceLow: '#10B981',
  priceMedium: '#3B82F6',
  priceHigh: '#8B5CF6',
  pricePremium: '#EF4444'
}

export const typography = {
  fontFamily: {
    primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'JetBrains Mono, "SF Mono", Monaco, "Cascadia Code", monospace'
  },
  
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem'
  },
  
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75
  }
}

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem'
}

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px'
}

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 1px 3px rgba(0, 0, 0, 0.1)',
  lg: '0 4px 6px rgba(0, 0, 0, 0.1)',
  xl: '0 10px 15px rgba(0, 0, 0, 0.1)',
  '2xl': '0 20px 25px rgba(0, 0, 0, 0.1)'
}

export const transitions = {
  fast: '0.15s ease',
  normal: '0.2s ease',
  slow: '0.3s ease'
}

// Component styles
export const components = {
  card: {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.sm,
    transition: `all ${transitions.normal}`,
    '&:hover': {
      boxShadow: shadows.lg,
      transform: 'translateY(-2px)'
    }
  },
  
  button: {
    primary: {
      background: colors.black,
      color: colors.white,
      border: 'none',
      borderRadius: borderRadius.full,
      padding: `${spacing.sm} ${spacing.lg}`,
      fontWeight: typography.fontWeight.semibold,
      transition: `all ${transitions.normal}`,
      '&:hover': {
        background: colors.charcoal,
        transform: 'translateY(-1px)'
      }
    },
    
    secondary: {
      background: colors.secondary,
      color: colors.textPrimary,
      border: `1px solid ${colors.border}`,
      borderRadius: borderRadius.full,
      padding: `${spacing.sm} ${spacing.lg}`,
      fontWeight: typography.fontWeight.medium,
      transition: `all ${transitions.normal}`,
      '&:hover': {
        background: colors.secondaryHover,
        borderColor: colors.borderHover
      }
    }
  },
  
  input: {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: borderRadius.md,
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: typography.fontSize.sm,
    transition: `all ${transitions.normal}`,
    '&:focus': {
      outline: 'none',
      borderColor: colors.primary,
      boxShadow: `0 0 0 3px rgba(37, 99, 235, 0.1)`
    }
  }
}

// Utility functions
export const getPriceColor = (price) => {
  if (!price || price <= 0) return colors.textMuted
  if (price < 50) return colors.priceLow
  if (price < 200) return colors.priceMedium
  if (price < 500) return colors.priceHigh
  return colors.pricePremium
}

export const formatPrice = (price) => {
  if (!price || price <= 0) return 'N/A'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(price)
} 
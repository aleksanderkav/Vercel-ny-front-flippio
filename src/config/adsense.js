// AdSense Configuration
// Replace 'ca-pub-XXXXXXXXXXXXXXXX' with your actual AdSense client ID

export const ADSENSE_CONFIG = {
  // Your AdSense client ID
  CLIENT_ID: 'ca-pub-XXXXXXXXXXXXXXXX',
  
  // Ad slot configurations
  AD_SLOTS: {
    // Below search field
    'search-below': {
      format: 'auto',
      responsive: true,
      description: 'Ad below search field'
    },
    
    // Every 10th card in grid
    'card-grid-1': {
      format: 'auto',
      responsive: true,
      description: 'Ad after 10th card'
    },
    'card-grid-2': {
      format: 'auto',
      responsive: true,
      description: 'Ad after 20th card'
    },
    'card-grid-3': {
      format: 'auto',
      responsive: true,
      description: 'Ad after 30th card'
    },
    
    // Bottom of page
    'bottom-page': {
      format: 'auto',
      responsive: true,
      description: 'Ad at bottom of page'
    },
    
    // Sidebar (future use)
    'sidebar': {
      format: 'auto',
      responsive: true,
      description: 'Sidebar ad'
    }
  },
  
  // AdSense script URL
  SCRIPT_URL: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
  
  // Development mode (shows placeholders instead of real ads)
  DEV_MODE: process.env.NODE_ENV === 'development',
  
  // Disable ads on specific routes
  DISABLED_ROUTES: [
    '/embed',
    '/api'
  ],
  
  // Check if ads should be disabled
  shouldDisableAds: () => {
    const currentPath = window.location.pathname
    const isEmbed = currentPath === '/embed' || 
                   window.location.search.includes('embed=true')
    
    return isEmbed || ADSENSE_CONFIG.DISABLED_ROUTES.includes(currentPath)
  }
}

// Ad slot helper functions
export const getAdSlotConfig = (slotName) => {
  return ADSENSE_CONFIG.AD_SLOTS[slotName] || {
    format: 'auto',
    responsive: true,
    description: 'Default ad slot'
  }
}

export const isAdSenseEnabled = () => {
  return !ADSENSE_CONFIG.shouldDisableAds() && !ADSENSE_CONFIG.DEV_MODE
}

// Generate unique ad slot names for dynamic content
export const generateAdSlotName = (baseName, index) => {
  return `${baseName}-${index}`
} 
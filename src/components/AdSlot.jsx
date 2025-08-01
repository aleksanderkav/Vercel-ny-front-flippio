import React, { useEffect, useRef } from 'react'
import { colors, typography, spacing, borderRadius } from '../styles/designSystem'

const AdSlot = ({ 
  adSlot, 
  adFormat = 'auto', 
  style = 'display:block',
  fullWidthResponsive = true,
  className = '',
  placeholder = true 
}) => {
  const adRef = useRef(null)
  const [isAdSenseLoaded, setIsAdSenseLoaded] = React.useState(false)
  const [isEmbedMode, setIsEmbedMode] = React.useState(false)

  useEffect(() => {
    // Check if we're in embed mode
    const isEmbed = window.location.pathname === '/embed' || 
                   window.location.search.includes('embed=true')
    setIsEmbedMode(isEmbed)

    // Don't load ads in embed mode
    if (isEmbed) {
      return
    }

    // Load AdSense script dynamically
    const loadAdSense = () => {
      if (window.adsbygoogle) {
        setIsAdSenseLoaded(true)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
      script.async = true
      script.crossOrigin = 'anonymous'
      
      // Replace with your actual AdSense client ID
      script.setAttribute('data-ad-client', 'ca-pub-5999810645137867')
      
      script.onload = () => {
        setIsAdSenseLoaded(true)
        console.log('🎯 AdSense script loaded')
      }
      
      script.onerror = () => {
        console.error('❌ Failed to load AdSense script')
      }
      
      document.head.appendChild(script)
    }

    loadAdSense()
  }, [])

  useEffect(() => {
    if (isAdSenseLoaded && adRef.current && !isEmbedMode) {
      try {
        // Push the ad to AdSense
        (window.adsbygoogle = window.adsbygoogle || []).push({})
        console.log('🎯 Ad pushed to AdSense:', adSlot)
      } catch (error) {
        console.error('❌ Error pushing ad:', error)
      }
    }
  }, [isAdSenseLoaded, adSlot, isEmbedMode])

  // Don't render ads in embed mode
  if (isEmbedMode) {
    return null
  }

  const adContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: adFormat === 'auto' ? '100px' : '250px',
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: borderRadius.md,
    margin: `${spacing.md} 0`,
    overflow: 'hidden',
    position: 'relative'
  }

  const placeholderStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    textAlign: 'center'
  }

  const adStyle = {
    display: 'block',
    textAlign: 'center',
    overflow: 'hidden',
    lineHeight: '0'
  }

  if (!isAdSenseLoaded && placeholder) {
    return (
      <div style={adContainerStyle} className={className}>
        <div style={placeholderStyle}>
          <div style={{ fontSize: '2rem', marginBottom: spacing.sm }}>📢</div>
          <div style={{ fontWeight: typography.fontWeight.medium, marginBottom: spacing.xs }}>
            Advertisement
          </div>
          <div style={{ fontSize: typography.fontSize.xs, opacity: 0.7 }}>
            Loading ad...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={adContainerStyle} className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={adStyle}
        data-ad-client="ca-pub-5999810645137867" // Replace with your client ID
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive}
      />
    </div>
  )
}

export default AdSlot 
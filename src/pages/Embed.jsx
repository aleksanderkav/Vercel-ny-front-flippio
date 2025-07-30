import React from 'react'
import PublicCardTracker from '../components/PublicCardTracker'

const Embed = () => {
  // Get URL parameters for customization
  const urlParams = new URLSearchParams(window.location.search)
  const theme = urlParams.get('theme') || 'light'
  const maxCards = parseInt(urlParams.get('maxCards')) || 20
  const showStats = urlParams.get('showStats') !== 'false'
  const showScraper = urlParams.get('showScraper') === 'true'

  return (
    <div style={{
      minHeight: '100vh',
      background: theme === 'dark' ? '#1A1A1A' : '#F8FAFC',
      padding: '1rem',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <PublicCardTracker
        embedMode={true}
        theme={theme}
        maxCards={maxCards}
        showStats={showStats}
        showScraper={showScraper}
      />
    </div>
  )
}

export default Embed 
import React from 'react'
import PublicCardTracker from '../components/PublicCardTracker'

const Embed = () => {
  // Get URL parameters for customization
  const urlParams = new URLSearchParams(window.location.search)
  const theme = urlParams.get('theme') || 'light'
  const maxCards = parseInt(urlParams.get('maxCards')) || 20
  const showStats = urlParams.get('showStats') !== 'false'
  const showScraper = urlParams.get('showScraper') === 'true'
  const showSearch = urlParams.get('showSearch') !== 'false'
  const showPagination = urlParams.get('showPagination') !== 'false'
  const showSorting = urlParams.get('showSorting') !== 'false'

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
        showSearch={showSearch}
        showPagination={showPagination}
        showSorting={showSorting}
      />
    </div>
  )
}

export default Embed 
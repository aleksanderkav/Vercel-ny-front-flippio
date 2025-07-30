import React, { useState } from 'react'
import { scrapeAndInsertCard, batchScrapeCards, getCardStats } from '../lib/cardScraper'

const CardScraper = ({ onCardAdded, onRefresh }) => {
  const [scrapingMode, setScrapingMode] = useState('single') // 'single' or 'batch'
  const [singleCardName, setSingleCardName] = useState('')
  const [batchCardNames, setBatchCardNames] = useState('')
  const [isScraping, setIsScraping] = useState(false)
  const [scrapingStatus, setScrapingStatus] = useState('')
  const [lastResult, setLastResult] = useState(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSingleScrape = async () => {
    if (!singleCardName.trim()) {
      setScrapingStatus('❌ Please enter a card name')
      return
    }

    setIsScraping(true)
    setScrapingStatus('🔍 Scraping card data...')
    setLastResult(null)

    try {
      const result = await scrapeAndInsertCard(singleCardName.trim())
      setLastResult(result)
      
      if (result.success) {
        setScrapingStatus(`✅ Successfully ${result.action} "${result.cardName}" - $${result.latestPrice}`)
        setSingleCardName('') // Clear input on success
        if (onCardAdded) onCardAdded(result)
        if (onRefresh) onRefresh()
      } else {
        setScrapingStatus(`❌ Failed to scrape "${result.cardName}": ${result.error}`)
      }
    } catch (error) {
      console.error('Scraping error:', error)
      setScrapingStatus(`❌ Error: ${error.message || 'Unknown error occurred'}`)
    } finally {
      setIsScraping(false)
    }
  }

  const handleBatchScrape = async () => {
    const cardNames = batchCardNames
      .split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0)

    if (cardNames.length === 0) {
      setScrapingStatus('❌ Please enter at least one card name')
      return
    }

    setIsScraping(true)
    setScrapingStatus(`🔄 Starting batch scrape for ${cardNames.length} cards...`)
    setLastResult(null)

    try {
      const result = await batchScrapeCards(cardNames)
      setLastResult(result)
      
      if (result.successful > 0) {
        setScrapingStatus(`✅ Batch completed: ${result.successful}/${result.total} cards processed successfully`)
        setBatchCardNames('') // Clear input on success
        if (onRefresh) onRefresh()
      } else {
        setScrapingStatus(`❌ Batch failed: ${result.failed}/${result.total} cards failed`)
      }
    } catch (error) {
      console.error('Batch scraping error:', error)
      setScrapingStatus(`❌ Error: ${error.message || 'Unknown error occurred'}`)
    } finally {
      setIsScraping(false)
    }
  }

  const handleGetStats = async () => {
    setIsScraping(true)
    setScrapingStatus('📊 Getting card statistics...')

    try {
      const stats = await getCardStats()
      setLastResult({ type: 'stats', data: stats })
      setScrapingStatus(`📊 Statistics loaded: ${stats.totalCards} total cards`)
    } catch (error) {
      console.error('Stats error:', error)
      setScrapingStatus(`❌ Error loading statistics: ${error.message}`)
    } finally {
      setIsScraping(false)
    }
  }

  const sampleCards = [
    'Charizard PSA 10 Base Set',
    'Pikachu PSA 9 Jungle',
    'Blastoise PSA 8 Base Set',
    'Venusaur PSA 10 Base Set'
  ]

  const loadSampleCards = () => {
    setBatchCardNames(sampleCards.join('\n'))
  }

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(20px)',
      borderRadius: '1.5rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 10px 20px -5px rgba(0, 0, 0, 0.1)',
      border: '2px solid rgba(226, 232, 240, 0.8)',
      padding: '2rem',
      marginBottom: '2rem'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '3rem',
          height: '3rem',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderRadius: '0.75rem',
          border: '1px solid rgba(99, 102, 241, 0.2)'
        }}>
          <span style={{ fontSize: '1.5rem' }}>🎯</span>
        </div>
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#1e293b',
            margin: 0
          }}>
            Card Scraper
          </h2>
          <p style={{
            color: '#64748b',
            margin: 0,
            fontSize: '0.875rem'
          }}>
            Add new cards to your collection
          </p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        background: 'rgba(248, 250, 252, 0.8)',
        borderRadius: '0.75rem',
        padding: '0.25rem'
      }}>
        <button
          onClick={() => setScrapingMode('single')}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: scrapingMode === 'single' ? '#ffffff' : '#64748b',
            backgroundColor: scrapingMode === 'single' ? '#6366f1' : 'transparent',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          📋 Single Card
        </button>
        <button
          onClick={() => setScrapingMode('batch')}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: scrapingMode === 'batch' ? '#ffffff' : '#64748b',
            backgroundColor: scrapingMode === 'batch' ? '#6366f1' : 'transparent',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          🔄 Batch Cards
        </button>
      </div>

      {/* Single Card Scraping */}
      {scrapingMode === 'single' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Card Name
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={singleCardName}
              onChange={(e) => setSingleCardName(e.target.value)}
              placeholder="e.g., Charizard PSA 10 Base Set"
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                border: '1px solid rgba(203, 213, 225, 0.6)',
                borderRadius: '0.5rem',
                outline: 'none',
                transition: 'all 0.2s',
                backgroundColor: 'rgba(255, 255, 255, 0.8)'
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSingleScrape()}
            />
            <button
              onClick={handleSingleScrape}
              disabled={isScraping || !singleCardName.trim()}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: isScraping || !singleCardName.trim() ? '#9ca3af' : '#10b981',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: isScraping || !singleCardName.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {isScraping ? '⏳ Scraping...' : '🎯 Scrape Card'}
            </button>
          </div>
        </div>
      )}

      {/* Batch Card Scraping */}
      {scrapingMode === 'batch' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Card Names (one per line)
          </label>
          <textarea
            value={batchCardNames}
            onChange={(e) => setBatchCardNames(e.target.value)}
            placeholder="Charizard PSA 10 Base Set&#10;Pikachu PSA 9 Jungle&#10;Blastoise PSA 8 Base Set"
            rows={4}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              fontSize: '0.875rem',
              border: '1px solid rgba(203, 213, 225, 0.6)',
              borderRadius: '0.5rem',
              outline: 'none',
              transition: 'all 0.2s',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginTop: '0.75rem'
          }}>
            <button
              onClick={handleBatchScrape}
              disabled={isScraping || !batchCardNames.trim()}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: isScraping || !batchCardNames.trim() ? '#9ca3af' : '#10b981',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: isScraping || !batchCardNames.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {isScraping ? '⏳ Scraping...' : '🔄 Scrape Batch'}
            </button>
            <button
              onClick={loadSampleCards}
              disabled={isScraping}
              style={{
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: '0.5rem',
                cursor: isScraping ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              📝 Load Samples
            </button>
          </div>
        </div>
      )}

      {/* Status Display */}
      {scrapingStatus && (
        <div style={{
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          backgroundColor: scrapingStatus.includes('✅') ? 'rgba(16, 185, 129, 0.1)' :
                          scrapingStatus.includes('❌') ? 'rgba(239, 68, 68, 0.1)' :
                          'rgba(59, 130, 246, 0.1)',
          border: `1px solid ${scrapingStatus.includes('✅') ? 'rgba(16, 185, 129, 0.2)' :
                                scrapingStatus.includes('❌') ? 'rgba(239, 68, 68, 0.2)' :
                                'rgba(59, 130, 246, 0.2)'}`,
          color: scrapingStatus.includes('✅') ? '#065f46' :
                 scrapingStatus.includes('❌') ? '#991b1b' :
                 '#1e40af'
        }}>
          {scrapingStatus}
        </div>
      )}

      {/* Advanced Options */}
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#6366f1',
            backgroundColor: 'transparent',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {showAdvanced ? '🔽 Hide' : '🔼 Show'} Advanced Options
        </button>
      </div>

      {showAdvanced && (
        <div style={{
          background: 'rgba(248, 250, 252, 0.8)',
          borderRadius: '0.75rem',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={handleGetStats}
              disabled={isScraping}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: isScraping ? '#9ca3af' : '#8b5cf6',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: isScraping ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              📊 Get Statistics
            </button>
          </div>
        </div>
      )}

      {/* Results Display */}
      {lastResult && (
        <div style={{
          background: 'rgba(248, 250, 252, 0.8)',
          borderRadius: '0.75rem',
          padding: '1rem',
          border: '1px solid rgba(203, 213, 225, 0.6)'
        }}>
          <h4 style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#374151',
            margin: '0 0 0.5rem 0'
          }}>
            📋 Last Result
          </h4>
          <pre style={{
            fontSize: '0.75rem',
            color: '#64748b',
            margin: 0,
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            background: 'rgba(255, 255, 255, 0.5)',
            padding: '0.5rem',
            borderRadius: '0.375rem',
            maxHeight: '200px',
            overflow: 'auto'
          }}>
            {JSON.stringify(lastResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default CardScraper 
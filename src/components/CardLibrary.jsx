import React, { useState } from 'react'
import CardGrid from './CardGrid'
import SearchBar from './SearchBar'

const CardLibrary = ({ 
  cards = [], 
  loading = false, 
  onRefresh,
  onRefreshPrices,
  onBatchScrape,
  onGetStats,
  filterCategory = 'all',
  setFilterCategory,
  sortBy = 'name',
  setSortBy,
  librarySearch = '',
  setLibrarySearch,
  onSearch,
  searchStatus
}) => {
  const [showScraper, setShowScraper] = useState(false)
  const [scrapingMode, setScrapingMode] = useState('single')
  const [singleCardName, setSingleCardName] = useState('')
  const [batchCardNames, setBatchCardNames] = useState('')
  const [scrapingStatus, setScrapingStatus] = useState('')
  const [lastResult, setLastResult] = useState(null)

  // Scraping functions
  const handleSingleScrape = async () => {
    if (!singleCardName.trim()) {
      setScrapingStatus('❌ Please enter a card name')
      return
    }

    setScrapingStatus('🔍 Scraping card data...')
    setLastResult(null)

    try {
      const result = await onSearch(singleCardName.trim())
      setLastResult({ type: 'single', success: true })
      
      if (result) {
        setScrapingStatus(`✅ Successfully scraped "${singleCardName}"`)
        setSingleCardName('') // Clear input on success
      }
    } catch (error) {
      console.error('Scraping error:', error)
      setScrapingStatus(`❌ Error: ${error.message || 'Unknown error occurred'}`)
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

    setScrapingStatus(`🔄 Starting batch scrape for ${cardNames.length} cards...`)
    setLastResult(null)

    try {
      const result = await onBatchScrape(cardNames)
      setLastResult(result)
      
      if (result.successful > 0) {
        setScrapingStatus(`✅ Batch completed: ${result.successful}/${result.total} cards processed successfully`)
        setBatchCardNames('') // Clear input on success
      } else {
        setScrapingStatus(`❌ Batch failed: ${result.failed}/${result.total} cards failed`)
      }
    } catch (error) {
      console.error('Batch scraping error:', error)
      setScrapingStatus(`❌ Error: ${error.message || 'Unknown error occurred'}`)
    }
  }

  const handleGetStats = async () => {
    setScrapingStatus('📊 Getting card statistics...')

    try {
      const stats = await onGetStats()
      setLastResult({ type: 'stats', data: stats })
      setScrapingStatus(`📊 Statistics loaded: ${stats.totalCards} total cards`)
    } catch (error) {
      console.error('Stats error:', error)
      setScrapingStatus(`❌ Error loading statistics: ${error.message}`)
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
      paddingLeft: '1rem',
      paddingRight: '1rem',
      paddingBottom: '6rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderRadius: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 10px 20px -5px rgba(0, 0, 0, 0.1)',
          border: '2px solid rgba(226, 232, 240, 0.8)',
          padding: '3rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <button
              onClick={() => setShowScraper(v => !v)}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 700,
                color: '#fff',
                backgroundColor: '#10b981',
                border: 'none',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
                transition: 'all 0.2s',
                outline: 'none'
              }}
            >
              {showScraper ? '✖ Close Scraper' : '🎯 Card Scraper'}
            </button>

          </div>

          {/* Library Search */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              position: 'relative',
              flex: 1,
              maxWidth: '400px'
            }}>
              <input
                type="text"
                value={librarySearch}
                onChange={(e) => setLibrarySearch(e.target.value)}
                placeholder="🔍 Search cards in library..."
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  fontSize: '0.875rem',
                  border: '1px solid rgba(203, 213, 225, 0.6)',
                  borderRadius: '0.5rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)'
                }}
              />
              <span style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1rem',
                color: '#6b7280'
              }}>
                🔍
              </span>
            </div>
            {librarySearch && (
              <button
                onClick={() => setLibrarySearch('')}
                style={{
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  backgroundColor: 'rgba(243, 244, 246, 0.8)',
                  border: '1px solid rgba(203, 213, 225, 0.6)',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Clear
              </button>
            )}
          </div>
          
          {showScraper && (
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
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(16, 185, 129, 0.2)'
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
                    Advanced Card Scraper
                  </h2>
                  <p style={{
                    color: '#64748b',
                    margin: 0,
                    fontSize: '0.875rem'
                  }}>
                    Add new cards to your collection with advanced scraping
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
                    backgroundColor: scrapingMode === 'single' ? '#10b981' : 'transparent',
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
                    backgroundColor: scrapingMode === 'batch' ? '#10b981' : 'transparent',
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
                      disabled={loading || !singleCardName.trim()}
                      style={{
                        padding: '0.75rem 1.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#ffffff',
                        backgroundColor: loading || !singleCardName.trim() ? '#9ca3af' : '#10b981',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: loading || !singleCardName.trim() ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {loading ? '⏳ Scraping...' : '🎯 Scrape Card'}
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
                      disabled={loading || !batchCardNames.trim()}
                      style={{
                        flex: 1,
                        padding: '0.75rem 1rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#ffffff',
                        backgroundColor: loading || !batchCardNames.trim() ? '#9ca3af' : '#10b981',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: loading || !batchCardNames.trim() ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {loading ? '⏳ Scraping...' : '🔄 Scrape Batch'}
                    </button>
                    <button
                      onClick={loadSampleCards}
                      disabled={loading}
                      style={{
                        padding: '0.75rem 1rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        borderRadius: '0.5rem',
                        cursor: loading ? 'not-allowed' : 'pointer',
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
                  onClick={handleGetStats}
                  disabled={loading}
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    backgroundColor: loading ? '#9ca3af' : '#8b5cf6',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  📊 Get Statistics
                </button>
              </div>

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
          )}
          
          {showSearch && (
            <div style={{
              marginBottom: '2rem',
              background: 'rgba(255,255,255,0.97)',
              borderRadius: '1.25rem',
              boxShadow: '0 8px 24px -8px rgba(99,102,241,0.10)',
              padding: '2rem',
              transition: 'max-height 0.3s',
              overflow: 'hidden'
            }}>
              <SearchBar onSearch={onSearch} loading={loading} searchStatus={searchStatus} />
            </div>
          )}

          {/* Filter and Sort Controls */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(16px)',
            borderRadius: '0.75rem',
            boxShadow: '0 8px 20px -4px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(226, 232, 240, 0.6)',
            padding: '1rem',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '1.5rem'
          }}>
            {/* Decorative gradient overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent)'
            }}></div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.25rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '1.75rem',
                  height: '1.75rem',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '0.375rem',
                  border: '1px solid rgba(59, 130, 246, 0.2)'
                }}>
                  <span style={{ fontSize: '0.875rem' }}>🔍</span>
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#1e293b',
                    margin: 0
                  }}>
                    Filter & Sort
                  </h3>
                  <p style={{
                    color: '#64748b',
                    margin: 0,
                    fontSize: '0.75rem'
                  }}>
                    Organize your card collection
                  </p>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                {/* Category Filter */}
                <div style={{ minWidth: '180px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.375rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    📂 Category
                  </label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      fontSize: '0.75rem',
                      border: '1px solid rgba(203, 213, 225, 0.6)',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(12px)',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6'
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(203, 213, 225, 0.6)'
                      e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  >
                    <option value="all">🎴 All Categories</option>
                    <option value="pokemon">⚡ Pokemon</option>
                    <option value="sports">🏀 Sports</option>
                    <option value="gaming">🎮 Gaming</option>
                    <option value="other">📦 Other</option>
                  </select>
                </div>
                
                {/* Sort Options */}
                <div style={{ minWidth: '180px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.375rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    📊 Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      fontSize: '0.75rem',
                      border: '1px solid rgba(203, 213, 225, 0.6)',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(12px)',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6'
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(203, 213, 225, 0.6)'
                      e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  >
                    <option value="name">📝 Name (A-Z)</option>
                    <option value="price-high">💰 Price (High to Low)</option>
                    <option value="price-low">💸 Price (Low to High)</option>
                    <option value="date-new">🆕 Date Added (Newest)</option>
                    <option value="date-old">📅 Date Added (Oldest)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginBottom: '2rem'
          }}>
            <button
              onClick={onRefresh}
              disabled={loading}
              style={{
                padding: '0.375rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: '#10b981',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem'
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '0.75rem',
                    height: '0.75rem',
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <span>Loading...</span>
                </>
              ) : (
                '🔄 Refresh Cards'
              )}
            </button>
            
            <button
              onClick={onRefreshPrices}
              disabled={loading}
              style={{
                padding: '0.375rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: '#f59e0b',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem'
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '0.75rem',
                    height: '0.75rem',
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <span>Loading...</span>
                </>
              ) : (
                '💰 Refresh Prices'
              )}
            </button>
          </div>
          
          {/* Card Grid */}
          <CardGrid 
            cards={cards}
            loading={loading}
            onRefresh={onRefresh}
          />
        </div>
      </div>
    </div>
  )
}

export default CardLibrary

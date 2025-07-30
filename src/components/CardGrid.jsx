import { isSupabaseConfigured } from '../lib/supabase'

const CardGrid = ({ cards = [], loading = false, onRefresh }) => {
  console.log('CardGrid received cards:', cards)
  console.log('Cards with prices:', cards.filter(card => card.latest_price > 0))
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price)
  }

  const getPriceColor = (price) => {
    if (price >= 100) return '#9333ea'
    if (price >= 50) return '#ea580c'
    return '#059669'
  }

  const getPriceBadgeColor = (price) => {
    if (price >= 100) return { bg: '#eff6ff', color: '#1e40af', border: '#93c5fd' }
    if (price >= 50) return { bg: '#fffbeb', color: '#92400e', border: '#fcd34d' }
    return { bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0' }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '4rem',
          height: '4rem',
          backgroundColor: '#2563eb',
          borderRadius: '50%',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '1.5rem',
            height: '1.5rem',
            border: '2px solid #ffffff',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
        <p style={{ fontSize: '1.125rem', color: '#475569' }}>Loading your card collection...</p>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '4rem',
          height: '4rem',
          backgroundColor: '#94a3b8',
          borderRadius: '50%',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          marginBottom: '1.5rem'
        }}>
          <span style={{ fontSize: '1.5rem' }}>📭</span>
        </div>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          {!isSupabaseConfigured ? 'Configuration Required' : 'No cards found'}
        </h3>
        <p style={{ color: '#475569' }}>
          {!isSupabaseConfigured ? (
            <>
              Supabase environment variables need to be configured.<br />
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Check the README for setup instructions.
              </span>
            </>
          ) : (
            'Start by searching for a card above to build your collection'
          )}
        </p>
      </div>
    )
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <p style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          color: '#374151'
        }}>
          Found {cards.length} card{cards.length !== 1 ? 's' : ''}
        </p>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0.375rem 0.75rem',
          fontSize: '0.75rem',
          fontWeight: 500,
          borderRadius: '0.5rem',
          border: '1px solid',
          backgroundColor: '#ecfdf5',
          color: '#065f46',
          borderColor: '#a7f3d0'
        }}>
          💰 Live Prices
        </div>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '2rem'
      }}>
        {cards.map((card, index) => (
          <div 
            key={index} 
            style={{
              background: '#ffffff',
              borderRadius: '2rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.08)',
              border: '2px solid rgba(226, 232, 240, 0.8)',
              overflow: 'hidden',
              transition: 'all 0.3s ease-in-out',
              transform: 'translateY(0)',
              cursor: 'pointer',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-8px)'
              e.target.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 15px 20px -5px rgba(0, 0, 0, 0.15)'
              e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.08)'
              e.target.style.borderColor = 'rgba(226, 232, 240, 0.8)'
            }}
          >
            {/* Card Header */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(59, 130, 246, 0.05))',
              padding: '0.75rem',
              borderBottom: '1px solid rgba(226, 232, 240, 0.4)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, #7c3aed, #3b82f6)'
              }}></div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.5rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '1.75rem',
                  height: '1.75rem',
                  backgroundColor: 'rgba(124, 58, 237, 0.1)',
                  borderRadius: '0.375rem',
                  border: '1px solid rgba(124, 58, 237, 0.2)'
                }}>
                  <span style={{ fontSize: '0.875rem' }}>🎴</span>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontWeight: 800,
                    color: '#0f172a',
                    fontSize: '1.25rem',
                    margin: 0,
                    marginBottom: '0.375rem',
                    lineHeight: '1.3',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                  }}>
                    {card.name || 'Unknown Card'}
                  </h3>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.875rem',
                    margin: 0,
                    fontWeight: 500
                  }}>
                    #{card.id?.substring(0, 8)}... • Price: {card.latest_price ? `$${card.latest_price}` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Card Content */}
            <div style={{ padding: '0.75rem' }}>
              {card.latest_price !== null && card.latest_price !== undefined && card.latest_price > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {/* Ultra-compact single row for all info */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem',
                    background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(59, 130, 246, 0.05))',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(124, 58, 237, 0.1)'
                  }}>
                                          <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        flexWrap: 'wrap'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                          const tooltip = e.currentTarget.querySelector('.price-tooltip')
                          if (tooltip) tooltip.style.opacity = '1'
                        }}
                        onMouseLeave={(e) => {
                          const tooltip = e.currentTarget.querySelector('.price-tooltip')
                          if (tooltip) tooltip.style.opacity = '0'
                        }}
                        >
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>💰</span>
                          <span style={{
                            fontSize: '1.5rem',
                            fontWeight: 800,
                            color: getPriceColor(card.latest_price),
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                          }}>
                            {formatPrice(card.latest_price)}
                          </span>
                          {card.last_price_update && (
                            <div className="price-tooltip" style={{
                              position: 'absolute',
                              bottom: '100%',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              background: '#1e293b',
                              color: 'white',
                              padding: '0.5rem 0.75rem',
                              borderRadius: '0.5rem',
                              fontSize: '0.75rem',
                              whiteSpace: 'nowrap',
                              opacity: 0,
                              transition: 'opacity 0.2s ease-in-out',
                              pointerEvents: 'none',
                              zIndex: 10,
                              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                              marginBottom: '0.5rem'
                            }}>
                              Last updated: {new Date(card.last_price_update).toLocaleString()}
                              <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 0,
                                height: 0,
                                borderLeft: '4px solid transparent',
                                borderRight: '4px solid transparent',
                                borderTop: '4px solid #1e293b'
                              }}></div>
                            </div>
                          )}
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem'
                        }}>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>📊</span>
                                                      <span style={{
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: '#374151'
                            }}>
                              {card.price_count} entries
                            </span>
                        </div>
                        {card.last_price_update && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem'
                          }}>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>📅</span>
                            <span style={{
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: '#374151'
                            }}>
                              {new Date(card.last_price_update).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: '#fed7aa',
                    borderRadius: '50%',
                    marginBottom: '1rem'
                  }}>
                    <span style={{ fontSize: '1.25rem' }}>💰</span>
                  </div>
                  <p style={{
                    fontWeight: 500,
                    color: '#c2410c',
                    marginBottom: '0.5rem'
                  }}>
                    No Price Data
                  </p>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    marginBottom: '1rem'
                  }}>
                    Price: {card.latest_price === null ? 'null' : card.latest_price === undefined ? 'undefined' : card.latest_price}
                  </p>
                  <button style={{
                    padding: '0.75rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    backgroundColor: '#ea580c',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}>
                    🚀 Scrape Prices
                  </button>
                </div>
              )}
              
              {/* Card Footer */}
              <div style={{
                paddingTop: '1rem',
                borderTop: '1px solid #e2e8f0',
                marginTop: '1rem'
              }}>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#9ca3af',
                  textAlign: 'center',
                  margin: 0,
                  fontWeight: 500
                }}>
                  Added: {new Date(card.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CardGrid 
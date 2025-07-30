import { isSupabaseConfigured } from '../lib/supabase'

const CardGrid = ({ cards = [], loading = false, onRefresh }) => {
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {cards.map((card, index) => (
          <div 
            key={index} 
            style={{
              background: '#ffffff',
              borderRadius: '0.75rem',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              transition: 'all 0.2s'
            }}
          >
            {/* Card Header */}
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '1rem 1.5rem',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <h3 style={{
                fontWeight: 600,
                color: '#0f172a',
                fontSize: '1.125rem',
                margin: 0,
                marginBottom: '0.25rem'
              }}>
                {card.name || 'Unknown Card'}
              </h3>
              <p style={{
                color: '#64748b',
                fontSize: '0.875rem',
                margin: 0
              }}>
                #{card.id?.substring(0, 8)}... • Price: {card.latest_price ? `$${card.latest_price}` : 'N/A'}
              </p>
            </div>
            
            {/* Card Content */}
            <div style={{ padding: '1.5rem' }}>
              {card.latest_price !== null && card.latest_price !== undefined && card.latest_price > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem'
                  }}>
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#64748b'
                    }}>
                      Latest Price
                    </span>
                    <span style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: getPriceColor(card.latest_price)
                    }}>
                      {formatPrice(card.latest_price)}
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem'
                  }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0.375rem 0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      borderRadius: '0.5rem',
                      border: '1px solid',
                      ...getPriceBadgeColor(card.latest_price)
                    }}>
                      📊 {card.price_count} entries
                    </span>
                    {card.last_price_update && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.375rem 0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        borderRadius: '0.5rem',
                        border: '1px solid',
                        backgroundColor: '#eff6ff',
                        color: '#1e40af',
                        borderColor: '#93c5fd'
                      }}>
                        📅 {new Date(card.last_price_update).toLocaleDateString()}
                      </span>
                    )}
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
                  fontSize: '0.75rem',
                  color: '#9ca3af',
                  textAlign: 'center',
                  margin: 0
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
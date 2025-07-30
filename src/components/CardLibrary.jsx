import CardGrid from './CardGrid'

const CardLibrary = ({ 
  cards = [], 
  loading = false, 
  onRefresh,
  onRefreshPrices,
  filterCategory = 'all',
  setFilterCategory,
  sortBy = 'name',
  setSortBy
}) => {
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
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(24px)',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(226, 232, 240, 0.5)',
          padding: '2rem'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '3rem',
                height: '3rem',
                backgroundColor: '#10b981',
                borderRadius: '0.75rem',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
              }}>
                <span style={{ fontSize: '1.25rem' }}>📚</span>
              </div>
              <div>
                <h2 style={{
                  fontSize: '1.875rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  margin: 0
                }}>
                  Card Library
                </h2>
                <p style={{
                  color: '#64748b',
                  margin: 0
                }}>
                  Your collection of tracked cards
                </p>
              </div>
            </div>
            
            {/* Filter and Sort Controls - Enhanced Glassmorphism Design */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(24px)',
              borderRadius: '1.5rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(226, 232, 240, 0.6)',
              padding: '2rem',
              position: 'relative',
              overflow: 'hidden'
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
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2.5rem',
                    height: '2.5rem',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(59, 130, 246, 0.2)'
                  }}>
                    <span style={{ fontSize: '1.125rem' }}>🔍</span>
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: '#1e293b',
                      margin: 0
                    }}>
                      Filter & Sort
                    </h3>
                    <p style={{
                      color: '#64748b',
                      margin: 0,
                      fontSize: '0.875rem'
                    }}>
                      Organize your card collection
                    </p>
                  </div>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1.5rem'
                }}>
                  {/* Category Filter */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      📂 Category Filter
                    </label>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        fontSize: '1rem',
                        border: '1px solid rgba(203, 213, 225, 0.6)',
                        borderRadius: '1rem',
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
                      <option value="pokemon">⚡ Pokémon Cards</option>
                      <option value="sports">🏀 Sports Cards</option>
                      <option value="gaming">🎮 Gaming Cards</option>
                    </select>
                  </div>
                  
                  {/* Sort Options */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '0.75rem',
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
                        padding: '1rem',
                        fontSize: '1rem',
                        border: '1px solid rgba(203, 213, 225, 0.6)',
                        borderRadius: '1rem',
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
            
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={onRefresh}
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  backgroundColor: '#10b981',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '1rem',
                      height: '1rem',
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
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  backgroundColor: '#f59e0b',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '1rem',
                      height: '1rem',
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
          </div>
          
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

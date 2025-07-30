import CardGrid from './CardGrid'

const CardLibrary = ({ 
  cards = [], 
  loading = false, 
  onRefresh,
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
            
            {/* Filter and Sort Controls - Matching Search Card Style */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(24px)',
              borderRadius: '1rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(226, 232, 240, 0.5)',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: '#334155',
                    marginBottom: '0.75rem'
                  }}>
                    Filter & Sort Options
                  </label>
                </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  {/* Category Filter */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: '#475569',
                      marginBottom: '0.5rem'
                    }}>
                      Category Filter
                    </label>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        fontSize: '1rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '0.75rem',
                        outline: 'none',
                        transition: 'all 0.2s',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <option value="all">All Categories</option>
                      <option value="pokemon">Pokémon Cards</option>
                      <option value="sports">Sports Cards</option>
                      <option value="gaming">Gaming Cards</option>
                    </select>
                  </div>
                  
                  {/* Sort Options */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: '#475569',
                      marginBottom: '0.5rem'
                    }}>
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        fontSize: '1rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '0.75rem',
                        outline: 'none',
                        transition: 'all 0.2s',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <option value="name">Name (A-Z)</option>
                      <option value="price-high">Price (High to Low)</option>
                      <option value="price-low">Price (Low to High)</option>
                      <option value="date-new">Date Added (Newest)</option>
                      <option value="date-old">Date Added (Oldest)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
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
                gap: '0.5rem',
                alignSelf: 'flex-start'
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
                '🔄 Refresh'
              )}
            </button>
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

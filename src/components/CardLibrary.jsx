import CardGrid from './CardGrid'

const CardLibrary = ({ cards = [], loading = false, onRefresh }) => {
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
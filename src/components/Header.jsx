import { isSupabaseConfigured } from '../lib/supabase'

const Header = ({ version = '1.2.6' }) => {
  console.log('🎴 Header rendered with version:', version)
  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '2px solid rgba(226, 232, 240, 0.6)',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1.5rem',
        paddingTop: '1.25rem',
        paddingBottom: '1.25rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
                          <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '3rem',
                height: '3rem',
                backgroundColor: '#ffffff',
                borderRadius: '1.25rem',
                border: '2px solid rgba(226, 232, 240, 0.8)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.3s ease-in-out'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)'
                e.target.style.boxShadow = '0 8px 12px -1px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)'
                e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
              >
              <span style={{ fontSize: '1.125rem' }}>🎴</span>
            </div>
            <div>
                              <h1 style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  margin: 0,
                  letterSpacing: '-0.025em',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}>
                  Trading Card Tracker
                </h1>
              <p style={{
                color: '#64748b',
                margin: 0,
                fontSize: '0.875rem',
                fontWeight: 500
              }}>
                v{version} • Live Market Prices
              </p>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.375rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: '0.75rem',
              backgroundColor: isSupabaseConfigured ? '#f0fdf4' : '#fffbeb',
              color: isSupabaseConfigured ? '#166534' : '#92400e',
              border: '1px solid',
              borderColor: isSupabaseConfigured ? '#bbf7d0' : '#fde68a',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s ease-in-out'
            }}>
              {isSupabaseConfigured ? '🟢 Connected' : '🟡 Config'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header 
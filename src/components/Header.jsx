import { isSupabaseConfigured } from '../lib/supabase'

const Header = ({ version = '1.2.3' }) => {
  console.log('🎴 Header rendered with version:', version)
  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(226, 232, 240, 0.4)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
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
              width: '2.75rem',
              height: '2.75rem',
              backgroundColor: '#f8fafc',
              borderRadius: '1rem',
              border: '1px solid rgba(226, 232, 240, 0.6)',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease-in-out'
            }}>
              <span style={{ fontSize: '1.125rem' }}>🎴</span>
            </div>
            <div>
              <h1 style={{
                fontSize: '1.625rem',
                fontWeight: 700,
                color: '#1e293b',
                margin: 0,
                letterSpacing: '-0.025em'
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
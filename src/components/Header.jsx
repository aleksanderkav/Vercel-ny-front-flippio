import { isSupabaseConfigured } from '../lib/supabase'

const Header = ({ version = '1.2.0' }) => {
  console.log('🎴 Header rendered with version:', version)
  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        paddingTop: '1.5rem',
        paddingBottom: '1.5rem'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
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
              backgroundColor: '#2563eb',
              borderRadius: '0.75rem',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}>
              <span style={{ fontSize: '1.25rem' }}>🎴</span>
            </div>
            <div>
                              <h1 style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  margin: 0,
                  textShadow: '0 2px 4px rgba(124, 58, 237, 0.2)',
                  letterSpacing: '0.025em'
                }}>
                  🚀 Trading Card Tracker v1.2.0 🚀
                </h1>
              <p style={{
                color: '#64748b',
                margin: 0
              }}>
                v{version} • Live Market Prices
              </p>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.375rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 500,
              borderRadius: '0.5rem',
              border: '1px solid',
              backgroundColor: isSupabaseConfigured ? '#ecfdf5' : '#fffbeb',
              color: isSupabaseConfigured ? '#065f46' : '#92400e',
              borderColor: isSupabaseConfigured ? '#a7f3d0' : '#fcd34d'
            }}>
              {isSupabaseConfigured ? '🟢 Connected' : '🟡 Config'}
            </div>
            <div style={{
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
              🚀 v{version}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header 
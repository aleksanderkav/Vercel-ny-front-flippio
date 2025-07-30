import { isSupabaseConfigured } from '../lib/supabase'
import { colors, typography, spacing, borderRadius, shadows } from '../styles/designSystem'

const Header = ({ version = '1.3.2' }) => {
  console.log('🎴 Header rendered with version:', version)
  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${colors.border}`,
      boxShadow: shadows.sm,
      fontFamily: typography.fontFamily.primary
    }}>
              <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: `${spacing.md} ${spacing.lg}`,
          paddingTop: spacing.lg,
          paddingBottom: spacing.lg
        }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.md
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '3rem',
              height: '3rem',
              backgroundColor: colors.surface,
              borderRadius: borderRadius.xl,
              border: `1px solid ${colors.border}`,
              boxShadow: shadows.sm,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)'
              e.target.style.boxShadow = shadows.lg
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)'
              e.target.style.boxShadow = shadows.sm
            }}
            >
              <span style={{ fontSize: typography.fontSize.lg }}>🎴</span>
            </div>
            <div>
              <h1 style={{
                fontSize: typography.fontSize['3xl'],
                fontWeight: typography.fontWeight.bold,
                color: colors.textPrimary,
                margin: 0,
                letterSpacing: '-0.025em'
              }}>
                Trading Card Tracker
              </h1>
              <p style={{
                color: colors.textSecondary,
                margin: 0,
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium
              }}>
                v{version} • Live Market Prices
              </p>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: `${spacing.xs} ${spacing.md}`,
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.semibold,
              borderRadius: borderRadius.full,
              backgroundColor: isSupabaseConfigured ? colors.success : colors.warning,
              color: colors.white,
              border: 'none',
              boxShadow: shadows.sm,
              transition: 'all 0.2s ease'
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
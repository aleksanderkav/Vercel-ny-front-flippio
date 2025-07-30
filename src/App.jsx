import React from 'react'

function App() {
  console.log('🚀 Minimal React App rendering...')

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* Debug indicator */}
      <div style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999
      }}>
        React Working v1.0.0
      </div>

      {/* Main content */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '80px',
          height: '80px',
          backgroundColor: '#2563eb',
          borderRadius: '20px',
          margin: '0 auto 20px',
          boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.3)'
        }}>
          <span style={{ fontSize: '2rem' }}>🎴</span>
        </div>

        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '1rem'
        }}>
          Trading Card Tracker
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: '#475569',
          marginBottom: '2rem'
        }}>
          v1.0.0 • React is Working!
        </p>

        <div style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: '10px',
          padding: '15px',
          marginBottom: '2rem'
        }}>
          <p style={{
            color: '#065f46',
            margin: 0,
            fontWeight: 500
          }}>
            ✅ React Component Rendered Successfully!
          </p>
          <p style={{
            color: '#047857',
            margin: '5px 0 0 0',
            fontSize: '0.9rem'
          }}>
            JavaScript execution is working
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginTop: '2rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '10px',
            padding: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>Search Cards</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
              Find and track card prices
            </p>
          </div>

          <div style={{
            background: '#ffffff',
            borderRadius: '10px',
            padding: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>Live Prices</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
              Real-time market data
            </p>
          </div>
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '15px',
          background: '#f8fafc',
          borderRadius: '10px',
          border: '1px solid #e2e8f0'
        }}>
          <p style={{
            margin: 0,
            color: '#64748b',
            fontSize: '0.9rem'
          }}>
            🚀 Ready for full functionality
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
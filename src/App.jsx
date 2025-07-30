import React from 'react'

function App() {
  console.log('🚀 App component rendering...')

  return React.createElement('div', {
    style: {
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, [
    React.createElement('h1', { key: 'title' }, '🎴 Trading Card Tracker'),
    React.createElement('p', { key: 'subtitle' }, 'v1.0.0 • React is working!'),
    React.createElement('div', { 
      key: 'status',
      style: {
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        marginTop: '20px'
      }
    }, '✅ React App Loaded Successfully!')
  ])
}

export default App
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

console.log('🚀 Main.jsx starting...')
console.log('React version:', React.version)
console.log('ReactDOM version:', ReactDOM.version)

try {
  const rootElement = document.getElementById('root')
  console.log('🎯 Root element found:', rootElement)

  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement)
    console.log('✅ React root created successfully')
    
    // Add error boundary
    const ErrorBoundary = ({ children }) => {
      try {
        return children
      } catch (error) {
        console.error('❌ React rendering error:', error)
        return React.createElement('div', {
          style: {
            padding: '20px',
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '10px',
            color: '#dc2626',
            textAlign: 'center'
          }
        }, [
          React.createElement('h2', { key: 'title' }, '❌ React Error'),
          React.createElement('p', { key: 'error' }, error.message)
        ])
      }
    }
    
    root.render(
      React.createElement(React.StrictMode, null,
        React.createElement(ErrorBoundary, null,
          React.createElement(App)
        )
      )
    )
    
    console.log('✅ App rendered successfully')
    
    // Update the fallback content to show success
    setTimeout(() => {
      const loadingDiv = document.querySelector('.loading')
      if (loadingDiv) {
        loadingDiv.innerHTML = '<p>✅ React loaded successfully!</p>'
      }
    }, 1000)
    
  } else {
    console.error('❌ Root element not found!')
    document.body.innerHTML = '<div style="padding: 20px; color: red;">❌ Root element not found!</div>'
  }
} catch (error) {
  console.error('❌ Error in main.jsx:', error)
  document.body.innerHTML = `<div style="padding: 20px; color: red;">❌ React Error: ${error.message}</div>`
} 
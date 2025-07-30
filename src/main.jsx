import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

console.log('🚀 Main.jsx starting...')
console.log('React version:', React.version)
console.log('ReactDOM version:', ReactDOM.version)
console.log('App component:', App)

// Add a simple test to see if anything renders
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM Content Loaded')
  
  // Create a simple test element
  const testDiv = document.createElement('div')
  testDiv.innerHTML = `
    <div style="padding: 20px; background: #fef3c7; border: 1px solid #fcd34d; border-radius: 10px; margin: 20px;">
      <h1 style="color: #92400e;">🧪 JavaScript Test</h1>
      <p>If you see this, JavaScript is working!</p>
      <p>Time: ${new Date().toISOString()}</p>
    </div>
  `
  document.body.appendChild(testDiv)
})

try {
  console.log('🔍 Looking for root element...')
  const rootElement = document.getElementById('root')
  console.log('🎯 Root element found:', rootElement)
  console.log('📄 Document body:', document.body)
  console.log('📄 Document head:', document.head)

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
    
    // Test React rendering with a simple component first
    console.log('🧪 Testing React rendering...')
    root.render(
      React.createElement('div', {
        style: {
          padding: '20px',
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: '10px',
          margin: '20px'
        }
      }, [
        React.createElement('h1', { key: 'title' }, '🧪 React Test'),
        React.createElement('p', { key: 'status' }, 'React is working! Loading main app...'),
        React.createElement('p', { key: 'time' }, `Time: ${new Date().toISOString()}`)
      ])
    )
    
    console.log('✅ React test component rendered')
    
    // After a short delay, render the actual app
    setTimeout(() => {
      console.log('🚀 Rendering main App component...')
      try {
        root.render(
          React.createElement(React.StrictMode, null,
            React.createElement(ErrorBoundary, null,
              React.createElement(App)
            )
          )
        )
        console.log('✅ App rendered successfully')
      } catch (appError) {
        console.error('❌ Error rendering App:', appError)
        root.render(
          React.createElement('div', {
            style: {
              padding: '20px',
              background: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              margin: '20px'
            }
          }, [
            React.createElement('h1', { key: 'title' }, '❌ App Error'),
            React.createElement('p', { key: 'error' }, appError.message)
          ])
        )
      }
    }, 2000)
    
    // Update the fallback content to show success
    setTimeout(() => {
      const loadingDiv = document.querySelector('.loading')
      if (loadingDiv) {
        loadingDiv.innerHTML = '<p>✅ React loaded successfully!</p>'
      }
    }, 1000)
    
  } else {
    console.error('❌ Root element not found!')
    document.body.innerHTML = `
      <div style="padding: 20px; background: #fee2e2; border: 1px solid #fecaca; border-radius: 10px; margin: 20px;">
        <h1 style="color: #dc2626;">❌ Root element not found!</h1>
        <p>This means the React app cannot load properly.</p>
        <p>Document ready state: ${document.readyState}</p>
        <p>Body children: ${document.body.children.length}</p>
        <button onclick="window.location.reload()" style="padding: 10px 20px; background: #dc2626; color: white; border: none; border-radius: 5px; cursor: pointer;">
          🔄 Reload Page
        </button>
      </div>
    `
  }
} catch (error) {
  console.error('❌ Error in main.jsx:', error)
  document.body.innerHTML = `<div style="padding: 20px; color: red;">❌ React Error: ${error.message}</div>`
} 
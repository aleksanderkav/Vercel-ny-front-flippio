import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('🚀 Main.jsx starting...')

// Add a simple fallback div to show something is working
const rootElement = document.getElementById('root')
if (rootElement) {
  rootElement.innerHTML = `
    <div style="
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #333;
      text-align: center;
      padding: 20px;
    ">
      <div>
        <h1 style="font-size: 2rem; margin-bottom: 1rem;">Loading React App...</h1>
        <p style="font-size: 1.2rem; margin-bottom: 1rem;">v1.0.0</p>
        <p style="color: #666;">Initializing components...</p>
      </div>
    </div>
  `
}

try {
  console.log('🎯 Root element found:', rootElement)
  
  if (!rootElement) {
    throw new Error('Root element not found!')
  }

  console.log('📦 Importing React components...')
  
  const root = ReactDOM.createRoot(rootElement)
  console.log('✅ React root created successfully')
  
  console.log('🎨 Attempting to render App component...')
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
  
  console.log('✅ App rendered successfully')
} catch (error) {
  console.error('❌ Error in main.jsx:', error)
  
  // Update the fallback with error information
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #333;
        text-align: center;
        padding: 20px;
      ">
        <div>
          <h1 style="font-size: 2rem; margin-bottom: 1rem;">Trading Card Tracker</h1>
          <p style="font-size: 1.2rem; margin-bottom: 1rem;">v1.0.0</p>
          <p style="color: #666; margin-bottom: 2rem;">React Error Detected</p>
          <div style="
            background: #fee2e2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            text-align: left;
            font-family: monospace;
            font-size: 0.9rem;
            color: #dc2626;
          ">
            <strong>Error:</strong> ${error.message}<br>
            <strong>Stack:</strong> ${error.stack?.split('\n').slice(0, 3).join('<br>') || 'No stack trace'}
          </div>
          <p style="color: #999; font-size: 0.9rem; margin-top: 2rem;">
            Check browser console for more details
          </p>
        </div>
      </div>
    `
  }
} 
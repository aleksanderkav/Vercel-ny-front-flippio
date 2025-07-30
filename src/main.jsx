import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('🚀 Main.jsx starting...')

try {
  const rootElement = document.getElementById('root')
  console.log('🎯 Root element found:', rootElement)
  
  if (!rootElement) {
    throw new Error('Root element not found!')
  }

  const root = ReactDOM.createRoot(rootElement)
  console.log('✅ React root created successfully')
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
  
  console.log('✅ App rendered successfully')
} catch (error) {
  console.error('❌ Error in main.jsx:', error)
  
  // Fallback: try to render something
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
          <h1 style="font-size: 2rem; margin-bottom: 1rem;">Trading Card Tracker</h1>
          <p style="font-size: 1.2rem; margin-bottom: 1rem;">v1.0.0</p>
          <p style="color: #666;">Loading application...</p>
          <p style="color: #999; font-size: 0.9rem; margin-top: 2rem;">Error: ${error.message}</p>
        </div>
      </div>
    `
  }
} 
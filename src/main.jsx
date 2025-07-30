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
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
    
    console.log('✅ App rendered successfully')
  } else {
    console.error('❌ Root element not found!')
    document.body.innerHTML = '<div style="padding: 20px; color: red;">❌ Root element not found!</div>'
  }
} catch (error) {
  console.error('❌ Error in main.jsx:', error)
  document.body.innerHTML = `<div style="padding: 20px; color: red;">❌ React Error: ${error.message}</div>`
} 
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('🚀 Main.jsx starting...')

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
} 
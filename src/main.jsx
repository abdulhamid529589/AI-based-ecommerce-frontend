import { createRoot } from 'react-dom/client'
import React from 'react'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './store/store.js'

// Performance monitoring in development
if (process.env.NODE_ENV === 'development') {
  // Log performance metrics
  window.addEventListener('load', () => {
    const perfData = window.performance.timing
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
    console.log('Page Load Time:', pageLoadTime, 'ms')
  })
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                borderRadius: '12px',
                background: '#1D1420',
                color: '#FFF8F0',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#3A7D44', secondary: '#FFF8F0' } },
              error: { iconTheme: { primary: '#E4572E', secondary: '#FFF8F0' } },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)

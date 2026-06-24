import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import App from './App.jsx'
import MobileApp from './MobileApp.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

// Detect if running inside Capacitor (mobile app)
const isMobile = import.meta.env.VITE_MOBILE === 'true' ||
  typeof window !== 'undefined' && window.Capacitor !== undefined;

// Use HashRouter for Capacitor (file:// protocol), BrowserRouter for web
const Router = isMobile ? HashRouter : BrowserRouter;
const AppComponent = isMobile ? MobileApp : App;

// Add mobile viewport meta tag
if (isMobile) {
  const meta = document.querySelector('meta[name="viewport"]');
  if (meta) {
    meta.setAttribute('content', 
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
    );
  }
  // Add mobile class to html element
  document.documentElement.classList.add('mobile-device');
  // Set status bar color
  const themeColor = document.createElement('meta');
  themeColor.name = 'theme-color';
  themeColor.content = '#4f46e5';
  document.head.appendChild(themeColor);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <AppComponent/>
      </Router>
    </AuthProvider>
  </React.StrictMode>,
)

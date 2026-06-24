import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import MobileTopBar from './components/MobileTopBar'
import BottomTabBar from './components/BottomTabBar'
import HomePage from './pages/HomePage'
import BrowseListingsPage from './pages/BrowseListingsPage'
import FindFixersPage from './pages/FindFixersPage'
import NewListingPage from './pages/NewListingPage'
import ListingDetailPage from './pages/ListingDetailPage'
import ProfilePage from './pages/ProfilePage'
import MessagesPage from './pages/MessagesPage'
import ConversationPage from './pages/ConversationPage'
import AdminDashboard from './pages/AdminDashboard'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import './mobile.css'

function MobileApp() {
  const location = useLocation();
  
  // Determine if we should show the bottom tab bar
  const hideTabBarPaths = ['/login', '/register'];
  const isConversation = location.pathname.startsWith('/conversation/');
  const showTabBar = !hideTabBarPaths.includes(location.pathname) && !isConversation;

  return (
    <ToastProvider>
      <div className="mobile-app">
        <MobileTopBar />
        <main className={`mobile-content ${showTabBar ? 'with-tab-bar' : 'without-tab-bar'}`}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/browse" element={<BrowseListingsPage />} />
            <Route path="/fixers" element={<FindFixersPage />} />
            <Route path="/new-listing" element={<NewListingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/listing/:id" element={<ListingDetailPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/conversation/:listingId" element={<ConversationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <BottomTabBar />
      </div>
    </ToastProvider>
  )
}

export default MobileApp

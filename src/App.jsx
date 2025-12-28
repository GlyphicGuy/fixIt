import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import BrowseListingsPage from './pages/BrowseListingsPage'
import FindFixersPage from './pages/FindFixersPage'
import NewListingPage from './pages/NewListingPage'
import ProfilePage from './pages/ProfilePage'
import ListingDetailPage from './pages/ListingDetailPage'
import ConversationPage from './pages/ConversationPage'
import MessagesPage from './pages/MessagesPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import './App.css'

function App() {
  return (
    <ToastProvider>
      <div className="App">
        <Navbar />
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
        </Routes>
        <Footer />
      </div>
    </ToastProvider>
  )
}

export default App

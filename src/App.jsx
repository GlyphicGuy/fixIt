import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import BrowseListingsPage from './pages/BrowseListingsPage'
import FindFixersPage from './pages/FindFixersPage'
import NewListingPage from './pages/NewListingPage'
import ProfilePage from './pages/ProfilePage'
import ListingDetailPage from './pages/ListingDetailPage'
import './App.css'

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/browse" element={<BrowseListingsPage />} />
        <Route path="/fixers" element={<FindFixersPage />} />
        <Route path="/new-listing" element={<NewListingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/listing/:id" element={<ListingDetailPage />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App

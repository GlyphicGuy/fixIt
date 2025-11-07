import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import SkillProfileCard from '../components/SkillProfileCard';
import SearchBar from '../components/SearchBar';
import StatsSection from '../components/StatsSection';
import HowItWorks from '../components/HowItWorks';
import { mockListings, mockFixers, categories } from '../data/mockData';

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredListings = mockListings
    .filter(listing => selectedCategory === 'All' || listing.category === selectedCategory)
    .filter(listing => 
      searchTerm === '' || 
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const scrollToFixers = () => {
    document.getElementById('fixers-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Fix-It Hub! 🔧</h1>
          <p className="text-xl mb-8">
            Campus repair & skill-sharing for a sustainable future
          </p>
          
          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar onSearch={handleSearch} placeholder="Search for repairs (e.g., laptop, bike, clothing)..." />
          </div>

          <div className="flex justify-center space-x-4">
            <Link 
              to="/new-listing"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Post a Repair Need
            </Link>
            <button 
              onClick={scrollToFixers}
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              Browse Fixers
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <StatsSection />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Browse Repair Listings</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {selectedCategory === 'All' ? 'All Listings' : `${selectedCategory} Listings`}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>

        {/* Featured Fixers */}
        <div id="fixers-section">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Featured Fixers 🌟</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockFixers.map((fixer) => (
              <SkillProfileCard key={fixer.id} fixer={fixer} />
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="my-16">
          <HowItWorks />
        </div>
      </div>
    </div>
  );
}

export default HomePage;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import SkillProfileCard from '../components/SkillProfileCard';
import SearchBar from '../components/SearchBar';
import StatsSection from '../components/StatsSection';
import HowItWorks from '../components/HowItWorks';
import { mockFixers, categories } from '../data/mockData';
import { getListings } from '../services/listingService';
import { getFixers } from '../services/userService';

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [listings, setListings] = useState([]);
  const [fixers, setFixers] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [loadingFixers, setLoadingFixers] = useState(true);
  const [error, setError] = useState('');

  // Fetch fixers once
  useEffect(() => {
    const fetchInitialFixers = async () => {
      try {
        const fixersData = await getFixers();
        setFixers(fixersData);
      } catch (err) {
        console.error('Error fetching fixers:', err);
        setFixers(mockFixers);
      } finally {
        setLoadingFixers(false);
      }
    };
    fetchInitialFixers();
  }, []);

  // Fetch listings when filters change
  useEffect(() => {
    const fetchFilteredListings = async () => {
      try {
        setLoadingListings(true);
        const data = await getListings({ 
          status: 'open', 
          category: selectedCategory === 'All' ? undefined : selectedCategory,
          search: searchTerm || undefined 
        });
        setListings(data);
        setError('');
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Failed to load data');
        setListings([]);
      } finally {
        setLoadingListings(false);
      }
    };
    fetchFilteredListings();
  }, [selectedCategory, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

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
            <SearchBar onSearch={handleSearch} placeholder="Search for Repairs (e.g., laptop, bike, clothing)..." />
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
          
          {loadingListings ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading listings...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-600">No listings found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          )}
        </div>

        {/* Featured Fixers */}
        <div id="fixers-section">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Featured Fixers</h2>
          {loadingFixers ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading fixers...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fixers.map((fixer) => (
                <SkillProfileCard key={fixer._id} fixer={fixer} />
              ))}
            </div>
          )}
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

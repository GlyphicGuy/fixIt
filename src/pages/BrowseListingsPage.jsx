import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import SearchBar from '../components/SearchBar';
import { mockListings, categories } from '../data/mockData';

function BrowseListingsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, open, fixed
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Apply all filters
  let filteredListings = mockListings
    .filter(listing => selectedCategory === 'All' || listing.category === selectedCategory)
    .filter(listing => 
      searchTerm === '' || 
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.postedBy.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(listing => statusFilter === 'all' || listing.status === statusFilter);

  // Sort listings
  if (sortBy === 'newest') {
    filteredListings.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
  } else if (sortBy === 'oldest') {
    filteredListings.sort((a, b) => new Date(a.postedDate) - new Date(b.postedDate));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 text-center">Browse All Listings 🔍</h1>
          <p className="text-xl text-center mb-6">
            Find items that need fixing and help make a difference!
          </p>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <SearchBar onSearch={handleSearch} placeholder="Search by title, description, or poster..." />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Filters</h2>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Status</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
                      statusFilter === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Status
                  </button>
                  <button
                    onClick={() => setStatusFilter('open')}
                    className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
                      statusFilter === 'open'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🔓 Open
                  </button>
                  <button
                    onClick={() => setStatusFilter('fixed')}
                    className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
                      statusFilter === 'fixed'
                        ? 'bg-gray-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ✅ Fixed
                  </button>
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setStatusFilter('all');
                  setSortBy('newest');
                  setSearchTerm('');
                }}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Main Content - Listings Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {filteredListings.length} {filteredListings.length === 1 ? 'Listing' : 'Listings'} Found
              </h2>
              <Link
                to="/new-listing"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition"
              >
                + Post Listing
              </Link>
            </div>

            {/* Listings Grid */}
            {filteredListings.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Listings Found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setStatusFilter('all');
                    setSearchTerm('');
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrowseListingsPage;

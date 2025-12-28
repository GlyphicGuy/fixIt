import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import SearchBar from '../components/SearchBar';
import { categories } from '../data/mockData';
import { getListings } from '../services/listingService';

function BrowseListingsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, open, fixed
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch listings on component mount
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const data = await getListings();
      setListings(data);
      setError('');
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Apply all filters
  let filteredListings = listings
    .filter(listing => selectedCategory === 'All' || listing.category === selectedCategory)
    .filter(listing => 
      searchTerm === '' || 
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (listing.postedBy?.name && listing.postedBy.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(listing => statusFilter === 'all' || listing.status === statusFilter);

  // Separate listings into open and accepted/fixed
  const openListings = filteredListings.filter(listing => listing.status === 'open' && !listing.acceptedFixer);
  const acceptedOrFixedListings = filteredListings.filter(listing => listing.acceptedFixer || listing.status === 'fixed');

  // Sort both sections
  const sortListings = (listingsArray) => {
    if (sortBy === 'newest') {
      return listingsArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      return listingsArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    return listingsArray;
  };

  const sortedOpenListings = sortListings([...openListings]);
  const sortedAcceptedListings = sortListings([...acceptedOrFixedListings]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 text-center">Browse All Listings</h1>
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
                    Fixed
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
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading listings...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                {error}
              </div>
            ) : (
              <>
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
                  <>
                    {/* Open Listings Section */}
                    {sortedOpenListings.length > 0 && (
                      <div className="mb-12">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                          Available Listings ({sortedOpenListings.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {sortedOpenListings.map((listing) => (
                            <ListingCard key={listing._id} listing={listing} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Accepted/Fixed Listings Section */}
                    {sortedAcceptedListings.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                          <span className="inline-block w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
                          In Progress / Completed ({sortedAcceptedListings.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {sortedAcceptedListings.map((listing) => (
                            <ListingCard key={listing._id} listing={listing} />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrowseListingsPage;

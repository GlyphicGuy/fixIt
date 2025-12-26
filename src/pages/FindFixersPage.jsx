import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SkillProfileCard from '../components/SkillProfileCard';
import SearchBar from '../components/SearchBar';
import { getFixers } from '../services/userService';

function FindFixersPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('rating'); // rating, fixes, name
  const [fixers, setFixers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch fixers on component mount
  useEffect(() => {
    fetchFixers();
  }, []);

  const fetchFixers = async () => {
    try {
      setLoading(true);
      const data = await getFixers();
      setFixers(data);
      setError('');
    } catch (err) {
      console.error('Error fetching fixers:', err);
      setError('Failed to load fixers');
    } finally {
      setLoading(false);
    }
  };

  // Get all unique skills from all fixers
  const allSkills = ['All', ...new Set(fixers.flatMap(fixer => fixer.skills || []))];

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Apply filters
  let filteredFixers = fixers
    .filter(fixer => 
      searchTerm === '' || 
      fixer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (fixer.skills && fixer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
    )
    .filter(fixer => 
      selectedSkill === 'All' || (fixer.skills && fixer.skills.includes(selectedSkill))
    )
    .filter(fixer => (fixer.rating || 0) >= minRating);

  // Sort fixers
  if (sortBy === 'rating') {
    filteredFixers.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === 'fixes') {
    filteredFixers.sort((a, b) => (b.fixesCompleted || 0) - (a.fixesCompleted || 0));
  } else if (sortBy === 'name') {
    filteredFixers.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 text-center">Find Skilled Fixers 👥</h1>
          <p className="text-xl text-center mb-6">
            Connect with talented students who can help repair your items!
          </p>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <SearchBar onSearch={handleSearch} placeholder="Search by name or skill (e.g., soldering, sewing)..." />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading fixers...</p>
        </div>
      ) : error ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg inline-block">
            {error}
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Filters</h2>

              {/* Skill Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Skills</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {allSkills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => setSelectedSkill(skill)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
                        selectedSkill === skill
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Minimum Rating</h3>
                <div className="space-y-2">
                  {[0, 4.0, 4.5, 4.7, 4.9].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
                        minRating === rating
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {rating === 0 ? 'All Ratings' : `⭐ ${rating}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="rating">Highest Rating</option>
                  <option value="fixes">Most Fixes</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedSkill('All');
                  setMinRating(0);
                  setSortBy('rating');
                  setSearchTerm('');
                }}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Clear All Filters
              </button>

              {/* Become a Fixer CTA */}
              <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                <h4 className="font-bold text-purple-800 mb-2">Want to Help? 🛠️</h4>
                <p className="text-sm text-purple-700 mb-3">
                  Share your skills and become a fixer!
                </p>
                <button 
                  onClick={() => navigate('/register')}
                  className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition text-sm"
                >
                  Add Your Skills
                </button>
              </div>
            </div>
          </div>

          {/* Main Content - Fixers Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {filteredFixers.length} {filteredFixers.length === 1 ? 'Fixer' : 'Fixers'} Available
              </h2>
              <p className="text-gray-600">
                {selectedSkill !== 'All' && `Specializing in: ${selectedSkill}`}
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <div className="text-3xl font-bold text-purple-600">{fixers.length}</div>
                <div className="text-sm text-gray-600">Total Fixers</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {allSkills.length - 1}
                </div>
                <div className="text-sm text-gray-600">Skills Available</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {fixers.reduce((sum, f) => sum + (f.fixesCompleted || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Total Fixes</div>
              </div>
            </div>

            {/* Fixers Grid */}
            {filteredFixers.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">👤</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Fixers Found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={() => {
                    setSelectedSkill('All');
                    setMinRating(0);
                    setSearchTerm('');
                  }}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredFixers.map((fixer) => (
                  <SkillProfileCard key={fixer._id} fixer={fixer} />
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
      )}
    </div>
  );
}

export default FindFixersPage;

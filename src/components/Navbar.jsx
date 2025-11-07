import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-90 transition">
            <span className="text-2xl">🔧</span>
            <h1 className="text-2xl font-bold">Fix-It Hub</h1>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-blue-200 transition">Home</Link>
            <Link to="/browse" className="hover:text-blue-200 transition">Browse Listings</Link>
            <Link to="/fixers" className="hover:text-blue-200 transition">Find Fixers</Link>
            <Link to="/profile" className="hover:text-blue-200 transition">My Profile</Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Link 
              to="/new-listing"
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Post Listing
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

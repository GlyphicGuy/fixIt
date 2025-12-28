import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from './ConfirmModal';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-90 transition">
            <h1 className="text-2xl font-bold">Fix-It Hub</h1>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-blue-200 transition">Home</Link>
            <Link to="/browse" className="hover:text-blue-200 transition">Browse Listings</Link>
            <Link to="/fixers" className="hover:text-blue-200 transition">Find Fixers</Link>
            {isAuthenticated && (
              <>
                <Link to="/messages" className="hover:text-blue-200 transition">Messages</Link>
                <Link to="/profile" className="hover:text-blue-200 transition">My Profile</Link>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/new-listing"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  Post Listing
                </Link>
                <Link to="/profile" className="flex items-center space-x-2 hover:opacity-90 transition">
                  <img 
                    src={user?.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full border-2 border-white bg-gray-100"
                  />
                  <span className="text-sm hidden lg:block">Hi, {user?.name?.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="hover:text-blue-200 transition font-semibold"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
      />
    </nav>
  );
}

export default Navbar;

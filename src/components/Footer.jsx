import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🔧</span>
              <h3 className="text-xl font-bold">Fix-It Hub</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Connecting students to promote sustainability and the circular economy through campus repair & skill-sharing.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/" className="hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link to="/browse" className="hover:text-white transition">Browse Listings</Link>
              </li>
              <li>
                <Link to="/fixers" className="hover:text-white transition">Find Fixers</Link>
              </li>
              <li>
                <Link to="/new-listing" className="hover:text-white transition">Post a Listing</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition">My Profile</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/browse" className="hover:text-white transition">Tech Repairs</Link>
              </li>
              <li>
                <Link to="/browse" className="hover:text-white transition">Clothing & Textiles</Link>
              </li>
              <li>
                <Link to="/browse" className="hover:text-white transition">Furniture</Link>
              </li>
              <li>
                <Link to="/browse" className="hover:text-white transition">Other Items</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="space-y-3">
              <p className="text-gray-400 text-sm">
                📧 support@fixithub.edu
              </p>
              <p className="text-gray-400 text-sm">
                📍 Campus Student Center, Room 204
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="#facebook" className="text-gray-400 hover:text-white transition text-2xl">📘</a>
                <a href="#instagram" className="text-gray-400 hover:text-white transition text-2xl">📷</a>
                <a href="#twitter" className="text-gray-400 hover:text-white transition text-2xl">🐦</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Fix-It Hub. All rights reserved. Building a sustainable campus community! 🌱</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

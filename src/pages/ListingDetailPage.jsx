import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockListings, mockFixers } from '../data/mockData';

function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find the listing by ID
  const listing = mockListings.find(l => l.id === parseInt(id));
  
  // Mock interested fixers
  const [interestedFixers] = useState(mockFixers.slice(0, 3));
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState('');

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Listing Not Found</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleContactFixer = (fixerName) => {
    alert(`Message sent to ${fixerName}! (This will be implemented with backend)`);
    setMessage('');
    setShowContactForm(false);
  };

  const categoryColors = {
    Tech: 'bg-blue-100 text-blue-800',
    Clothing: 'bg-pink-100 text-pink-800',
    Furniture: 'bg-green-100 text-green-800',
    Other: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-700 font-semibold"
        >
          ← Back to Listings
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Listing Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              {/* Image */}
              <img
                src={listing.photoUrl}
                alt={listing.title}
                className="w-full h-96 object-cover"
              />

              {/* Content */}
              <div className="p-6">
                {/* Category and Status */}
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`${categoryColors[listing.category]} px-3 py-1 rounded-full text-sm font-semibold`}>
                    {listing.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    listing.status === 'open' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {listing.status === 'open' ? '🔓 Open' : '✅ Fixed'}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{listing.title}</h1>

                {/* Posted Info */}
                <div className="flex items-center space-x-4 mb-6 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">Posted by:</span>
                    <span>{listing.postedBy}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-2">
                    <span>📅</span>
                    <span>{listing.postedDate}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{listing.description}</p>
                </div>

                {/* Action Buttons */}
                {listing.status === 'open' && (
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowContactForm(!showContactForm)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition"
                    >
                      {showContactForm ? 'Hide Form' : 'I Can Fix This!'}
                    </button>
                    <button className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition">
                      Share 📤
                    </button>
                  </div>
                )}

                {/* Contact Form */}
                {showContactForm && (
                  <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Send a Message</h3>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Let them know you can help! Describe your experience..."
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                    />
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleContactFixer(listing.postedBy)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                      >
                        Send Message
                      </button>
                      <button
                        onClick={() => setShowContactForm(false)}
                        className="px-6 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Interested Fixers */}
            {listing.status === 'open' && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Interested Fixers ({interestedFixers.length})
                </h2>
                <div className="space-y-4">
                  {interestedFixers.map((fixer) => (
                    <div
                      key={fixer.id}
                      className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:shadow-md transition"
                    >
                      <img
                        src={fixer.photoUrl}
                        alt={fixer.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{fixer.name}</h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <span>⭐ {fixer.rating}</span>
                          <span className="mx-1">•</span>
                          <span>{fixer.fixesCompleted} fixes</span>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
              <h3 className="text-lg font-bold text-purple-800 mb-3">💡 Safety Tips</h3>
              <ul className="space-y-2 text-sm text-purple-700">
                <li>• Meet in public campus locations</li>
                <li>• Check fixer ratings and reviews</li>
                <li>• Discuss repair cost beforehand</li>
                <li>• Take before/after photos</li>
                <li>• Report any issues to campus admin</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetailPage;

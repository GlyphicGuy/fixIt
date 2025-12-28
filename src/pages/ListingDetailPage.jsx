import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getListingById, expressInterest, acceptFixer, markListingFixed } from '../services/listingService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';

function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { success, error: showError, warning } = useToast();
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const data = await getListingById(id);
      setListing(data);
      setError('');
    } catch (err) {
      console.error('Error fetching listing:', err);
      setError('Failed to load listing');
    } finally {
      setLoading(false);
    }
  };

  const handleExpressInterest = async () => {
    if (!isAuthenticated) {
      warning('Please login to express interest');
      navigate('/login');
      return;
    }

    if (!message.trim()) {
      warning('Please enter a message');
      return;
    }

    try {
      setSending(true);
      await expressInterest(id, message);
      success('Interest expressed! The poster will be notified.');
      setMessage('');
      setShowContactForm(false);
      fetchListing(); // Refresh listing
    } catch (err) {
      console.error('Error expressing interest:', err);
      console.error('Error response:', err.response?.data);
      const errorMessage = err.response?.data?.message || 'Failed to send message. Please try again.';
      showError(errorMessage);
    } finally {
      setSending(false);
    }
  };

  const handleAcceptFixer = async (fixerId, fixerName) => {
    setConfirmModal({
      isOpen: true,
      title: 'Accept Fixer',
      message: `Accept ${fixerName} for this job?`,
      onConfirm: async () => {
        try {
          await acceptFixer(id, fixerId);
          success(`${fixerName} has been accepted! They will be notified.`);
          fetchListing(); // Refresh listing to show updated status
        } catch (err) {
          console.error('Error accepting fixer:', err);
          showError('Failed to accept fixer. Please try again.');
        }
      }
    });
  };

  const handleMarkAsFixed = () => {
    if (listing.acceptedFixer) {
      // Show rating modal if there's an accepted fixer
      setShowRatingModal(true);
    } else {
      // Just close the listing without rating
      handleCloseWithoutRating();
    }
  };

  const handleCloseWithoutRating = async () => {
    setConfirmModal({
      isOpen: true,
      title: 'Mark as Fixed',
      message: 'Mark this listing as fixed?',
      onConfirm: async () => {
        try {
          await markListingFixed(id);
          success('Listing marked as fixed!');
          fetchListing();
        } catch (err) {
          console.error('Error marking listing as fixed:', err);
          showError('Failed to mark listing as fixed. Please try again.');
        }
      }
    });
  };

  const handleSubmitRating = async () => {
    try {
      await markListingFixed(id, rating, listing.acceptedFixer._id);
      success('Listing marked as fixed and fixer rated!');
      setShowRatingModal(false);
      fetchListing();
    } catch (err) {
      console.error('Error submitting rating:', err);
      showError('Failed to submit rating. Please try again.');
    }
  };

  const isOwner = isAuthenticated && user && listing && listing.postedBy?._id === user._id;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading listing...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
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
                    {listing.status === 'open' ? 'Open' : 'Fixed'}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{listing.title}</h1>

                {/* Posted Info */}
                <div className="flex items-center space-x-4 mb-6 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">Posted by:</span>
                    <span>{listing.postedBy?.name || 'Unknown'}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-2">
                    <span>📅</span>
                    <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{listing.description}</p>
                </div>

                {/* Owner Action: Mark as Fixed Button */}
                {isOwner && listing.status === 'open' && (
                  <div className="mb-6 p-4 bg-green-50 border-2 border-green-500 rounded-lg">
                    <h3 className="font-bold text-green-800 mb-2">Ready to close this listing?</h3>
                    <p className="text-sm text-green-700 mb-3">
                      Mark this listing as fixed when the repair is complete.
                    </p>
                    <button
                      onClick={handleMarkAsFixed}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                      ✓ Mark as Fixed
                    </button>
                  </div>
                )}

                {/* Action Buttons */}
                {listing.status === 'open' && !isOwner && (
                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={() => setShowContactForm(!showContactForm)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition"
                    >
                      {showContactForm ? 'Hide Form' : 'I Can Fix This!'}
                    </button>
                    {listing.postedBy?._id && (
                      <button
                        onClick={() => navigate(`/conversation/${listing._id}?with=${listing.postedBy._id}`)}
                        className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition text-center"
                      >
                        Message Poster
                      </button>
                    )}
                  </div>
                )}

                {/* Contact Form */}
                {showContactForm && (
                  <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Express Interest</h3>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Let them know you can help! Describe your experience..."
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                    />
                    <div className="flex space-x-3">
                      <button
                        onClick={handleExpressInterest}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                        disabled={sending || !message.trim()}
                      >
                        {sending ? 'Sending...' : 'Send Message'}
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
            {/* Interested Fixers - Only visible to poster */}
            {isOwner && listing.interestedFixers && listing.interestedFixers.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Interested Fixers ({listing.interestedFixers.length})
                </h2>
                <div className="space-y-4">
                  {listing.interestedFixers.map((item) => (
                    <div
                      key={item._id}
                      className={`p-4 border-2 rounded-lg ${
                        item.status === 'accepted' 
                          ? 'border-green-500 bg-green-50' 
                          : item.status === 'rejected'
                          ? 'border-gray-300 bg-gray-50 opacity-60'
                          : 'border-blue-200 bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3 mb-3">
                        <img
                          src={item.fixer?.photoUrl}
                          alt={item.fixer?.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <Link 
                            to={`/profile/${item.fixer?._id}`}
                            className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {item.fixer?.name}
                          </Link>
                          <div className="flex items-center text-sm text-gray-600 space-x-2">
                            {item.fixer?.rating && (
                              <>
                                <span>⭐ {item.fixer.rating.toFixed(1)}</span>
                                <span>•</span>
                              </>
                            )}
                            <span>{item.fixer?.fixesCompleted || 0} fixes</span>
                          </div>
                          {item.fixer?.skills && item.fixer.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.fixer.skills.slice(0, 3).map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {item.message && (
                        <div className="bg-white p-3 rounded border border-gray-200 mb-3">
                          <p className="text-sm text-gray-700 italic">&ldquo;{item.message}&rdquo;</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Sent {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      
                      {item.status === 'pending' && !listing.acceptedFixer && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAcceptFixer(item.fixer._id, item.fixer.name)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => navigate(`/conversation/${listing._id}?with=${item.fixer._id}`)}
                            className="flex-1 border-2 border-blue-600 text-blue-600 py-2 px-4 rounded-lg font-semibold hover:bg-blue-50 transition text-sm text-center"
                          >
                            Message
                          </button>
                        </div>
                      )}
                      
                      {item.status === 'accepted' && (
                        <div className="bg-green-100 border border-green-300 rounded-lg p-2 text-center">
                          <p className="text-green-800 font-semibold text-sm">Accepted</p>
                        </div>
                      )}
                      
                      {item.status === 'rejected' && (
                        <div className="text-gray-500 text-sm text-center">
                          Not selected
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Accepted Fixer Card - Visible to everyone */}
            {listing.acceptedFixer && (
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-md p-6 mb-6 border-2 border-green-500">
                <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                  <span className="mr-2">✓</span> Accepted Fixer
                </h2>
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={listing.acceptedFixer.photoUrl}
                    alt={listing.acceptedFixer.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-green-500"
                  />
                  <div className="flex-1">
                    <Link 
                      to={`/profile/${listing.acceptedFixer._id}`}
                      className="font-bold text-blue-600 hover:text-blue-800 hover:underline text-lg"
                    >
                      {listing.acceptedFixer.name}
                    </Link>
                    {listing.acceptedFixer.skills && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {listing.acceptedFixer.skills.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Message Button - Show to both poster and fixer */}
                {user && (user._id === listing.postedBy?._id || user._id === listing.acceptedFixer._id) && (
                  <button
                    onClick={() => navigate(`/conversation/${listing._id}?with=${user._id === listing.postedBy?._id ? listing.acceptedFixer._id : listing.postedBy._id}`)}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Message {user._id === listing.postedBy?._id ? 'Fixer' : 'Poster'}
                  </button>
                )}
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

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Rate the Fixer</h2>
            <p className="text-gray-600 mb-4">
              How would you rate {listing.acceptedFixer?.name}&apos;s work?
            </p>
            
            {/* Star Rating */}
            <div className="flex justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="text-4xl focus:outline-none transition-transform hover:scale-110"
                >
                  {star <= rating ? '★' : '☆'}
                </button>
              ))}
            </div>
            
            <p className="text-center text-gray-600 mb-6">
              Rating: {rating} out of 5 stars
            </p>
            
            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleSubmitRating}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Submit Rating
              </button>
              <button
                onClick={() => setShowRatingModal(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />
    </div>
  );
}

export default ListingDetailPage;

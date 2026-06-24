import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { updateUserProfile, getUserProfile, reportUser } from '../services/userService';
import { getUserListings, getInterestedListings } from '../services/listingService';

function ProfilePage() {
  const { userId } = useParams(); // Get userId from URL if viewing another user's profile
  const { user: authUser, isAuthenticated, loading: authLoading, updateUser, logout } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [myListings, setMyListings] = useState([]);
  const [interestedListings, setInterestedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [isSavingSkills, setIsSavingSkills] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [editFormData, setEditFormData] = useState({
    name: '',
    bio: ''
  });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  // Redirect if not authenticated AND viewing own profile
  useEffect(() => {
    if (!authLoading && !isAuthenticated && !userId) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate, userId]);

  // Fetch user data and listings
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        let profileData;
        let targetUserId;

        // If userId is provided in URL, fetch that user's profile (public view)
        if (userId) {
          profileData = await getUserProfile(userId);
          targetUserId = userId;
        } else if (authUser) {
          // Otherwise, use the authenticated user's data (own profile)
          profileData = authUser;
          targetUserId = authUser._id;
        } else {
          return;
        }

        setUser(profileData);

        // Fetch user's listings
        const listings = await getUserListings(targetUserId);
        setMyListings(listings);

        // Only fetch interested listings for own profile
        if (!userId || (authUser && userId === authUser._id)) {
          const interested = await getInterestedListings(targetUserId);
          setInterestedListings(interested);
        }

        setError('');
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (userId || authUser) {
      fetchProfileData();
    }
  }, [authUser, userId]);

  const handleAddSkill = async () => {
    if (newSkill.trim() && user) {
      const updatedSkills = [...(user.skills || []), newSkill.trim()];

      try {
        setIsSavingSkills(true);
        await updateUserProfile({ skills: updatedSkills });
        setUser(prev => ({
          ...prev,
          skills: updatedSkills
        }));
        setNewSkill('');
      } catch (err) {
        console.error('Error adding skill:', err);
        showError('Failed to add skill. Please try again.');
      } finally {
        setIsSavingSkills(false);
      }
    }
  };

  const handleRemoveSkill = async (skillToRemove) => {
    if (!user) return;

    const updatedSkills = user.skills.filter(skill => skill !== skillToRemove);

    try {
      setIsSavingSkills(true);
      await updateUserProfile({ skills: updatedSkills });
      setUser(prev => ({
        ...prev,
        skills: updatedSkills
      }));
    } catch (err) {
      console.error('Error removing skill:', err);
      showError('Failed to remove skill. Please try again.');
    } finally {
      setIsSavingSkills(false);
    }
  };

  const handleReportUser = async () => {
    if (!reportReason.trim()) {
      showError('Please provide a reason for reporting');
      return;
    }

    try {
      await reportUser(user._id, reportReason);
      success('User reported successfully. Admins will review the case.');
      setShowReportModal(false);
      setReportReason('');
    } catch (err) {
      console.error('Error reporting user:', err);
      showError(err.response?.data?.message || 'Failed to submit report');
    }
  };

  const handleEditProfile = () => {
    setEditFormData({
      name: user.name,
      bio: user.bio || ''
    });
    setIsEditingProfile(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = async () => {
    try {
      setIsSavingSkills(true);
      await updateUserProfile(editFormData);
      setUser(prev => ({
        ...prev,
        ...editFormData
      }));
      setIsEditingProfile(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      showError('Failed to update profile. Please try again.');
    } finally {
      setIsSavingSkills(false);
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log('File selected:', {
      name: file.name,
      size: file.size,
      type: file.type,
      sizeMB: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
    });

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('Image size should be less than 5MB');
      return;
    }

    try {
      setUploadingPhoto(true);
      console.log('Starting file conversion to base64...');

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        const base64Size = (base64String.length / (1024 * 1024)).toFixed(2);
        console.log(`Base64 conversion complete. Size: ${base64Size} MB`);
        setPreviewPhoto(base64String);

        try {
          console.log('Uploading to server...');
          // Upload to server
          await updateUserProfile({ photoUrl: base64String });
          console.log('Upload successful!');

          setUser(prev => ({
            ...prev,
            photoUrl: base64String
          }));

          // Update auth context if viewing own profile
          if (isOwnProfile) {
            updateUser({ photoUrl: base64String });
          }

          success('Profile picture updated successfully!');
          setPreviewPhoto(null);
        } catch (err) {
          console.error('Error uploading photo:', err);
          console.error('Error details:', err.response?.data);
          showError(err.response?.data?.message || 'Failed to upload photo. Please try again.');
          setPreviewPhoto(null);
        } finally {
          setUploadingPhoto(false);
        }
      };

      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        showError('Failed to read the image file');
        setUploadingPhoto(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error processing photo:', err);
      showError('Failed to process photo. Please try again.');
      setUploadingPhoto(false);
    }
  };

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  // Don't render if no user
  if (!user) {
    return null;
  }

  // Check if viewing own profile
  const isOwnProfile = !userId || (authUser && user._id === authUser._id);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Profile Photo */}
            <div className="relative">
              <img
                src={previewPhoto || user.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 bg-gray-100"
              />
              {isOwnProfile && (
                <div className="absolute bottom-0 right-0">
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition flex items-center justify-center"
                    title="Change profile picture"
                  >
                    {uploadingPhoto ? (
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </label>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h1>
              <p className="text-gray-600 mb-3">{user.email}</p>
              <p className="text-gray-700 mb-4">{user.bio || 'No bio added yet.'}</p>

              {/* Stats */}
              <div className="flex justify-center md:justify-start space-x-6 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{user.fixesCompleted || 0}</div>
                  <div className="text-sm text-gray-600">Fixes Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{user.rating || 0}</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{user.badges?.length || 0}</div>
                  <div className="text-sm text-gray-600">Badges</div>
                </div>
              </div>

              {isOwnProfile && (
                <div className="flex justify-center md:justify-start space-x-3">
                  <button
                    onClick={handleEditProfile}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              )}

              {!isOwnProfile && isAuthenticated && user.email && (
                <div className="flex space-x-3 mt-4 md:mt-0">
                  <a
                    href={`mailto:${user.email}?subject=Fix-It Hub: Contact Request&body=Hi ${user.name},%0D%0A%0D%0AI found your profile on Fix-It Hub and would like to get in touch.`}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition inline-block"
                  >
                    Contact Fixer
                  </a>
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-50 transition"
                  >
                    Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Report Modal */}
        {showReportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Report User
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Please describe the issue with this user (harassment, spam, inappropriate behavior, etc.).
                Admins will investigate immediately.
              </p>

              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4 text-sm"
                placeholder="Details about the violation..."
              ></textarea>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setReportReason('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReportUser}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        {isEditingProfile && isOwnProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Profile</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={editFormData.bio}
                    onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                  disabled={isSavingSkills}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                  disabled={isSavingSkills}
                >
                  {isSavingSkills ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Skills & Badges */}
          <div className="space-y-6">
            {/* Skills Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{isOwnProfile ? 'My Skills' : 'Skills'}</h2>
                {isOwnProfile && (
                  <button
                    onClick={() => setIsEditingSkills(!isEditingSkills)}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                    disabled={isSavingSkills}
                  >
                    {isEditingSkills ? 'Done' : 'Edit'}
                  </button>
                )}
              </div>

              {isSavingSkills && (
                <div className="mb-3 text-sm text-blue-600">Saving...</div>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2"
                    >
                      <span>{skill}</span>
                      {isEditingSkills && (
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-red-500 hover:text-red-700"
                          disabled={isSavingSkills}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No skills added yet. Add your first skill below!</p>
                )}
              </div>

              {isEditingSkills && (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a new skill..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && !isSavingSkills && handleAddSkill()}
                    disabled={isSavingSkills}
                  />
                  <button
                    onClick={handleAddSkill}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSavingSkills}
                  >
                    {isSavingSkills ? 'Adding...' : 'Add'}
                  </button>
                </div>
              )}
            </div>

            {/* Badges Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Badges 🏆</h2>
              {user.badges && user.badges.length > 0 ? (
                <div className="space-y-3">
                  {user.badges.map((badge, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 flex items-center space-x-3"
                    >
                      <span className="text-3xl">🏆</span>
                      <div>
                        <h3 className="font-semibold text-purple-700">{badge}</h3>
                        <p className="text-sm text-purple-600">Earned for outstanding contribution</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No badges earned yet. Keep helping others to earn badges!</p>
              )}
            </div>
          </div>

          {/* Right Column - My Listings */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">My Listings 📋</h2>

              {myListings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-4">You have not posted any listings yet.</p>
                  <button
                    onClick={() => navigate('/new-listing')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Post Your First Listing
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myListings.map((listing) => (
                    <div
                      key={listing._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                      onClick={() => navigate(`/listing/${listing._id}`)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{listing.title}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${listing.status === 'open'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                          {listing.status === 'open' ? 'Open' : 'Fixed'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          {listing.category}
                        </span>
                        <span>
                          Posted: {new Date(listing.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Interested Listings Section - Only show for own profile */}
            {isOwnProfile && (
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">My Proposals</h2>
                <p className="text-sm text-gray-600 mb-4">Listings you&apos;ve expressed interest in fixing</p>

                {interestedListings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="mb-4">You haven&apos;t expressed interest in any listings yet.</p>
                    <button
                      onClick={() => navigate('/browse-listings')}
                      className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
                    >
                      Browse Listings
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {interestedListings.map((listing) => (
                      <div
                        key={listing._id}
                        className="border-2 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                        style={{
                          borderColor: listing.userInterestStatus === 'accepted' ? '#10b981' :
                            listing.userInterestStatus === 'rejected' ? '#6b7280' :
                              '#3b82f6'
                        }}
                        onClick={() => navigate(`/listing/${listing._id}`)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{listing.title}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${listing.userInterestStatus === 'accepted'
                              ? 'bg-green-100 text-green-800'
                              : listing.userInterestStatus === 'rejected'
                                ? 'bg-gray-100 text-gray-600'
                                : 'bg-blue-100 text-blue-800'
                              }`}
                          >
                            {listing.userInterestStatus === 'accepted' ? 'Accepted ✓' :
                              listing.userInterestStatus === 'rejected' ? 'Rejected' :
                                'Pending...'}
                          </span>
                        </div>

                        {/* Proposed Price */}
                        {listing.userProposedPrice > 0 && (
                          <div className="mb-2 flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Your offer:</span>
                            <span className="text-lg font-bold text-green-600">₹{listing.userProposedPrice}</span>
                          </div>
                        )}

                        <p className="text-sm text-gray-600 mb-2">
                          Posted by: {listing.postedBy?.name}
                        </p>

                        {listing.userInterestMessage && (
                          <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-2">
                            <p className="text-xs text-gray-600 mb-1">Your pitch:</p>
                            <p className="text-sm text-gray-800 italic">&ldquo;{listing.userInterestMessage}&rdquo;</p>
                          </div>
                        )}

                        <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            {listing.category}
                          </span>
                          <span>
                            Applied: {new Date(listing.userInterestDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

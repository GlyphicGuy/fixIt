import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile, getUserProfile } from '../services/userService';
import { getUserListings, getInterestedListings } from '../services/listingService';

function ProfilePage() {
  const { userId } = useParams(); // Get userId from URL if viewing another user's profile
  const { user: authUser, isAuthenticated, loading: authLoading } = useAuth();
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
  const [editFormData, setEditFormData] = useState({
    name: '',
    bio: ''
  });

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
        alert('Failed to add skill. Please try again.');
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
      alert('Failed to remove skill. Please try again.');
    } finally {
      setIsSavingSkills(false);
    }
  };

  const handleEditProfile = () => {
    setEditFormData({
      name: user.name,
      bio: user.bio || ''
    });
    setIsEditingProfile(true);
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
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSavingSkills(false);
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
            <img
              src={user.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
              alt={user.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 bg-gray-100"
            />

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
                  <div className="text-2xl font-bold text-blue-600">⭐ {user.rating || 0}</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{user.badges?.length || 0}</div>
                  <div className="text-sm text-gray-600">Badges</div>
                </div>
              </div>

              {isOwnProfile && (
                <button 
                  onClick={handleEditProfile}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Edit Profile
                </button>
              )}

              {!isOwnProfile && user.email && (
                <a
                  href={`mailto:${user.email}?subject=Fix-It Hub: Contact Request&body=Hi ${user.name},%0D%0A%0D%0AI found your profile on Fix-It Hub and would like to get in touch.`}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition inline-block"
                >
                  Contact Fixer
                </a>
              )}
            </div>
          </div>
        </div>

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
                <h2 className="text-2xl font-bold text-gray-800">{isOwnProfile ? 'My Skills' : 'Skills'} 🛠️</h2>
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
                          ✕
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
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            listing.status === 'open'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {listing.status === 'open' ? '🔓 Open' : '✅ Fixed'}
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
                <h2 className="text-2xl font-bold text-gray-800 mb-4">My Proposals 💼</h2>
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
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            listing.userInterestStatus === 'accepted'
                              ? 'bg-green-100 text-green-800'
                              : listing.userInterestStatus === 'rejected'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {listing.userInterestStatus === 'accepted' ? '✓ Accepted' : 
                           listing.userInterestStatus === 'rejected' ? '✗ Not Selected' : 
                           '⏳ Pending'}
                        </span>
                      </div>
                      
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

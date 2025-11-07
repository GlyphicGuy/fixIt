import React, { useState } from 'react';

function ProfilePage() {
  // Mock user data - will come from backend/auth later
  const [user, setUser] = useState({
    id: 1,
    name: "John Doe",
    email: "john.doe@college.edu",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    skills: ["Basic Soldering", "Sewing & Mending", "Bicycle Repair"],
    badges: ["Quick Responder", "Helpful Helper"],
    rating: 4.7,
    fixesCompleted: 8,
    bio: "Engineering student passionate about sustainability and fixing things!"
  });

  const [myListings] = useState([
    {
      id: 1,
      title: "Broken Headphones",
      category: "Tech",
      status: "open",
      postedDate: "2025-11-06"
    },
    {
      id: 2,
      title: "Torn Jacket",
      category: "Clothing",
      status: "fixed",
      postedDate: "2025-10-28"
    }
  ]);

  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setUser(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setUser(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Profile Photo */}
            <img
              src={user.photoUrl}
              alt={user.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
            />

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h1>
              <p className="text-gray-600 mb-3">{user.email}</p>
              <p className="text-gray-700 mb-4">{user.bio}</p>

              {/* Stats */}
              <div className="flex justify-center md:justify-start space-x-6 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{user.fixesCompleted}</div>
                  <div className="text-sm text-gray-600">Fixes Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">⭐ {user.rating}</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{user.badges.length}</div>
                  <div className="text-sm text-gray-600">Badges</div>
                </div>
              </div>

              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Skills & Badges */}
          <div className="space-y-6">
            {/* Skills Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">My Skills 🛠️</h2>
                <button
                  onClick={() => setIsEditingSkills(!isEditingSkills)}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  {isEditingSkills ? 'Done' : 'Edit'}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {user.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2"
                  >
                    <span>{skill}</span>
                    {isEditingSkills && (
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {isEditingSkills && (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a new skill..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  />
                  <button
                    onClick={handleAddSkill}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>

            {/* Badges Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Badges 🏆</h2>
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
            </div>
          </div>

          {/* Right Column - My Listings */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">My Listings 📋</h2>
              
              {myListings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-4">You haven't posted any listings yet.</p>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                    Post Your First Listing
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
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
                        <span>Posted: {listing.postedDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

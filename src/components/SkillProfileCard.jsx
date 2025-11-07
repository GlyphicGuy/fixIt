import React from 'react';

function SkillProfileCard({ fixer }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
      {/* Profile Header */}
      <div className="flex items-center space-x-4 mb-4">
        <img 
          src={fixer.photoUrl} 
          alt={fixer.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
        />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800">{fixer.name}</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="flex items-center">
              ⭐ {fixer.rating}
            </span>
            <span>•</span>
            <span>{fixer.fixesCompleted} fixes completed</span>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills:</h4>
        <div className="flex flex-wrap gap-2">
          {fixer.skills.map((skill, index) => (
            <span 
              key={index}
              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Badges:</h4>
        <div className="flex flex-wrap gap-2">
          {fixer.badges.map((badge, index) => (
            <span 
              key={index}
              className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium"
            >
              🏆 {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Contact Button */}
      <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition">
        Contact Fixer
      </button>
    </div>
  );
}

export default SkillProfileCard;

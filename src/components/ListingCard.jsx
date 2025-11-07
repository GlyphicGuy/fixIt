import React from 'react';
import { Link } from 'react-router-dom';

function ListingCard({ listing }) {
  const categoryColors = {
    Tech: 'bg-blue-100 text-blue-800',
    Clothing: 'bg-pink-100 text-pink-800',
    Furniture: 'bg-green-100 text-green-800',
    Other: 'bg-gray-100 text-gray-800'
  };

  const statusColors = {
    open: 'bg-green-500',
    fixed: 'bg-gray-400'
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative">
        <img 
          src={listing.photoUrl} 
          alt={listing.title}
          className="w-full h-48 object-cover"
        />
        <span className={`absolute top-2 right-2 ${statusColors[listing.status]} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
          {listing.status === 'open' ? '🔓 Open' : '✅ Fixed'}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category Badge */}
        <span className={`inline-block ${categoryColors[listing.category]} px-3 py-1 rounded-full text-xs font-semibold mb-2`}>
          {listing.category}
        </span>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-2">{listing.title}</h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{listing.description}</p>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            <span className="font-semibold">Posted by:</span> {listing.postedBy}
          </div>
          <Link 
            to={`/listing/${listing.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ListingCard;

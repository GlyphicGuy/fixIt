import React, { useState } from 'react';

function SearchBar({ onSearch, placeholder = "Search listings..." }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full px-6 py-4 pr-24 rounded-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none shadow-md text-lg"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 transition"
            >
              ✕
            </button>
          )}
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
          >
            🔍
          </button>
        </div>
      </div>
    </form>
  );
}

export default SearchBar;

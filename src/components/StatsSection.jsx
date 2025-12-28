import React, { useState, useEffect } from 'react';
import { getListings } from '../services/listingService';
import { getFixers } from '../services/userService';

function StatsSection() {
  const [stats, setStats] = useState({
    itemsFixed: 0,
    activeFixers: 0,
    avgRating: 0,
    wasteReduced: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [allListings, allFixers] = await Promise.all([
        getListings(),
        getFixers()
      ]);

      // Count fixed items
      const itemsFixed = allListings.filter(listing => listing.status === 'fixed').length;

      // Count active fixers (users with skills)
      const activeFixers = allFixers.filter(fixer => fixer.skills && fixer.skills.length > 0).length;

      // Calculate average rating
      const fixersWithRatings = allFixers.filter(fixer => fixer.rating > 0);
      const avgRating = fixersWithRatings.length > 0
        ? (fixersWithRatings.reduce((sum, fixer) => sum + fixer.rating, 0) / fixersWithRatings.length)
        : 0;

      // Estimate waste reduced (assuming each fix saves ~8kg on average)
      const wasteReduced = itemsFixed * 8; // in kg

      setStats({
        itemsFixed,
        activeFixers,
        avgRating: avgRating.toFixed(1),
        wasteReduced
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatWaste = (kg) => {
    if (kg >= 1000) {
      return `${(kg / 1000).toFixed(1)} Tons`;
    }
    return `${kg} kg`;
  };

  const statsData = [
    {
      icon: '',
      number: loading ? '...' : `${stats.itemsFixed}`,
      label: 'Items Fixed',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: '',
      number: loading ? '...' : `${stats.activeFixers}`,
      label: 'Active Fixers',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: '',
      number: loading ? '...' : formatWaste(stats.wasteReduced),
      label: 'Waste Reduced',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: '',
      number: loading ? '...' : stats.avgRating > 0 ? stats.avgRating : 'N/A',
      label: 'Avg Rating',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Our Impact
          </h2>
          <p className="text-xl text-gray-600">
            Building a more sustainable campus community together
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`bg-gradient-to-br ${stat.color} p-8 text-white text-center`}>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg font-semibold opacity-90">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StatsSection;

import React from 'react';

function StatsSection() {
  const stats = [
    {
      icon: '🔧',
      number: '250+',
      label: 'Items Fixed',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: '👥',
      number: '150+',
      label: 'Active Fixers',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: '🌱',
      number: '2 Tons',
      label: 'Waste Reduced',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: '⭐',
      number: '4.8',
      label: 'Avg Rating',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Our Impact 🌍
          </h2>
          <p className="text-xl text-gray-600">
            Building a more sustainable campus community together
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`bg-gradient-to-br ${stat.color} p-8 text-white text-center`}>
                <div className="text-5xl mb-4">{stat.icon}</div>
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

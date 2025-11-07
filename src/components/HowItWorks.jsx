import React from 'react';

function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Post Your Item',
      description: 'Have something broken? Create a listing with photos and details about what needs fixing.',
      icon: '📝',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      number: '2',
      title: 'Connect with Fixers',
      description: 'Browse skilled fixers or wait for them to reach out. Check ratings and skills to find the right match.',
      icon: '🤝',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      number: '3',
      title: 'Get It Fixed',
      description: 'Meet on campus, get your item repaired, and learn something new! Rate your experience afterward.',
      icon: '✨',
      color: 'bg-green-100 text-green-600'
    },
    {
      number: '4',
      title: 'Reduce, Reuse, Recycle',
      description: 'Save money, reduce waste, and help build a sustainable campus community!',
      icon: '🌱',
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            How It Works 🚀
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Getting your items fixed has never been easier. Join our community and start repairing today!
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-1/2 w-full h-1 bg-gradient-to-r from-blue-300 to-purple-300 z-0" />
              )}

              {/* Step Card */}
              <div className="relative bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 z-10">
                {/* Number Badge */}
                <div className={`absolute -top-4 -left-4 w-12 h-12 ${step.color} rounded-full flex items-center justify-center text-2xl font-bold shadow-lg`}>
                  {step.number}
                </div>

                {/* Icon */}
                <div className="text-6xl text-center mb-4 mt-4">
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-800 text-center mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <a
            href="/new-listing"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl"
          >
            Get Started Now! 🎯
          </a>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;

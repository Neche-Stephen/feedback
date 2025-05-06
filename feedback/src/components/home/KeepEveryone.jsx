import React from 'react';

export default function KeepEveryone() {
  return (
    <div className="w-full bg-blue-900 py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Heading and text section */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Keep every one in the loop
        </h1>
        
        <p className="text-lg md:text-xl text-white opacity-90 mb-10">
          All good things starts with a homepage. Get 
          inspired without breaking your wallet.
        </p>
        
        {/* CTA Button */}
        <div className="mb-12">
          <button className="bg-white text-gray-900 rounded-full py-3 px-8 font-medium text-lg hover:bg-gray-100 transition-colors">
            Start for free
          </button>
        </div>
        
        {/* Dashboard Image Placeholder */}
        <div className="w-full max-w-5xl mx-auto">
          <img 
            src="/api/placeholder/1100/500" 
            alt="Dashboard preview" 
            className="w-full h-auto rounded-md shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
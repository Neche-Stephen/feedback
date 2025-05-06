import React from 'react';

export default function BetterFeedback() {
  return (
    <div className="bg-blue-600 w-full min-h-screen flex flex-col items-center justify-center py-16 px-4">
      {/* Text Content */}
      <div className="text-center mb-10">
        <p className="text-white text-lg mb-2">Best time here</p>
        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold max-w-4xl">
          Better feedback at the right time.
        </h1>
      </div>
      
      {/* Dashboard Image Placeholder */}
      <div className="w-full max-w-5xl bg-gray-200 rounded-lg overflow-hidden shadow-lg">
        {/* This is a placeholder - you'll replace with your actual dashboard image */}
        <div className="w-full aspect-[16/9] flex items-center justify-center text-gray-500 font-medium">
          Dashboard Image Placeholder
        </div>
      </div>
    </div>
  );
}
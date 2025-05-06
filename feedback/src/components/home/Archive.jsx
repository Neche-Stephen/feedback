import { useState } from 'react';

export default function Archive() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 w-full">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12">
        Your Archive of progress
      </h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Box - Projects */}
        <div className="w-full md:w-1/2 bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-800">Projects</h2>
            <p className="text-gray-600">Organize, follow, and archive.</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium">Overview</h3>
              <button className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm">
                Monthly
              </button>
            </div>
            
            {/* Placeholder for the chart image */}
            <div className="h-48 w-full bg-white rounded">
              <img 
                src="/api/placeholder/500/192" 
                alt="Projects chart" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        
        {/* Right Box - Member profiles */}
        <div className="w-full md:w-1/2 bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-800">Member profiles</h2>
            <p className="text-gray-600">Automatic portfolios of your work.</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="mb-6">
              <button className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm">
                New Leads
              </button>
            </div>
            
            <div className="flex items-start mb-2">
              <h3 className="text-4xl font-bold">3,729</h3>
            </div>
            
            <div className="text-gray-400 text-xl mb-4">
              70.0%
            </div>
            
            {/* Placeholder for the chart image */}
            <div className="h-24 w-full bg-white rounded">
              <img 
                src="/api/placeholder/500/96" 
                alt="Member profiles chart" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
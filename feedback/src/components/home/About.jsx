import React from 'react';

export default function About() {
  return (
    <div className="bg-blue-50 min-h-screen w-full flex items-center justify-center p-4">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center">
        {/* Left Column */}
        <div className="lg:w-1/2 p-6 lg:pr-12">
          <button className="bg-blue-500 text-white rounded-full px-4 py-2 mb-6 hover:bg-blue-600 transition-colors">
            Share
          </button>
          
          <h1 className="text-5xl font-bold text-gray-800 mb-8">
            For Extension Developers
          </h1>
          
          <div className="space-y-4">
            <div>
              <p className="font-medium text-gray-700">Identify Pain Points:</p>
              <p className="text-gray-600">Discover why users uninstall your extensions</p>
            </div>
            
            <div>
              <p className="font-medium text-gray-700">Improve Retention:</p>
              <p className="text-gray-600">Address common issues before other users leave</p>
            </div>
            
            <div>
              <p className="font-medium text-gray-700">Data-Driven Decisions:</p>
              <p className="text-gray-600">Make improvements based on real user feedback</p>
            </div>
            
            <div>
              <p className="font-medium text-gray-700">Simple Integration:</p>
              <p className="text-gray-600">Easy-to-implement API for collecting uninstall feedback</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 mt-8">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">Coded</span>
            </div>
            
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">100% Secure</span>
            </div>
          </div>
          
          <button className="mt-8 flex items-center bg-red-500 text-white rounded-full px-5 py-2 hover:bg-red-600 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            See how it works
          </button>
        </div>
        
        {/* Right Column - Code Snippet */}
        <div className="lg:w-1/2 mt-8 lg:mt-0">
            <img src="./assets/home/api.png" alt="" />
        </div>
      </div>
    </div>
  );
}
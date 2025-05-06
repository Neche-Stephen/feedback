import React from 'react';

export default function Works() {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* For Developers Section */}
        <div className="flex flex-col lg:flex-row items-center mb-20 bg-white rounded-lg shadow-sm p-8">
          {/* Left Side - Placeholder for "Looking for feedback" image */}
          <div className="lg:w-2/5 mb-8 lg:mb-0">
            <div className="bg-gray-200 rounded-lg h-80 w-full lg:w-4/5 mx-auto">
              {/* This is a placeholder - you'll replace with your image */}
              <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium">
                Feedback UI Image Placeholder
              </div>
            </div>
          </div>
          
          {/* Right Side - Content */}
          <div className="lg:w-3/5">
            <div className="inline-block mb-4">
              <span className="bg-orange-500 text-white font-medium px-4 py-2 rounded-full text-sm">
                How It Works
              </span>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 text-gray-900">For Developers</h2>
            
            <div className="space-y-4 text-gray-600">
              <div>
                <p><span className="font-medium text-gray-700">Simple Integration:</span> Add our lightweight feedback collection script to your extension's uninstall process</p>
              </div>
              
              <div>
                <p><span className="font-medium text-gray-700">Customizable Forms:</span> Design questions that address your specific concerns</p>
              </div>
              
              <div>
                <p><span className="font-medium text-gray-700">Real-time Insights:</span> Access feedback through our dashboard or API</p>
              </div>
              
              <div>
                <p><span className="font-medium text-gray-700">Actionable Analytics:</span> View trends and common issues at a glance</p>
              </div>
            </div>
            
            <button className="mt-8 flex items-center bg-orange-500 text-white rounded-full px-5 py-2 hover:bg-orange-600 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              See how it works
            </button>
          </div>
        </div>
        
        {/* For Users Section */}
        <div className="flex flex-col lg:flex-row-reverse items-center bg-white rounded-lg shadow-sm p-8">
          {/* Right Side - Placeholder for "Looking for feedback" image */}
          <div className="lg:w-2/5 mb-8 lg:mb-0">
            <div className="bg-gray-200 rounded-lg h-80 w-full lg:w-4/5 mx-auto">
              {/* This is a placeholder - you'll replace with your image */}
              <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium">
                Feedback UI Image Placeholder
              </div>
            </div>
          </div>
          
          {/* Left Side - Content */}
          <div className="lg:w-3/5">
            <div className="inline-block mb-4">
              <span className="bg-orange-500 text-white font-medium px-4 py-2 rounded-full text-sm">
                How It Works
              </span>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 text-gray-900">For Users</h2>
            
            <div className="space-y-4 text-gray-600">
              <div>
                <p><span className="font-medium text-gray-700">Quick & Respectful:</span> Brief, non-intrusive questions when they uninstall</p>
              </div>
              
              <div>
                <p><span className="font-medium text-gray-700">Multiple Formats:</span> Single-click options or free-form feedback</p>
              </div>
              
              <div>
                <p><span className="font-medium text-gray-700">Privacy-Focused:</span> Optional anonymity and clear data usage policies</p>
              </div>
              
              <div>
                <p><span className="font-medium text-gray-700">Direct Impact:</span> Assurance that their feedback shapes future development</p>
              </div>
            </div>
            
            <button className="mt-8 flex items-center bg-orange-500 text-white rounded-full px-5 py-2 hover:bg-orange-600 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              See how it works
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
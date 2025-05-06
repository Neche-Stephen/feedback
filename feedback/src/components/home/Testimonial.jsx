import React from 'react';

export default function Testimonial() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Testimonial */}
        <div className="flex flex-col">
          <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded transform rotate-12"></div>
          </div>
          
          <p className="text-gray-800 text-lg mb-6">
            Cloudhub has emerged as an essential asset for the team at 
            Patreon design. Amidst an accelerated expanding 
            organization in which the product undergoes rapid changes, 
            Campsite enables us to maintain visibility on what's 
            transpiring across various teams — impeccably aligning with 
            our pre-existing procedures.
          </p>
          
          <div className="flex items-center mt-auto">
            <div className="w-12 h-12 rounded-full bg-pink-100 overflow-hidden">
              <img 
                src="/api/placeholder/48/48" 
                alt="Gabriel Valdivia" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-4">
              <h4 className="font-medium text-gray-900">Gabriel Valdivia</h4>
              <p className="text-gray-500 text-sm">Principal Product Designer, Patreon</p>
            </div>
          </div>
        </div>
        
        {/* Right Testimonial */}
        <div className="flex flex-col">
          <div className="w-14 h-14 bg-gray-900 rounded-lg flex items-center justify-center mb-6">
            <div className="text-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L14.4 9.20001H22L16 14L18 22L12 17.2L6 22L8 14L2 9.20001H9.6L12 2Z" fill="white"/>
              </svg>
            </div>
          </div>
          
          <p className="text-gray-800 text-lg mb-6">
            Cloudhub has demonstrated exceptional worth in preserving 
            open communication among designers regarding their current 
            endeavors, a challenge that previously impeded our progress. It 
            continually stands as a distinctive platform guiding our dialogue 
            towards imagination and consistent review, an element I highly 
            value. Moreover, it has accelerated our propensity for early-
            stage feedback beyond my expectations.
          </p>
          
          <div className="flex items-center mt-auto">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img 
                src="/api/placeholder/48/48" 
                alt="Buzz Usborne" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-4">
              <h4 className="font-medium text-gray-900">Buzz Usborne</h4>
              <p className="text-gray-500 text-sm">Principal Designer, Buildkite</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';

export default function Support() {
  // Companies data array - in a real implementation you'd replace these with actual logo URLs
  const companies = [
    { name: "Crowdstrike", placeholder: "/api/placeholder/180/60", className: "h-8" },
    { name: "Airbus", placeholder: "/api/placeholder/180/60", className: "h-8" },
    { name: "Hays", placeholder: "/api/placeholder/180/60", className: "h-8" },
    { name: "Sentry", placeholder: "/api/placeholder/180/60", className: "h-8" },
    { name: "MedWing", placeholder: "/api/placeholder/180/60", className: "h-6" },
    { name: "Cathay Pacific", placeholder: "/api/placeholder/180/60", className: "h-7" },
    { name: "Liquid Web", placeholder: "/api/placeholder/180/60", className: "h-7" },
    { name: "AutoTrader", placeholder: "/api/placeholder/180/60", className: "h-7" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
      <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16">
        Loved By Developers At
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {companies.map((company, index) => (
          <div 
            key={index} 
            className="bg-gray-50 rounded-xl p-6 flex items-center justify-center"
          >
            <img 
              src={company.placeholder} 
              alt={`${company.name} logo`} 
              className={company.className}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
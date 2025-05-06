import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo Section */}
          <div className="md:col-span-1">
            <div className="flex items-center">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                <rect width="40" height="40" rx="20" fill="white" />
                <path d="M28 20C28 24.4183 24.4183 28 20 28C15.5817 28 12 24.4183 12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20Z" stroke="#00C2A8" strokeWidth="2" />
                <path d="M24 20H18V16" stroke="#00C2A8" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="text-xl font-bold">Feedbk</span>
            </div>
          </div>
          
          {/* Product Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition">Features</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Pricing</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Changelog</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Support</a></li>
            </ul>
          </div>
          
          {/* Legal Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition">Terms of Privacy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Security</a></li>
            </ul>
          </div>
          
          {/* Company Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition">Blog</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Contact</a></li>
            </ul>
          </div>
          
          {/* Social Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium mb-4">Social</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition">Dribbble</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Behance</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Discord</a></li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-16 text-center md:text-right text-gray-400 text-sm">
          All rights reserved.© 2025 Feedbk.com
        </div>
      </div>
    </footer>
  );
}
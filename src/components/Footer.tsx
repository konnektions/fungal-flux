import React from 'react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#1A1A1A] text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/greenLogo.png" 
                alt="Fungal Flux" 
                className="w-8 h-8 object-contain"
              />
              <h3 className="font-['Lato'] text-2xl font-bold text-[#2D4A3E]">
                Fungal Flux
              </h3>
            </div>
            <p className="text-gray-300 leading-relaxed max-w-md">
              Your trusted partner for premium mushroom cultivation supplies. We're passionate 
              about making mycology accessible to everyone, from curious beginners to experienced cultivators.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onNavigate('shop')}
                  className="text-gray-300 hover:text-[#8FA89E] transition-colors text-sm"
                >
                  Liquid Cultures
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('shop')}
                  className="text-gray-300 hover:text-[#8FA89E] transition-colors text-sm"
                >
                  Grow Kits
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('shop')}
                  className="text-gray-300 hover:text-[#8FA89E] transition-colors text-sm"
                >
                  Growing Supplies
                </button>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onNavigate('contact')}
                  className="text-gray-300 hover:text-[#8FA89E] transition-colors text-sm"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('about')}
                  className="text-gray-300 hover:text-[#8FA89E] transition-colors text-sm"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('growing-guides')}
                  className="text-gray-300 hover:text-[#8FA89E] transition-colors text-sm"
                >
                  Growing Guides
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shipping-info')}
                  className="text-gray-300 hover:text-[#8FA89E] transition-colors text-sm"
                >
                  Shipping Info
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2024 Fungal Flux. All rights reserved. | Cultivating excellence, one mushroom at a time.
          </p>
        </div>
      </div>
    </footer>
  );
}
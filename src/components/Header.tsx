import React, { useState } from 'react';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onCartOpen: () => void;
}

export default function Header({ currentPage, onNavigate, onCartOpen }: HeaderProps) {
  const { getTotalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalItems = getTotalItems();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-2xl font-bold text-[#2D4A3E] hover:opacity-80 transition-opacity"
          >
            <img 
              src="/greenLogo.png" 
              alt="Fungal Flux" 
              className="w-10 h-10 object-contain"
            />
            <span className="font-['Lato']">Fungal Flux</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex">
            <ul className="flex gap-8">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`font-medium transition-colors ${
                      currentPage === item.id
                        ? 'text-[#2D4A3E]'
                        : 'text-gray-700 hover:text-[#2D4A3E]'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-700 hover:text-[#2D4A3E] transition-colors">
              <Search size={20} />
            </button>
            
            <button 
              onClick={onCartOpen}
              className="relative p-2 text-gray-700 hover:text-[#2D4A3E] transition-colors"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#2D4A3E] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-[#2D4A3E] transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onNavigate(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`block w-full text-left py-2 px-4 rounded-lg font-medium transition-colors ${
                        currentPage === item.id
                          ? 'text-[#2D4A3E] bg-gray-50'
                          : 'text-gray-700 hover:text-[#2D4A3E] hover:bg-gray-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
import React from 'react';
import { Beaker, Package, Microscope, GraduationCap, MessageCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { Product } from '../types';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onProductClick: (product: Product) => void;
}

export default function HomePage({ onNavigate, onProductClick }: HomePageProps) {
  const featuredProducts = products.filter(p => p.featured);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2D4A3E]/5 to-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="font-['Lato'] text-5xl lg:text-6xl font-bold text-[#2D4A3E] leading-tight mb-6">
                Grow Your Own Gourmet Mushrooms
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Professional-grade cultures and beginner-friendly kits for home cultivation. 
                Start your mycology journey with lab-tested quality and expert guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => onNavigate('shop')}
                  className="bg-[#2D4A3E] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#4A6B5A] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Shop Grow Kits
                </button>
                <button 
                  onClick={() => onNavigate('shop')}
                  className="border-2 border-[#2D4A3E] text-[#2D4A3E] px-8 py-4 rounded-lg font-semibold hover:bg-[#2D4A3E] hover:text-white transition-all duration-200"
                >
                  Browse Cultures
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8 h-96 flex items-center justify-center">
                <img 
                  src="https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Gourmet Mushrooms" 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-['Lato'] text-4xl font-semibold text-[#2D4A3E] text-center mb-12">
            Start Your Growing Journey
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-10 rounded-2xl text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border border-gray-200">
              <div className="w-16 h-16 bg-[#2D4A3E] rounded-full flex items-center justify-center mx-auto mb-6">
                <Beaker className="text-white" size={28} />
              </div>
              <h3 className="font-['Lato'] text-2xl font-semibold text-[#2D4A3E] mb-4">
                Liquid Cultures
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Lab-grade sterile cultures ready to inoculate your growing medium. 
                Each culture is tested for purity and viability.
              </p>
              <button 
                onClick={() => onNavigate('shop')}
                className="bg-[#2D4A3E] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#4A6B5A] transition-colors"
              >
                Shop Cultures
              </button>
            </div>
            
            <div className="bg-white p-10 rounded-2xl text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border border-gray-200">
              <div className="w-16 h-16 bg-[#2D4A3E] rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="text-white" size={28} />
              </div>
              <h3 className="font-['Lato'] text-2xl font-semibold text-[#2D4A3E] mb-4">
                Grow Kits
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Everything you need to start growing today. Complete kits with 
                detailed instructions perfect for beginners.
              </p>
              <button 
                onClick={() => onNavigate('shop')}
                className="bg-[#2D4A3E] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#4A6B5A] transition-colors"
              >
                Shop Kits
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-['Lato'] text-4xl font-semibold text-[#2D4A3E] text-center mb-12">
            Featured Products
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onProductClick={onProductClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-['Lato'] text-4xl font-semibold text-[#2D4A3E] text-center mb-12">
            Why Choose Fungal Flux?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-18 h-18 bg-[#2D4A3E] rounded-full flex items-center justify-center mx-auto mb-6">
                <Microscope className="text-white" size={32} />
              </div>
              <h4 className="font-['Lato'] text-xl font-semibold text-[#2D4A3E] mb-3">
                100% Sterile Cultures
              </h4>
              <p className="text-gray-600 leading-relaxed">
                All our cultures are produced in a professional laboratory environment 
                with rigorous quality control.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-18 h-18 bg-[#2D4A3E] rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="text-white" size={32} />
              </div>
              <h4 className="font-['Lato'] text-xl font-semibold text-[#2D4A3E] mb-3">
                Beginner Friendly
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive guides and kits designed to ensure success for growers 
                of all experience levels.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-18 h-18 bg-[#2D4A3E] rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="text-white" size={32} />
              </div>
              <h4 className="font-['Lato'] text-xl font-semibold text-[#2D4A3E] mb-3">
                Expert Support
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Our mycology experts are here to help you succeed at every step 
                of your growing journey.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
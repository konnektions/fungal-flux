import React, { useState, useEffect } from 'react';
import { productService } from '../lib/supabase';
import { Loader2, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Product, DBProduct } from '../types';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onProductClick: (product: Product) => void;
}

export default function HomePage({ onNavigate, onProductClick }: HomePageProps) {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const data = await productService.getFeatured();
      const transformedProducts = data.map(transformProduct);
      setFeaturedProducts(transformedProducts);
    } catch (error) {
      console.error('Error loading featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const transformProduct = (dbProduct: DBProduct): Product => ({
    id: dbProduct.id,
    name: dbProduct.name,
    price: parseFloat(dbProduct.price),
    image: dbProduct.image_url || '', // Note: We map image_url to image here
    category: dbProduct.category,
    description: dbProduct.description || '',
    inStock: dbProduct.in_stock && dbProduct.stock_quantity > 0,
    featured: dbProduct.featured,
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2D4A3E]/10 to-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-['Lato'] text-5xl font-bold text-[#2D4A3E] mb-6">
                Grow Your Own Gourmet Mushrooms
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Premium mushroom growing supplies for everyone from curious beginners to experienced cultivators.
              </p>
              <button
                onClick={() => onNavigate('shop')}
                className="flex items-center gap-2 px-6 py-3 bg-[#2D4A3E] text-white rounded-lg font-semibold hover:bg-[#4A6B5A] transition-colors"
              >
                Shop Now
                <ArrowRight size={18} />
              </button>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Mushroom cultivation"
                className="w-full rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-['Lato'] text-4xl font-semibold text-[#2D4A3E] text-center mb-12">
            Why Grow with Fungal Flux?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-[#2D4A3E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span role="img" aria-label="Quality" className="text-3xl">🌱</span>
              </div>
              <h3 className="font-['Lato'] text-xl font-semibold text-[#2D4A3E] mb-3">
                Premium Quality
              </h3>
              <p className="text-gray-600">
                All our products are lab-tested to ensure the highest standards of purity and viability.
              </p>
            </div>
            
            <div className="p-8 bg-white rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-[#2D4A3E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span role="img" aria-label="Support" className="text-3xl">📘</span>
              </div>
              <h3 className="font-['Lato'] text-xl font-semibold text-[#2D4A3E] mb-3">
                Expert Guidance
              </h3>
              <p className="text-gray-600">
                Detailed growing guides and responsive customer support ensure your success.
              </p>
            </div>
            
            <div className="p-8 bg-white rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-[#2D4A3E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span role="img" aria-label="Guarantee" className="text-3xl">🌟</span>
              </div>
              <h3 className="font-['Lato'] text-xl font-semibold text-[#2D4A3E] mb-3">
                Satisfaction Guaranteed
              </h3>
              <p className="text-gray-600">
                We stand behind our products with a 100% satisfaction guarantee.
              </p>
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
          
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#2D4A3E]" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onProductClick={onProductClick}
                />
              ))}

              {featuredProducts.length === 0 && (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500">No featured products available at the moment.</p>
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('shop')}
              className="px-6 py-3 bg-white border border-[#2D4A3E] text-[#2D4A3E] rounded-lg font-semibold hover:bg-[#2D4A3E] hover:text-white transition-colors"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-['Lato'] text-4xl font-semibold text-[#2D4A3E] text-center mb-12">
            What Our Customers Say
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-xl shadow-sm">
              <div className="flex items-center gap-1 text-yellow-400 mb-4">
                {'★★★★★'.split('').map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
              </div>
              <p className="text-gray-600 italic mb-6">
                "I've tried several grow kits, and Fungal Flux is by far the best. My Lion's Mane kit produced beautiful clusters within weeks!"
              </p>
              <div className="font-semibold">- Sarah T.</div>
            </div>
            
            <div className="p-8 bg-white rounded-xl shadow-sm">
              <div className="flex items-center gap-1 text-yellow-400 mb-4">
                {'★★★★★'.split('').map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
              </div>
              <p className="text-gray-600 italic mb-6">
                "Their customer service is unmatched. They walked me through every step of the growing process when I had questions."
              </p>
              <div className="font-semibold">- Mark R.</div>
            </div>
            
            <div className="p-8 bg-white rounded-xl shadow-sm">
              <div className="flex items-center gap-1 text-yellow-400 mb-4">
                {'★★★★★'.split('').map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
              </div>
              <p className="text-gray-600 italic mb-6">
                "The liquid cultures are incredibly clean and vigorous. I've had a 100% success rate with inoculations."
              </p>
              <div className="font-semibold">- Jamie K.</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { productService } from '../lib/supabase';
import { Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

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

  const transformProduct = (dbProduct: {
    id: string;
    name: string;
    price: string;
    image_url: string | null;
    category: string;
    description: string | null;
    in_stock: boolean;
    stock_quantity: number;
    featured: boolean;
  }): Product => ({
    id: dbProduct.id,
    name: dbProduct.name,
    price: parseFloat(dbProduct.price),
    image: dbProduct.image_url || '',
    category: dbProduct.category as 'grow-kits' | 'liquid-cultures' | 'supplies',
    description: dbProduct.description || '',
    inStock: dbProduct.in_stock && dbProduct.stock_quantity > 0,
    featured: dbProduct.featured,
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2D4A3E]/10 to-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-['Lato'] text-5xl font-bold text-[#2D4A3E] mb-6">
            Cultivating Excellence, One Mushroom at a Time
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Your trusted partner for premium mushroom cultivation supplies. We're passionate about making mycology accessible to everyone.
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="mt-8 bg-[#2D4A3E] text-white py-3 px-8 rounded-lg font-semibold hover:bg-[#4A6B5A] transition-colors"
          >
            Shop Now
          </button>
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
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
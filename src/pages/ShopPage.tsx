// src/pages/ShopPage.tsx - Updated for Supabase
import React, { useState, useEffect } from 'react';
import { Filter, Loader2, AlertCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Product, DBProduct } from '../types';
import { supabase } from '../lib/supabase';

interface ShopPageProps {
  onProductClick: (product: Product) => void;
}

export default function ShopPage({ onProductClick }: ShopPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'grow-kits', label: 'Grow Kits' },
    { id: 'liquid-cultures', label: 'Liquid Cultures' },
    { id: 'supplies', label: 'Growing Supplies' }
  ];

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      // Filter by category if not 'all'
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Transform database products to app format
      const transformedProducts = data.map(transformProduct);
      setProducts(transformedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Transform database product to app product format
  const transformProduct = (dbProduct: DBProduct): Product => ({
    id: dbProduct.id,
    name: dbProduct.name,
    price: parseFloat(dbProduct.price),
    image: dbProduct.image_url || '',
    category: dbProduct.category,
    description: dbProduct.description || '',
    inStock: dbProduct.in_stock && dbProduct.stock_quantity > 0,
    featured: dbProduct.featured,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#2D4A3E]" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to Load Products
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadProducts}
            className="bg-[#2D4A3E] text-white px-6 py-2 rounded-lg hover:bg-[#4A6B5A] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-['Lato'] text-4xl font-bold text-[#2D4A3E] mb-4">
            Shop All Products
          </h1>
          <p className="text-xl text-gray-600">
            Discover our complete collection of premium mushroom growing supplies
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                    selectedCategory === category.id
                      ? 'bg-[#2D4A3E] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors sm:hidden"
            >
              <Filter size={16} />
              Filters
            </button>
          </div>
        </div>

        {/* Product Count */}
        <div className="mb-8">
          <p className="text-gray-600">
            Showing {products.length} product{products.length !== 1 ? 's' : ''}
            {selectedCategory !== 'all' && (
              <span> in {categories.find(c => c.id === selectedCategory)?.label}</span>
            )}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onProductClick={onProductClick}
            />
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              {selectedCategory === 'all' 
                ? 'No products are currently available.' 
                : `No products found in ${categories.find(c => c.id === selectedCategory)?.label}.`
              }
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-[#2D4A3E] hover:underline"
            >
              View all products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
// Add these imports at the top
import { useState, useEffect } from 'react';
import { productService } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

// Replace the featuredProducts logic with:
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

  const transformProduct = (dbProduct: any): Product => ({
    id: dbProduct.id,
    name: dbProduct.name,
    price: parseFloat(dbProduct.price),
    image: dbProduct.image_url || '',
    category: dbProduct.category,
    description: dbProduct.description || '',
    inStock: dbProduct.in_stock && dbProduct.stock_quantity > 0,
    featured: dbProduct.featured,
  });

  // In the featured products section, replace the grid with:
  // ... (rest of component)
  
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
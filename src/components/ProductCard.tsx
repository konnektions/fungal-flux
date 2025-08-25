import React from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

export default function ProductCard({ product, onProductClick }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div 
      onClick={() => onProductClick(product)}
      className="bg-white border border-gray-200 rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-[#8FA89E] cursor-pointer group"
    >
      <div className="relative mb-5">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg bg-gray-100"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      
      <h4 className="font-['Lato'] text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#2D4A3E] transition-colors">
        {product.name}
      </h4>
      
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {product.description}
      </p>
      
      <div className="text-xl font-bold text-[#2D4A3E] mb-4">
        ${product.price.toFixed(2)}
      </div>
      
      <button
        onClick={handleAddToCart}
        disabled={!product.inStock}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
          product.inStock
            ? 'bg-[#2D4A3E] text-white hover:bg-[#4A6B5A] hover:-translate-y-0.5 hover:shadow-md'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
}
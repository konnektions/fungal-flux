import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface StockQuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  disabled?: boolean;
}

export default function StockQuantityInput({ 
  value, 
  onChange, 
  label = 'Stock Quantity',
  disabled = false 
}: StockQuantityInputProps) {
  const handleIncrement = () => {
    onChange(value + 1);
  };

  const handleDecrement = () => {
    if (value > 0) {
      onChange(value - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= 0) {
      onChange(newValue);
    } else if (e.target.value === '') {
      onChange(0);
    }
  };

  // Determine color based on stock level
  const getStockColor = () => {
    if (value === 0) return 'text-gray-500 bg-gray-50 border-gray-300';
    if (value < 5) return 'text-red-600 bg-red-50 border-red-300';
    if (value <= 10) return 'text-yellow-600 bg-yellow-50 border-yellow-300';
    return 'text-green-600 bg-green-50 border-green-300';
  };

  // Determine badge color based on stock level
  const getBadgeColor = () => {
    if (value === 0) return 'bg-gray-100 text-gray-800';
    if (value < 5) return 'bg-red-100 text-red-800';
    if (value <= 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  // Get stock status text
  const getStatusText = () => {
    if (value === 0) return 'Out of Stock';
    if (value < 5) return 'Low Stock';
    if (value <= 10) return 'Limited Stock';
    return 'In Stock';
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value === 0}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4 text-gray-600" />
        </button>
        
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
          min="0"
          step="1"
          className={`w-24 px-4 py-2 text-center font-semibold rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#2D4A3E] transition-colors ${getStockColor()}`}
        />
        
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      
      {/* Stock Status Badge */}
      <div className="mt-2">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor()}`}>
          {getStatusText()}
        </span>
      </div>
    </div>
  );
}
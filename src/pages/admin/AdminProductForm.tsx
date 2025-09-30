import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Loader2, AlertCircle, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { ProductFormData, DBProduct } from '../../types';
import { useProducts } from '../../hooks/useProducts';
import { validateForm, FormErrors } from '../../lib/validators';
import StockQuantityInput from '../../components/admin/StockQuantityInput';

export default function AdminProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { createProduct, updateProduct, getProduct } = useProducts();
  const nameInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = Boolean(id);
  const pageTitle = isEditMode ? 'Edit Product' : 'Add Product';

  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    category: 'grow-kits',
    description: '',
    stock_quantity: 0,
    featured: false,
    image_url: '',
  });

  // Error state
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProduct, setIsFetchingProduct] = useState(false);
  
  // Image preview error state
  const [imageError, setImageError] = useState(false);

  // Fetch product data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      loadProduct(id);
    }
  }, [id, isEditMode]);

  // Auto-focus on first field
  useEffect(() => {
    if (nameInputRef.current && !isFetchingProduct) {
      nameInputRef.current.focus();
    }
  }, [isFetchingProduct]);

  const loadProduct = async (productId: string) => {
    setIsFetchingProduct(true);
    const result = await getProduct(productId);
    
    if (result.success && result.data) {
      const dbProduct = result.data as DBProduct;
      setFormData({
        name: dbProduct.name,
        price: parseFloat(dbProduct.price),
        category: dbProduct.category,
        description: dbProduct.description || '',
        stock_quantity: dbProduct.stock_quantity,
        featured: dbProduct.featured,
        image_url: dbProduct.image_url || '',
      });
    } else {
      // If failed to load, navigate back
      navigate('/admin/products');
    }
    
    setIsFetchingProduct(false);
  };

  const handleInputChange = (
    field: keyof ProductFormData,
    value: string | number | boolean
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Reset image error when URL changes
    if (field === 'image_url') {
      setImageError(false);
    }
  };

  const handleBlur = (field: keyof ProductFormData) => {
    // Validate single field on blur
    const fieldErrors = validateForm(formData);
    if (fieldErrors[field]) {
      setErrors(prev => ({ ...prev, [field]: fieldErrors[field] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const validationErrors = validateForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      let result;
      if (isEditMode && id) {
        result = await updateProduct(id, formData);
      } else {
        result = await createProduct(formData);
      }
      
      if (result.success) {
        navigate('/admin/products');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/products');
  };

  if (isFetchingProduct) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#2D4A3E]" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
      </div>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
        <p className="text-gray-600 mt-1">
          {isEditMode 
            ? 'Update product details and inventory' 
            : 'Add a new product to your catalog'}
        </p>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                ref={nameInputRef}
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                placeholder="e.g., Lion's Mane Grow Kit"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D4A3E] focus:border-transparent"
              />
              {errors.name && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* Price and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price || ''}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    onBlur={() => handleBlur('price')}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D4A3E] focus:border-transparent"
                  />
                </div>
                {errors.price && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.price}</span>
                  </div>
                )}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  onBlur={() => handleBlur('category')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D4A3E] focus:border-transparent"
                >
                  <option value="grow-kits">Grow Kits</option>
                  <option value="liquid-cultures">Liquid Cultures</option>
                  <option value="supplies">Supplies</option>
                </select>
                {errors.category && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.category}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                onBlur={() => handleBlur('description')}
                placeholder="Describe your product, its benefits, and any special features..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D4A3E] focus:border-transparent resize-none"
              />
              {errors.description && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.description}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length}/1000 characters
              </p>
            </div>

            {/* Stock Quantity */}
            <div>
              <StockQuantityInput
                value={formData.stock_quantity}
                onChange={(value) => handleInputChange('stock_quantity', value)}
                disabled={isLoading}
              />
              {errors.stock_quantity && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.stock_quantity}</span>
                </div>
              )}
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center gap-3">
              <input
                id="featured"
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#2D4A3E] focus:ring-[#2D4A3E]"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                Featured Product
                <span className="block text-xs text-gray-500 font-normal">
                  Featured products are displayed prominently on the homepage
                </span>
              </label>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                id="image_url"
                type="text"
                value={formData.image_url}
                onChange={(e) => handleInputChange('image_url', e.target.value)}
                onBlur={() => handleBlur('image_url')}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D4A3E] focus:border-transparent"
              />
              {errors.image_url && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.image_url}</span>
                </div>
              )}
              
              {/* Image Preview */}
              {formData.image_url && !errors.image_url && (
                <div className="mt-3">
                  <p className="text-xs text-gray-600 mb-2">Preview:</p>
                  {!imageError ? (
                    <img
                      src={formData.image_url}
                      alt="Product preview"
                      onError={() => setImageError(true)}
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                    />
                  ) : (
                    <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200">
                      <div className="text-center">
                        <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">Failed to load</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-[#2D4A3E] text-white rounded-lg hover:bg-[#4A6B5A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading 
                ? (isEditMode ? 'Updating...' : 'Creating...') 
                : (isEditMode ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
import { supabase } from '../lib/supabase';
import { useToast } from './useToast';
import { ProductFormData } from '../types';

interface OperationResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: Error | unknown;
}

export function useProducts() {
  const toast = useToast();

  const createProduct = async (formData: ProductFormData): Promise<OperationResult> => {
    try {
      // Trim string inputs and prepare data
      const productData = {
        name: formData.name.trim(),
        price: formData.price,
        category: formData.category,
        description: formData.description.trim() || null,
        stock_quantity: formData.stock_quantity,
        in_stock: formData.stock_quantity > 0, // Auto-set based on stock_quantity
        featured: formData.featured,
        image_url: formData.image_url.trim() || null,
      };

      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (error) throw error;

      toast.success('Product created successfully');
      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create product';
      toast.error(errorMessage);
      return { success: false, error };
    }
  };

  const updateProduct = async (id: string, formData: ProductFormData): Promise<OperationResult> => {
    try {
      // Trim string inputs and prepare data
      const productData = {
        name: formData.name.trim(),
        price: formData.price,
        category: formData.category,
        description: formData.description.trim() || null,
        stock_quantity: formData.stock_quantity,
        in_stock: formData.stock_quantity > 0, // Auto-set based on stock_quantity
        featured: formData.featured,
        image_url: formData.image_url.trim() || null,
        updated_at: new Date().toISOString(),
      };

      console.log('Attempting to update product:', id);
      console.log('Product data:', productData);

      // First, let's check if we can read the product (to verify RLS permissions)
      const { data: existingProduct, error: readError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (readError) {
        console.error('Cannot read product for update:', readError);
        throw new Error(`Permission denied: ${readError.message}`);
      }

      console.log('Successfully read existing product:', existingProduct);

      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      console.log('Product updated successfully:', data);
      toast.success('Product updated successfully');
      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update product';
      console.error('Update product error:', errorMessage);
      toast.error(`Update failed: ${errorMessage}`);
      return { success: false, error };
    }
  };

  const deleteProduct = async (id: string): Promise<OperationResult> => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Product deleted successfully');
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete product';
      toast.error(errorMessage);
      return { success: false, error };
    }
  };

  const getProduct = async (id: string): Promise<OperationResult> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch product';
      toast.error(errorMessage);
      return { success: false, error };
    }
  };

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
  };
}
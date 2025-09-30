import { ProductFormData } from '../types';

export interface FormErrors {
  [key: string]: string | undefined;
}

/**
 * Validates a product name
 * @param name - The product name to validate
 * @returns Error message if invalid, undefined if valid
 */
export function validateName(name: string): string | undefined {
  const trimmed = name.trim();
  
  if (!trimmed) {
    return 'Product name is required';
  }
  
  if (trimmed.length < 3) {
    return 'Product name must be at least 3 characters';
  }
  
  if (trimmed.length > 100) {
    return 'Product name must not exceed 100 characters';
  }
  
  return undefined;
}

/**
 * Validates a product price
 * @param price - The price to validate
 * @returns Error message if invalid, undefined if valid
 */
export function validatePrice(price: number | string): string | undefined {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) {
    return 'Price must be a valid number';
  }
  
  if (numPrice <= 0) {
    return 'Price must be greater than 0';
  }
  
  // Check for more than 2 decimal places
  const decimalPlaces = (numPrice.toString().split('.')[1] || '').length;
  if (decimalPlaces > 2) {
    return 'Price can have at most 2 decimal places';
  }
  
  return undefined;
}

/**
 * Validates a product category
 * @param category - The category to validate
 * @returns Error message if invalid, undefined if valid
 */
export function validateCategory(category: string): string | undefined {
  const validCategories = ['grow-kits', 'liquid-cultures', 'supplies'];
  
  if (!category) {
    return 'Category is required';
  }
  
  if (!validCategories.includes(category)) {
    return 'Invalid category selected';
  }
  
  return undefined;
}

/**
 * Validates a product description
 * @param description - The description to validate
 * @returns Error message if invalid, undefined if valid
 */
export function validateDescription(description: string): string | undefined {
  if (description && description.length > 1000) {
    return 'Description must not exceed 1000 characters';
  }
  
  return undefined;
}

/**
 * Validates stock quantity
 * @param quantity - The stock quantity to validate
 * @returns Error message if invalid, undefined if valid
 */
export function validateStockQuantity(quantity: number | string): string | undefined {
  const numQuantity = typeof quantity === 'string' ? parseFloat(quantity) : quantity;
  
  if (isNaN(numQuantity)) {
    return 'Stock quantity must be a valid number';
  }
  
  if (numQuantity < 0) {
    return 'Stock quantity cannot be negative';
  }
  
  if (!Number.isInteger(numQuantity)) {
    return 'Stock quantity must be a whole number';
  }
  
  return undefined;
}

/**
 * Validates an image URL
 * @param url - The image URL to validate
 * @returns Error message if invalid, undefined if valid
 */
export function validateImageUrl(url: string): string | undefined {
  const trimmed = url.trim();
  
  // Empty is allowed
  if (!trimmed) {
    return undefined;
  }
  
  // Basic URL validation
  try {
    new URL(trimmed);
    return undefined;
  } catch {
    return 'Invalid URL format';
  }
}

/**
 * Validates all form fields
 * @param data - The product form data to validate
 * @returns Object containing error messages for invalid fields
 */
export function validateForm(data: ProductFormData): FormErrors {
  const errors: FormErrors = {};
  
  const nameError = validateName(data.name);
  if (nameError) errors.name = nameError;
  
  const priceError = validatePrice(data.price);
  if (priceError) errors.price = priceError;
  
  const categoryError = validateCategory(data.category);
  if (categoryError) errors.category = categoryError;
  
  const descriptionError = validateDescription(data.description);
  if (descriptionError) errors.description = descriptionError;
  
  const stockError = validateStockQuantity(data.stock_quantity);
  if (stockError) errors.stock_quantity = stockError;
  
  const imageError = validateImageUrl(data.image_url);
  if (imageError) errors.image_url = imageError;
  
  return errors;
}
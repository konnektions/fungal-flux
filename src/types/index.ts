export interface Product {
  id: string;
  name: string;
  price: number;
  image: string; // We'll use this field in our app, but map from image_url from Supabase
  category: 'grow-kits' | 'liquid-cultures' | 'supplies';
  description: string;
  inStock: boolean;
  featured?: boolean;
}

// Represents the structure of a product directly from the database
export interface DBProduct {
  id: string;
  name: string;
  price: string; // Comes as string from DB
  image_url: string | null;
  category: 'grow-kits' | 'liquid-cultures' | 'supplies';
  description: string | null;
  in_stock: boolean;
  stock_quantity: number;
  featured: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type UserRole = 'customer' | 'admin' | 'super_admin';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role?: UserRole;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export interface ProductFormData {
  name: string;
  price: number;
  category: 'grow-kits' | 'liquid-cultures' | 'supplies';
  description: string;
  stock_quantity: number;
  featured: boolean;
  image_url: string;
}

export interface AddressData {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CheckoutFormData {
  shippingAddress: AddressData;
  billingAddress: AddressData;
  useSameAsShipping: boolean;
  orderNotes?: string;
}

export interface CheckoutStep {
  id: number;
  name: string;
  completed: boolean;
  current: boolean;
}
export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  shippingAddress: AddressData;
  billingAddress: AddressData;
  paymentMethod: {
    type: string;
    last4: string;
  };
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
}
import { supabase } from '../lib/supabase';
import { Order, CheckoutFormData, CartItem } from '../types';

export async function createOrder(
  checkoutData: CheckoutFormData,
  cartItems: CartItem[],
  paymentIntentId: string,
  paymentMethodLast4: string
): Promise<{ order: Order | null; error: string | null }> {
  try {
    // Generate order number
    const orderNumber = generateOrderNumber();
    
    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const shippingCost = subtotal >= 50 ? 0 : 5; // Free shipping over $50
    const taxAmount = Math.round(subtotal * 0.08); // 8% tax
    const totalAmount = subtotal + shippingCost + taxAmount;
    
    // Prepare order items
    const items = cartItems.map(item => ({
      product_id: item.product.id,
      product_name: item.product.name,
      product_image: item.product.image,
      unit_price: Math.round(item.product.price * 100), // Convert to cents
      quantity: item.quantity,
      total_price: Math.round(item.product.price * item.quantity * 100)
    }));
    
    // Call the database function
    const { data, error } = await supabase.rpc('create_order', {
      p_order_number: orderNumber,
      p_shipping_address: checkoutData.shippingAddress,
      p_billing_address: checkoutData.billingAddress,
      p_subtotal: Math.round(subtotal * 100),
      p_shipping_cost: Math.round(shippingCost * 100),
      p_tax_amount: taxAmount,
      p_total_amount: Math.round(totalAmount * 100),
      p_stripe_payment_intent_id: paymentIntentId,
      p_payment_method_last4: paymentMethodLast4,
      p_order_notes: checkoutData.orderNotes || null,
      p_items: items
    });
    
    if (error) {
      console.error('Order creation error:', error);
      return { order: null, error: error.message };
    }
    
    // Fetch the created order
    const { data: orderData, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', data)
      .single();
    
    if (fetchError) {
      return { order: null, error: fetchError.message };
    }
    
    return { order: orderData as Order, error: null };
  } catch (error) {
    console.error('Order creation exception:', error);
    return {
      order: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  
  return `FF-${year}${month}${day}-${random}`;
}

export async function getOrderById(orderId: string): Promise<{ order: Order | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', orderId)
      .single();
    
    if (error) {
      return { order: null, error: error.message };
    }
    
    return { order: data as Order, error: null };
  } catch (error) {
    return {
      order: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function getUserOrders(): Promise<{ orders: Order[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      return { orders: [], error: error.message };
    }
    
    return { orders: data as Order[], error: null };
  } catch (error) {
    return {
      orders: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
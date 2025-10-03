import React from 'react';
import { CartItem } from '../../types';
import { AddressData } from '../../types';

interface OrderSummaryProps {
  items: CartItem[];
  totalPrice: number;
  shippingAddress?: AddressData;
  currentStep: number;
}

export default function OrderSummary({ items, totalPrice, shippingAddress, currentStep }: OrderSummaryProps) {
  const subtotal = totalPrice;
  const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  const tax = subtotal * 0.08; // 8% tax rate
  const finalTotal = subtotal + shipping + tax;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm sticky top-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

      {/* Cart Items */}
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">{item.product.name}</h4>
              <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
            </div>
            <div className="text-sm font-semibold text-[#2D4A3E]">
              ${(item.product.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Order Total */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping:</span>
          <span className="font-medium">
            {shipping === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              `$${shipping.toFixed(2)}`
            )}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax:</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>

        <div className="border-t pt-2">
          <div className="flex justify-between text-base font-bold">
            <span>Total:</span>
            <span className="text-[#2D4A3E]">${finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Info (show when available) */}
      {currentStep > 2 && shippingAddress && (
        <div className="mt-6 pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping to:</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p className="font-medium">{shippingAddress.fullName}</p>
            <p>{shippingAddress.addressLine1}</p>
            {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
            <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
            <p>{shippingAddress.country}</p>
          </div>
        </div>
      )}

      {/* Progress indicator for shipping */}
      {subtotal < 50 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 text-xs text-blue-800">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Add ${(50 - subtotal).toFixed(2)} more for free shipping!</span>
          </div>
          <div className="mt-2 bg-blue-200 rounded-full h-1">
            <div
              className="bg-blue-400 h-1 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Security notice */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>Secure checkout with SSL encryption</span>
        </div>
      </div>
    </div>
  );
}
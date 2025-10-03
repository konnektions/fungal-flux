import React from 'react';
import { Order } from '../../types';

interface OrderDetailsSummaryProps {
  order: Order;
}

const OrderDetailsSummary: React.FC<OrderDetailsSummaryProps> = ({ order }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-bold border-b pb-4 mb-4">Order Summary</h3>
      
      {/* Items List */}
      <div className="space-y-4">
        {order.items.map((item) => (
          <div key={item.productId} className="flex items-center justify-between">
            <div className="flex items-center">
              <img src={item.image} alt={item.name} className="h-16 w-16 rounded-md object-cover mr-4" />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              </div>
            </div>
            <p className="font-semibold">${item.total.toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="border-t mt-6 pt-6 space-y-2">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>${order.subtotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p>Shipping</p>
          <p>${order.shipping.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p>Tax</p>
          <p>${order.tax.toFixed(2)}</p>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <p>Total</p>
          <p>${order.total.toFixed(2)}</p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="border-t mt-6 pt-6">
        <h4 className="font-bold mb-2">Payment Method</h4>
        <p>
          {order.paymentMethod.type.charAt(0).toUpperCase() + order.paymentMethod.type.slice(1)} ending in {order.paymentMethod.last4}
        </p>
      </div>

    </div>
  );
};

export default OrderDetailsSummary;
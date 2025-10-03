import React from 'react';
import { Order } from '../../types';

interface DeliveryInformationProps {
  order: Order;
}

const DeliveryInformation: React.FC<DeliveryInformationProps> = ({ order }) => {
  const { shippingAddress, estimatedDelivery, trackingNumber } = order;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-bold border-b pb-4 mb-4">Delivery Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div>
          <h4 className="font-bold mb-2">Shipping to:</h4>
          <address className="not-italic">
            <p className="font-semibold">{shippingAddress.fullName}</p>
            <p>{shippingAddress.addressLine1}</p>
            {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
            <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
            <p>{shippingAddress.country}</p>
          </address>
        </div>

        {/* Delivery Details */}
        <div>
          <h4 className="font-bold mb-2">Delivery Details:</h4>
          <p>
            <span className="font-semibold">Estimated Delivery:</span> {estimatedDelivery || '5-7 business days'}
          </p>
          <p>
            <span className="font-semibold">Tracking Number:</span> {trackingNumber || 'Not yet available'}
          </p>
           <p>
            <span className="font-semibold">Shipping Method:</span> Standard Shipping
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInformation;
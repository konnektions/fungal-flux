import { CheckCircle } from 'lucide-react';
import React from 'react';

interface OrderConfirmationSuccessProps {
  orderNumber: string;
  email: string;
}

const OrderConfirmationSuccess: React.FC<OrderConfirmationSuccessProps> = ({ orderNumber, email }) => {
  return (
    <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md shadow-md">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircle className="h-10 w-10 text-green-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-bold text-green-800">Thank you for your order!</h3>
          <div className="mt-2 text-md text-green-700">
            <p>
              Your order <span className="font-bold">#{orderNumber}</span> has been placed successfully.
            </p>
            <p className="mt-2">
              A confirmation email has been sent to <span className="font-bold">{email}</span>.
              Please check your spam folder if you don't see it.
            </p>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              If you have any questions, please{' '}
              <a href="/contact" className="font-medium text-green-700 hover:text-green-600">
                contact our support team
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationSuccess;
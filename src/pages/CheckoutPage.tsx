import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CheckoutFormData, AddressData } from '../types';
import { createOrder } from '../services/orderService';
import ShippingAddressForm from '../components/checkout/ShippingAddressForm';
import BillingAddressForm from '../components/checkout/BillingAddressForm';
import OrderSummary from '../components/checkout/OrderSummary';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../lib/stripe';
import PaymentForm from '../components/checkout/PaymentForm';
import PaymentMethodSelector from '../components/checkout/PaymentMethodSelector';

const CHECKOUT_STEPS = [
  { id: 1, name: 'Cart' },
  { id: 2, name: 'Shipping' },
  { id: 3, name: 'Billing' },
  { id: 4, name: 'Payment' },
  { id: 5, name: 'Review' }
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(2);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Calculate full order total including tax and shipping
  const calculateOrderTotal = () => {
    const subtotal = getTotalPrice();
    const shippingCost = subtotal >= 50 ? 0 : 0;
    const taxAmount = subtotal * 0.08; // 8% tax
    return subtotal + shippingCost + taxAmount;
  };
  const [formData, setFormData] = useState<CheckoutFormData>({
    shippingAddress: {
      fullName: '',
      email: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US'
    },
    billingAddress: {
      fullName: '',
      email: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US'
    },
    useSameAsShipping: true,
    orderNotes: ''
  });

  // Load saved form data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('checkoutFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      } catch (error) {
        console.error('Error loading checkout form data:', error);
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('checkoutFormData', JSON.stringify(formData));
  }, [formData]);

  // Redirect to cart if no items
  useEffect(() => {
    if (items.length === 0) {
      navigate('/shop');
    }
  }, [items, navigate]);

  const handleShippingSubmit = (shippingData: AddressData) => {
    setFormData(prev => ({
      ...prev,
      shippingAddress: shippingData,
      billingAddress: prev.useSameAsShipping ? shippingData : prev.billingAddress
    }));
    setCurrentStep(3); // Move to billing step
  };

  const handleBillingSubmit = (billingData: AddressData) => {
    setFormData(prev => ({
      ...prev,
      billingAddress: billingData
    }));
    setCurrentStep(4); // Move to payment step
  };

  const handleOrderSubmission = async (paymentIntentId: string, paymentMethodLast4: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      const { order, error } = await createOrder(
        formData,
        items,
        paymentIntentId,
        paymentMethodLast4
      );

      if (error) {
        setError(error);
        return;
      }

      if (order) {
        localStorage.removeItem('checkoutFormData');
        clearCart();
        navigate(`/order-confirmation/${order.id}`, {
          state: { order }
        });
      }
    } catch (err) {
      console.error('Order submission error:', err);
      setError('Failed to create order. Please contact support.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToCart = () => {
    navigate('/shop');
  };

  const handleBackStep = () => {
    if (currentStep > 2) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepStatus = (stepId: number): 'completed' | 'current' | 'pending' => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">Add some items to your cart before checking out.</p>
          <button
            onClick={handleBackToCart}
            className="bg-[#2D4A3E] hover:bg-[#4A6B5A] text-white px-6 py-2 rounded-lg transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToCart}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Cart
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <img
                  src="/greenLogo.png"
                  alt="Fungal Flux"
                  className="w-8 h-8 object-contain"
                />
                <span className="font-['Lato'] text-xl font-bold text-[#2D4A3E]">
                  Fungal Flux
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Step {currentStep} of {CHECKOUT_STEPS.length}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {CHECKOUT_STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      getStepStatus(step.id) === 'completed'
                        ? 'bg-[#2D4A3E] text-white'
                        : getStepStatus(step.id) === 'current'
                        ? 'bg-[#2D4A3E] text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {getStepStatus(step.id) === 'completed' ? '✓' : step.id}
                  </div>
                  <span
                    className={`mt-2 text-xs text-center ${
                      getStepStatus(step.id) === 'current'
                        ? 'text-[#2D4A3E] font-semibold'
                        : 'text-gray-600'
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < CHECKOUT_STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-px mx-4 ${
                      getStepStatus(step.id + 1) === 'completed' ? 'bg-[#2D4A3E]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Forms Section */}
          <div className="lg:col-span-2 space-y-8">
            {currentStep === 2 && (
              <ShippingAddressForm
                initialData={formData.shippingAddress}
                onSubmit={handleShippingSubmit}
                onCancel={handleBackToCart}
              />
            )}

            {currentStep === 3 && (
              <BillingAddressForm
                shippingAddress={formData.shippingAddress}
                initialData={formData.billingAddress}
                useSameAsShipping={formData.useSameAsShipping}
                onSubmit={handleBillingSubmit}
                onBack={handleBackStep}
                onToggleSameAsShipping={(useSame: boolean) => {
                  setFormData(prev => ({
                    ...prev,
                    useSameAsShipping: useSame,
                    billingAddress: useSame ? prev.shippingAddress : prev.billingAddress
                  }));
                }}
              />
            )}

            {currentStep === 4 && (
              <Elements stripe={stripePromise}>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Information</h2>
                  <div className="space-y-6">
                    <PaymentMethodSelector />
                    <PaymentForm
                      onSuccessfulPayment={handleOrderSubmission}
                      totalAmount={calculateOrderTotal()}
                    />
                  </div>
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={handleBackStep}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors"
                    >
                      Back to Billing
                    </button>
                  </div>
                </div>
              </Elements>
            )}

            {currentStep === 5 && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                {error && <div className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</div>}
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Review Order</h2>
                <p className="text-gray-600 mb-6">
                  Please review your order details before submission.
                </p>
                <div className="space-y-4">
                  <button
                    className="w-full bg-[#2D4A3E] hover:bg-[#4A6B5A] text-white py-3 rounded-lg font-semibold transition-colors"
                    onClick={() => handleOrderSubmission('test_intent_id', '1234')}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Placing Order...' : 'Place Order (TEST)'}
                  </button>
                  <button
                    onClick={handleBackStep}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Back to Payment
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              items={items}
              totalPrice={getTotalPrice()}
              shippingAddress={formData.shippingAddress}
              currentStep={currentStep}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
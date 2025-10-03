import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#1f2937',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '16px',
      '::placeholder': {
        color: '#9ca3af',
      },
    },
    invalid: {
      color: '#dc2626',
      iconColor: '#dc2626',
    },
  },
};

interface PaymentFormProps {
  onSuccessfulPayment: (paymentIntentId: string, paymentMethodLast4: string) => void;
  totalAmount: number; // Amount in dollars
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSuccessfulPayment, totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');

  // Create payment intent when component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const amountInCents = Math.round(totalAmount * 100);
        
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amountInCents,
            currency: 'usd',
            metadata: {
              total_amount_dollars: totalAmount.toFixed(2)
            }
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create payment intent');
        }

        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error('Payment intent creation error:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize payment');
      }
    };

    if (totalAmount > 0) {
      createPaymentIntent();
    }
  }, [totalAmount]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    if (!clientSecret) {
      setError('Payment not initialized. Please refresh and try again.');
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setLoading(false);
      return;
    }

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'An unexpected error occurred.');
        setSucceeded(false);
      } else if (paymentIntent?.status === 'succeeded') {
        setError(null);
        setSucceeded(true);
        
        // Extract last 4 digits of card
        const last4 = paymentIntent.payment_method &&
          typeof paymentIntent.payment_method === 'object' &&
          'card' in paymentIntent.payment_method
          ? paymentIntent.payment_method.card?.last4 || '****'
          : '****';
        
        onSuccessfulPayment(paymentIntent.id, last4);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-md">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
      <button
        type="submit"
        disabled={!stripe || loading || succeeded}
        className="w-full px-4 py-2 text-white bg-brand-green-dark rounded-md hover:bg-brand-green-darker disabled:bg-gray-400"
      >
        {loading ? 'Processing...' : 'Pay'}
      </button>
      {error && <div className="text-red-600">{error}</div>}
      {succeeded && <div className="text-green-600">Payment successful!</div>}
    </form>
  );
};

export default PaymentForm;
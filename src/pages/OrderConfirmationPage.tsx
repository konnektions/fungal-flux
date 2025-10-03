import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Order } from '../types';
import OrderConfirmationSuccess from '../components/checkout/OrderConfirmationSuccess';
import OrderDetailsSummary from '../components/checkout/OrderDetailsSummary';
import DeliveryInformation from '../components/checkout/DeliveryInformation';
import { generateOrderNumber } from '../lib/utils';
import { useCart } from '../context/CartContext';


const OrderConfirmationPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const [order, setOrder] = useState<Order | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // In a real app, you'd fetch this from a backend using the orderId
        if (location.state?.order) {
            const orderData = location.state.order as Order;
            setOrder(orderData);
            clearCart(); // Clear cart now that order is confirmed
        } else {
            // For testing purposes, create mock data if none is passed
            console.warn("No order data found in location state. Using mock data for testing.");
            
            const mockOrder: Order = {
                id: crypto.randomUUID(),
                orderNumber: generateOrderNumber(),
                createdAt: new Date().toISOString(),
                status: 'processing',
                items: [ /* Mock items here */ ],
                shippingAddress: { /* Mock address */ fullName: "John Doe", email: "johndoe@example.com", phone: "1234567890", addressLine1: "123 Main St", city: "Anytown", state: "CA", postalCode: "12345", country: "USA" },
                billingAddress: { /* Mock address */ fullName: "John Doe", email: "johndoe@example.com", phone: "1234567890", addressLine1: "123 Main St", city: "Anytown", state: "CA", postalCode: "12345", country: "USA" },
                paymentMethod: {
                  type: 'card',
                  last4: '4242'
                },
                subtotal: 100,
                shipping: 10,
                tax: 8,
                total: 118,
                estimatedDelivery: '5-7 business days',
              };
            setOrder(mockOrder);
            // In a real scenario without an order, you'd likely redirect
            setError("No order details found. Please return to the shop.");
            navigate('/shop');
        }
    }, [location.state, clearCart, navigate]);

    if(error){
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                <p>{error}</p>
                <Link to="/shop" className="mt-6 inline-block bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primary-dark">
                    Continue Shopping
                </Link>
            </div>
        );
    }
    
    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p>Loading order details...</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <OrderConfirmationSuccess orderNumber={order.orderNumber} email={order.shippingAddress.email} />

                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="lg:col-span-1">
                            <OrderDetailsSummary order={order} />
                        </div>
                        <div className="lg:col-span-1">
                            <DeliveryInformation order={order} />
                        </div>
                    </div>
                    
                    <div className="mt-12 text-center flex justify-center gap-4">
                        <Link
                            to="/shop"
                            className="bg-primary text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-primary-dark transition-transform transform hover:scale-105"
                        >
                            Continue Shopping
                        </Link>
                        <button
                            onClick={() => window.print()}
                            className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-300 transition-transform transform hover:scale-105"
                        >
                            Print Receipt
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OrderConfirmationPage;
import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { paymentService } from '../services/paymentService'; // New Service
import { API_URLS } from '../services/apiConfig';
import { ShoppingCart } from 'lucide-react';

// Razorpay Type Definition (Optional but good for TS)
declare global {
    interface Window {
        Razorpay: any;
    }
}

export const B2BPage: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [cart, setCart] = useState<{ [key: string]: number }>({});
    const [partialPercentage, setPartialPercentage] = useState(50);
    const [step, setStep] = useState<'selection' | 'checkout' | 'success'>('selection');
    const [orderId, setOrderId] = useState<number | null>(null);
    const [gstNumber, setGstNumber] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadData();
        // Load Razorpay Script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const loadData = async () => {
        const prods = await productService.getProducts(); // Fixed method name
        setProducts(prods);

        try {
            const token = localStorage.getItem('accessToken');
            if (token) {
                const res = await fetch(`${API_URLS.ADMIN}/dashboard/config/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const config = await res.json();
                if (config.b2b_partial_payment_percentage) {
                    setPartialPercentage(config.b2b_partial_payment_percentage);
                }
            }
        } catch (e) {
            console.error("Failed to load B2B config", e);
        }
    };

    const updateQuantity = (id: number, delta: number) => {
        setCart(prev => {
            const current = prev[id] || 0;
            const next = Math.max(0, current + delta);
            const newCart = { ...prev, [id]: next };
            if (next === 0) delete newCart[id];
            return newCart;
        });
    };

    const totalAmount = products.reduce((sum: number, p: any) => sum + (p.price * (cart[p.id] || 0)), 0);
    const dueNow = (totalAmount * partialPercentage) / 100;
    const itemCount = Object.values(cart).reduce((a: number, b: number) => a + b, 0);

    const handlePayment = async () => {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError("Please login first");
            setLoading(false);
            return;
        }

        try {
            // 1. Create Order in Backend (Pending State)
            const orderRes = await fetch(`${API_URLS.ORDER}/create-order/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    items: Object.entries(cart).map(([id, qty]) => ({ id: parseInt(id), quantity: qty })),
                    shippingAddress: address,
                    isB2B: true,
                    gstNumber: gstNumber,
                    partialPercentage: partialPercentage
                })
            });

            const orderData = await orderRes.json();
            if (!orderRes.ok) throw new Error(orderData.error || 'Failed to create order');

            // 2. Initiate Razorpay Payment
            const payRes = await paymentService.initiatePayment(orderData.payableAmount, token);

            // 3. Open Razorpay Modal
            const options = {
                key: payRes.key_id,
                amount: payRes.amount,
                currency: payRes.currency,
                name: "Lignum & Lux",
                description: `Order #${orderData.orderId} Payment`,
                order_id: payRes.order_id,
                handler: async function (response: any) {
                    try {
                        // 4. Verify Payment
                        await paymentService.verifyPayment(response, token);

                        // 5. Confirm Order
                        await fetch(`${API_URLS.ORDER}/confirm-payment/`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                            body: JSON.stringify({
                                orderId: orderData.orderId,
                                paymentId: response.razorpay_payment_id
                            })
                        });

                        setOrderId(orderData.orderId);
                        setStep('success');
                    } catch (e: any) {
                        setError('Payment Verification Failed: ' + e.message);
                    }
                },
                prefill: {
                    name: "Client",
                    email: "client@example.com",
                    contact: "9999999999"
                },
                theme: { color: "#D4AF37" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pt-24 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-serif text-gold-500">B2B Wholesale Portal</h1>
                        <p className="text-gray-400 mt-2">Bulk ordering with partial upfront payment.</p>
                    </div>
                    {step === 'selection' && (
                        <div className="bg-gray-800 px-6 py-3 rounded-lg flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-sm text-gray-400">Total Value</div>
                                <div className="text-xl font-bold text-white">₹{totalAmount.toFixed(2)}</div>
                            </div>
                            <button
                                onClick={() => setStep('checkout')}
                                disabled={itemCount === 0}
                                className="bg-gold-500 text-black px-6 py-2 font-bold rounded hover:bg-gold-400 disabled:opacity-50"
                            >
                                Proceed ({itemCount} items)
                            </button>
                        </div>
                    )}
                </div>

                {step === 'selection' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(product => (
                            <div key={product.id} className="bg-white/5 border border-white/10 rounded-lg p-4 flex gap-4">
                                <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded bg-gray-700" />
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">{product.name}</h3>
                                    <p className="text-gold-400">₹{product.price}</p>
                                    <div className="flex items-center gap-3 mt-4">
                                        <button
                                            onClick={() => updateQuantity(product.id, -1)}
                                            className="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
                                        >-</button>
                                        <span className="font-mono w-8 text-center">{cart[product.id] || 0}</span>
                                        <button
                                            onClick={() => updateQuantity(product.id, 1)}
                                            className="w-8 h-8 rounded bg-gold-500 text-black hover:bg-gold-400 flex items-center justify-center font-bold"
                                        >+</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {step === 'checkout' && (
                    <div className="max-w-2xl mx-auto bg-white/5 border border-white/10 p-8 rounded-lg">
                        <h2 className="text-2xl font-serif mb-6">Confirm Order Details</h2>

                        <div className="space-y-4 mb-6">
                            <div className="bg-gray-800 p-4 rounded mb-4">
                                <h3 className="text-white font-bold mb-2">Payment Breakdown (B2B)</h3>
                                <div className="flex justify-between text-gray-300">
                                    <span>Total Value:</span>
                                    <span>₹{totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gold-400 font-bold border-t border-gray-700 pt-2 mt-2">
                                    <span>Due Now ({partialPercentage}%):</span>
                                    <span>₹{dueNow.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400 text-sm mt-1">
                                    <span>Balance Due:</span>
                                    <span>₹{(totalAmount - dueNow).toFixed(2)}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-1">GST Number (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/20 border border-white/10 p-3 text-white rounded"
                                    value={gstNumber}
                                    onChange={e => setGstNumber(e.target.value)}
                                    placeholder="Enter GSTIN"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Shipping Address</label>
                                <textarea
                                    className="w-full bg-black/20 border border-white/10 p-3 text-white rounded"
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

                        <div className="flex gap-4">
                            <button onClick={() => setStep('selection')} className="flex-1 py-3 bg-gray-700 rounded hover:bg-gray-600">Back</button>
                            <button
                                onClick={handlePayment}
                                disabled={loading || !address}
                                className="flex-1 bg-gold-500 text-black font-bold py-3 rounded hover:bg-gold-400 disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : 'Pay via Razorpay'}
                            </button>
                        </div>
                    </div>
                )}

                {step === 'success' && (
                    <div className="max-w-md mx-auto text-center py-20">
                        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingCart size={40} />
                        </div>
                        <h2 className="text-3xl font-serif mb-4">Order Placed Successfully!</h2>
                        <p className="text-gray-400 mb-8">Your Order ID is #{orderId}. An invoice has been sent to your email.</p>
                        <button onClick={() => { setCart({}); setStep('selection'); }} className="bg-gold-500 text-black px-8 py-3 font-bold rounded">
                            Place Another Order
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

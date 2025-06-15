"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Lock, Package2, Gift } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { PayPalCreateOrderData, PayPalCaptureResult } from '@/types/paypal'


type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  collection?: string;
};

export default function CheckoutPage() {  const [cart, setCart] = useState<CartItem[]>([]);
  const [giftPackaging, setGiftPackaging] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  
  // Validation State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  // Load PayPal SDK
  useEffect(() => {
    if (cart.length > 0 && !paypalLoaded) {
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
      
      if (!clientId || clientId === 'your_paypal_client_id_here') {
        setErrors({ 
          general: "PayPal is not configured. Please contact support." 
        });
        return;
      }

      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&components=buttons,funding-eligibility`;
      script.async = true;
      script.onload = () => setPaypalLoaded(true);
      script.onerror = () => {
        setErrors({ 
          general: "PayPal could not be loaded. Please check your connection." 
        });
      };
      document.body.appendChild(script);
    }
  }, [cart, paypalLoaded]);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 15.00; // Standard shipping
  const giftPackagingFee = giftPackaging ? 5.00 : 0;
  const total = subtotal + shippingFee + giftPackagingFee;
  // Validate minimal form
  const validate = useCallback((requireEmail = true) => {
    const newErrors: { [key: string]: string } = {};
    
    if (requireEmail && (!customerEmail || !/\S+@\S+\.\S+/.test(customerEmail))) {
      newErrors.email = "Please enter a valid email address.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [customerEmail]);
  const handlePayPalSuccess = useCallback(async (paymentDetails: PayPalCaptureResult) => {
    setLoading(true);
    
    try {
      // Extract shipping information from PayPal response
      const shippingInfo = paymentDetails.purchase_units[0]?.shipping;
      const payerInfo = paymentDetails.payer;
      
      // Enhanced order data with PayPal shipping information
      const orderItems = cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        collection: item.collection,
        sku: `SKU-${item.id}`,
        category: 'jewelry'
      }));

      const orderData = {
        // Customer info from PayPal
        customerInfo: {
          email: payerInfo.email_address || customerEmail,
          firstName: payerInfo.name.given_name || '',
          lastName: payerInfo.name.surname || '',
          // Shipping address from PayPal
          address: shippingInfo?.address.address_line_1 || '',
          city: shippingInfo?.address.admin_area_2 || '',
          state: shippingInfo?.address.admin_area_1 || '',
          zipCode: shippingInfo?.address.postal_code || '',
          phone: '', // PayPal doesn't always provide phone
        },
        orderItems,
        giftPackaging,
        giftNote: giftNote.trim() || undefined,
        shippingPrice: shippingFee,
        giftPackagingFee,
        totalPrice: total,
        paymentMethod: 'paypal',
        paymentDetails: {
          paypalOrderId: paymentDetails.id,
          paypalPayerId: paymentDetails.payer?.email_address,
          paypalPaymentId: paymentDetails.purchase_units[0]?.payments?.captures[0]?.id
        }
      };

      // Submit to enhanced order API
      const res = await fetch('/api/orders/enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      setLoading(false);
      
      if (res.ok) {
        const result = await res.json();
        setSuccess(`✅ Payment successful! Your order #${result.data.orderNumber} has been placed. You will receive a confirmation email shortly. Thank you for shopping with ZEVANY!`);
        setErrors({});
        localStorage.removeItem('cart');
        
        // Redirect after 5 seconds
        setTimeout(() => { 
          window.location.href = '/?order=success'; 
        }, 5000);
      } else {
        const errorData = await res.json();
        setErrors({ general: errorData.message || "Order failed! Please contact support." });
      }
    } catch (error) {
      setLoading(false);      console.error('Order processing error:', error);
      setErrors({ general: "Order failed! Please check your connection and try again." });
    }
  }, [cart, customerEmail, giftPackaging, giftNote, shippingFee, giftPackagingFee, total]);

  // Initialize PayPal buttons
  useEffect(() => {
    if (paypalLoaded && window.paypal && total > 0) {
      const container = document.getElementById('paypal-button-container');
      if (container) {
        container.innerHTML = '';
      }

      window.paypal.Buttons({        createOrder: (data: unknown, actions: {
          order: {
            create: (orderData: PayPalCreateOrderData) => Promise<string>;
          };
        }) => {
          // For PayPal orders, we don't require email validation since PayPal collects it
          // Only validate if email is provided
          if (customerEmail && !validate(false)) {
            throw new Error('Please correct the form errors');
          }
          
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: total.toFixed(2),
                currency_code: 'USD'
              },
              description: `ZEVANY Jewelry Order - ${cart.length} item${cart.length > 1 ? 's' : ''}`,
              invoice_id: `ZEVANY-${Date.now()}`,
              custom_id: JSON.stringify({ 
                items: cart.length,
                gift: giftPackaging,
                email: customerEmail
              })
            }],
            application_context: {
              brand_name: 'ZEVANY Jewelry',
              locale: 'en-US',
              landing_page: 'NO_PREFERENCE',
              user_action: 'PAY_NOW',
              shipping_preference: 'GET_FROM_FILE' // Let PayPal collect shipping
            }
          });
        },
        onApprove: async (data: { orderID: string }, actions: {
          order: {
            capture: () => Promise<PayPalCaptureResult>;
          };
        }) => {
          try {
            setLoading(true);
            const details = await actions.order.capture();
            await handlePayPalSuccess(details);
          } catch (error) {
            console.error('PayPal approval error:', error);
            setLoading(false);
            setErrors({ general: "Payment processing failed. Please try again." });
          }
        },
        onCancel: () => {
          setErrors({ general: "Payment was cancelled. You can try again when ready." });
        },
        onError: (err: unknown) => {
          console.error('PayPal error:', err);
          setErrors({ general: "Payment system error. Please try again or contact support." });
        },
        style: {
          layout: 'vertical',
          color: 'black',
          shape: 'rect',
          label: 'paypal',
          height: 50,
          tagline: false,
          disableMaxWidth: true
        },
        funding: {
          allowed: [window.paypal.FUNDING.PAYPAL, window.paypal.FUNDING.CARD, window.paypal.FUNDING.PAYLATER],
          disallowed: []
        }
      }).render('#paypal-button-container').catch((err: unknown) => {
        console.error('PayPal render error:', err);
        setErrors({ general: "Payment system initialization failed. Please refresh the page." });
      });
    }
  }, [paypalLoaded, total, cart, customerEmail, giftPackaging, handlePayPalSuccess, validate]);

  // Auto-scroll to errors or success
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstErrorKey = Object.keys(errors)[0];
      const el = document.querySelector(`[name="${firstErrorKey}"]`);
      if (el && 'scrollIntoView' in el) {
        (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
        (el as HTMLElement).focus();
      }
    }
  }, [errors, success]);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen" style={{ background: '#f5f3ea' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 font-serif">Your cart is empty</h1>
            <p className="text-gray-600 mb-8 font-serif">Add some items to your cart before checking out</p>
            <Link 
              href="/collections" 
              className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-serif"            >
              Browse Collections
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen" style={{ background: '#f5f3ea' }}>
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-900 font-serif">Processing your order...</p>
          </div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 font-serif">Secure Checkout</h1>
          <p className="text-xl text-gray-600 font-serif">Complete your luxury jewelry purchase</p>
        </div>

        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center" role="alert">
            {errors.general}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 text-center" role="alert">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Simplified Customer Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Lock className="h-5 w-5 text-gray-600 mr-2" />
                <h2 className="text-lg font-medium text-gray-900 font-serif">Contact Information</h2>
              </div>
              
              <div className="space-y-4">                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-serif">Email Address (Optional for PayPal)</label>
                  <input
                    name="email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className={`w-full border ${errors.email ? 'border-red-400' : 'border-gray-300'} rounded-md px-3 py-2 text-sm font-serif focus:outline-none focus:ring-2 focus:ring-gray-900 text-black`}
                    placeholder="your@email.com (PayPal will collect this)"
                  />                  {errors.email && <p className="text-red-500 text-xs mt-1 font-serif">{errors.email}</p>}
                  <p className="text-gray-500 text-xs mt-1 font-serif">Optional - PayPal will collect your email during payment</p>
                </div>
              </div>
            </div>

            {/* Shipping Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2 font-serif">📦 Shipping Information</h3>
              <p className="text-blue-700 text-sm font-serif">
                PayPal will securely collect your shipping address during payment. 
                No need to enter it twice!
              </p>
            </div>

            {/* Gift Options */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Gift className="h-5 w-5 text-gray-600 mr-2" />
                <h2 className="text-lg font-medium text-gray-900 font-serif">Gift Options</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="giftPackaging"
                    checked={giftPackaging}
                    onChange={(e) => setGiftPackaging(e.target.checked)}
                    className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                  />
                  <label htmlFor="giftPackaging" className="ml-2 text-sm text-gray-700 font-serif">
                    Add luxury gift packaging (+$5.00)
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-serif">Gift Note (Optional)</label>
                  <textarea
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-serif focus:outline-none focus:ring-2 focus:ring-gray-900 text-black"
                    rows={3}
                    placeholder="Add a personal message..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-8">
            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Package2 className="h-5 w-5 text-gray-600 mr-2" />
                <h2 className="text-lg font-medium text-gray-900 font-serif">Your Order</h2>
              </div>
              
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center space-x-4 py-3 border-b border-gray-200 last:border-b-0">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 font-serif">{item.name}</h3>
                      <div className="text-sm text-gray-500 font-serif">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.size && item.color && <span> • </span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                      <div className="text-sm text-gray-500 font-serif">Qty: {item.quantity}</div>
                    </div>
                    <div className="text-sm font-medium text-gray-900 font-serif">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Total */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600 font-serif">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 font-serif">
                    <span>Shipping</span>
                    <span>${shippingFee.toFixed(2)}</span>
                  </div>
                  {giftPackaging && (
                    <div className="flex justify-between text-sm text-gray-600 font-serif">
                      <span>Gift Packaging</span>
                      <span>${giftPackagingFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-medium text-gray-900 pt-2 border-t border-gray-200 font-serif">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 font-serif">Secure Payment</h3>
              
              {/* PayPal Payment Button */}
              <div className="mb-4">
                <div id="paypal-button-container" className="w-full"></div>
              </div>
              
              <div className="text-center">
                <p className="text-xs text-gray-500 font-serif">
                  🔒 Secure checkout powered by PayPal<br/>
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>
          </div>        </div>
      </div>
    </div>
  );
}

'use client';

import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import type { MenuItem, CartItem } from "@shared/schema";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ sessionId, total, clientSecret, onSuccess }: { sessionId: string, total: number, clientSecret: string, onSuccess: (customerInfo: any, paymentIntentId?: string) => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    orderType: "delivery" as "delivery" | "pickup"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/order-success",
        receipt_email: customerInfo.email,
      },
    });

    if (result.error) {
      toast({
        title: "Payment Failed",
        description: result.error.message,
        variant: "destructive",
      });
    } else {
      // Payment successful, create order
      // Get payment intent ID from the client secret (if available)
      const paymentIntentId = clientSecret ? clientSecret.split('_secret_')[0] : undefined;
      onSuccess(customerInfo, paymentIntentId);
    }

    setIsProcessing(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-card border border-border rounded-xl p-8">
        <h2 className="text-2xl font-bold text-primary mb-6">Complete Your Order</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Customer Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone <span className="text-destructive">*</span>
                </label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Order Type</label>
                <select
                  value={customerInfo.orderType}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, orderType: e.target.value as "delivery" | "pickup" }))}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="delivery">Delivery</option>
                  <option value="pickup">Pickup</option>
                </select>
              </div>
            </div>
            
            {customerInfo.orderType === "delivery" && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Delivery Address <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                  required={customerInfo.orderType === "delivery"}
                  rows={3}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Enter your complete delivery address"
                />
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">Order Total</h3>
            <div className="text-2xl font-bold text-primary">${total.toFixed(2)}</div>
          </div>

          {/* Payment Element */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Payment Information</h3>
            <div className="p-4 bg-background border border-border rounded-lg">
              <PaymentElement />
            </div>
            <div className="text-sm text-muted-foreground">
              <h4 className="font-semibold mb-2">We Accept:</h4>
              <div className="flex items-center space-x-4">
                <i className="fab fa-cc-visa text-2xl text-blue-600"></i>
                <i className="fab fa-cc-mastercard text-2xl text-red-600"></i>
                <i className="fab fa-cc-amex text-2xl text-blue-500"></i>
                <i className="fab fa-cc-discover text-2xl text-orange-500"></i>
                <i className="fab fa-apple-pay text-2xl"></i>
                <i className="fab fa-google-pay text-2xl"></i>
              </div>
              <p className="mt-2 text-xs">Secure payment processing powered by Stripe</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                Processing Payment...
              </>
            ) : (
              <>
                <i className="fa-solid fa-credit-card mr-2"></i>
                Complete Order - ${total.toFixed(2)}
              </>
            )}
          </button>
          
          <div className="text-xs text-muted-foreground text-center">
            <i className="fa-solid fa-shield-halved mr-1"></i>
            Your payment information is secure and encrypted
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [clientSecret, setClientSecret] = useState("");
  const [sessionId] = useState(() => {
    // Get sessionId from URL params or local storage
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('sessionId') || localStorage.getItem('checkoutSessionId') || '';
  });

  const { data: cartItems = [], isLoading: cartLoading } = useQuery<(CartItem & { menuItem: MenuItem })[]>({
    queryKey: ["/api/cart", sessionId],
    enabled: !!sessionId
  });

  const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.menuItem.price) * item.quantity, 0);
  const tax = subtotal * 0.08;
  const deliveryFee = 2.99;
  const total = subtotal + tax + deliveryFee;

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: async () => {
      // Clear the cart after successful order
      await apiRequest("DELETE", `/api/cart/session/${sessionId}`);
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      localStorage.removeItem('checkoutSessionId');
      
      toast({
        title: "Order Placed Successfully!",
        description: "Thank you for your order. You will receive a confirmation email shortly.",
      });
      
      setLocation("/order-success");
    },
    onError: () => {
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!sessionId || cartItems.length === 0) {
      return;
    }

    // Create PaymentIntent when component loads
    apiRequest("POST", "/api/create-payment-intent", { amount: total })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch(() => {
        toast({
          title: "Payment Setup Failed",
          description: "Unable to setup payment. Please try again.",
          variant: "destructive",
        });
      });
  }, [total, sessionId, cartItems.length]);

  const handleOrderSuccess = (customerInfo: any, paymentIntentId?: string) => {
    // Create the order in the database with actual customer info
    const orderData = {
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      items: JSON.stringify(cartItems.map(item => ({
        menuItemId: item.menuItemId,
        name: item.menuItem.name,
        quantity: item.quantity,
        price: item.menuItem.price
      }))),
      total: total.toString(),
      status: "confirmed",
      paymentIntentId: paymentIntentId || "",
      createdAt: new Date().toISOString(),
    };

    createOrderMutation.mutate(orderData);
  };

  if (!sessionId) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-card border border-border rounded-xl p-8">
          <i className="fa-solid fa-exclamation-triangle text-4xl text-destructive mb-4"></i>
          <h2 className="text-2xl font-bold text-foreground mb-2">No Active Session</h2>
          <p className="text-muted-foreground mb-6">Please add items to your cart before proceeding to checkout.</p>
          <button
            onClick={() => setLocation("/online-order")}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <i className="fa-solid fa-shopping-cart mr-2"></i>
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  if (cartLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <div className="text-lg text-muted-foreground">Loading your order...</div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-card border border-border rounded-xl p-8">
          <i className="fa-solid fa-shopping-cart text-4xl text-muted-foreground mb-4 opacity-50"></i>
          <h2 className="text-2xl font-bold text-foreground mb-2">Your Cart is Empty</h2>
          <p className="text-muted-foreground mb-6">Add some delicious items to your cart before checkout.</p>
          <button
            onClick={() => setLocation("/online-order")}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <i className="fa-solid fa-utensils mr-2"></i>
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <div className="text-lg text-muted-foreground">Setting up payment...</div>
        </div>
      </div>
    );
  }

  // Make SURE to wrap the form in <Elements> which provides the stripe context.
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Checkout</h1>
        <p className="text-muted-foreground">Complete your order from International Kabab House</p>
      </div>
      
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm sessionId={sessionId} total={total} clientSecret={clientSecret} onSuccess={handleOrderSuccess} />
      </Elements>
    </div>
  );
}
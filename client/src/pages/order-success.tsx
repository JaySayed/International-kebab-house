'use client';

import { useLocation } from "wouter";
import logoImage from '@assets/IMG_0247_1753076429818.jpeg';

export default function OrderSuccess() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-card border border-border rounded-xl p-8">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/20 rounded-full mx-auto mb-6 flex items-center justify-center">
            <i className="fa-solid fa-check text-3xl text-emerald-600"></i>
          </div>

          {/* Restaurant Logo */}
          <img 
            src={logoImage} 
            alt="International Kabab House Logo" 
            className="w-16 h-16 mx-auto mb-4 rounded-full object-cover border-2 border-primary/20"
          />

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-primary mb-2">Order Confirmed!</h1>
          <h2 className="text-xl font-semibold text-foreground mb-4">Thank You for Your Order</h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center space-x-2 text-emerald-600">
              <i className="fa-solid fa-certificate"></i>
              <span className="font-medium">Payment Processed Successfully</span>
            </div>
            
            <p className="text-muted-foreground">
              Your order has been received and is being prepared with authentic Afghan flavors. 
              You will receive a confirmation email shortly with your order details.
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-foreground mb-3">What's Next?</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <i className="fa-solid fa-clock text-primary"></i>
                <span>Estimated preparation time: 25-35 minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fa-solid fa-phone text-primary"></i>
                <span>We'll call you when your order is ready</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fa-solid fa-envelope text-primary"></i>
                <span>Confirmation email sent to your inbox</span>
              </div>
            </div>
          </div>

          {/* Restaurant Contact */}
          <div className="border-t border-border pt-6 mb-6">
            <h3 className="font-semibold text-foreground mb-3">International Kabab House</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>📍 6045 Memorial Dr, Ste 15, Stone Mountain, GA 30083</p>
              <p>📞 (470) 990-6345</p>
              <p>📧 internationalkababhouse@gmail.com</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => setLocation("/online-order")}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <i className="fa-solid fa-utensils mr-2"></i>
              Order Again
            </button>
            
            <button
              onClick={() => setLocation("/")}
              className="w-full border border-border text-foreground py-3 rounded-lg font-medium hover:bg-secondary transition-colors"
            >
              <i className="fa-solid fa-home mr-2"></i>
              Back to Home
            </button>
          </div>

          {/* Support */}
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Questions about your order? Call us at (470) 990-6345
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
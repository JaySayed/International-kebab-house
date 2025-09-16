'use client';

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { MenuItem, CartItem } from "@shared/schema";

// Import generated food images
import qabuliPulaoImg from "@assets/generated_images/Qabuli_Pulao_dish_544cb5b2.png";
import chickenTikkaImg from "@assets/generated_images/Chicken_Tikka_Kabab_a78e3a35.png";
import beefTikkaImg from "@assets/generated_images/Beef_Tikka_Kabab_99d291f4.png";
import lambKarahiImg from "@assets/generated_images/Lamb_Karahi_curry_53f00218.png";
import mantuImg from "@assets/generated_images/Mantu_Afghan_dumplings_29495451.png";
import appetizerImg from "@assets/generated_images/Afghan_appetizers_platter_12ae089e.png";

export default function OnlineOrder() {
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));
  const queryClient = useQueryClient();

  const { data: menuItems, isLoading: menuLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });

  const { data: cartItems = [], isLoading: cartLoading } = useQuery<(CartItem & { menuItem: MenuItem })[]>({
    queryKey: ["/api/cart", sessionId],
  });

  const addToCartMutation = useMutation({
    mutationFn: async (data: { menuItemId: number; quantity: number }) => {
      return apiRequest("POST", "/api/cart", {
        menuItemId: data.menuItemId,
        quantity: data.quantity,
        sessionId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
  });

  const updateCartMutation = useMutation({
    mutationFn: async (data: { id: number; quantity: number }) => {
      return apiRequest("PATCH", `/api/cart/${data.id}`, { quantity: data.quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
  });

  const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.menuItem.price) * item.quantity, 0);
  const tax = subtotal * 0.08;
  const deliveryFee = 2.99;
  const total = subtotal + tax + deliveryFee;

  // Define category order to match authentic menu categories
  const categoryOrder = [
    'Appetizers',
    'Kabab Specialties',
    'Rice Dishes',
    'Karahi',
    'Family Platters',
    'Desserts',
    'Salads',
    'Kids Menu',
    'Beverages',
    'Hookah'
  ];

  // Popular items to highlight (matching Menu page)
  const popularItems = [
    'Qabuli Pulao', 'Chicken Tikka Kabab', 'Lamb Karahi', 'Mantu', 'Beef Tikka Kabab'
  ];

  // Get food image for menu items
  const getItemImage = (itemName: string) => {
    const imageMap: Record<string, string> = {
      'Qabuli Pulao': qabuliPulaoImg,
      'Chicken Tikka Kabab': chickenTikkaImg,
      'Beef Tikka Kabab': beefTikkaImg,
      'Lamb Karahi': lambKarahiImg,
      'Mantu': mantuImg,
      'Bolany': appetizerImg,
      'Sambosa': appetizerImg,
      'Hummus': appetizerImg,
    };
    return imageMap[itemName] || null;
  };

  // Organize menu items by category
  const categorizedItems = menuItems?.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>) || {};

  // Get only categories that exist in our menu, in the correct order
  const sortedCategories = categoryOrder.filter(category => 
    categorizedItems[category] && categorizedItems[category].length > 0
  );

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: string } = {
      "Appetizers": "fa-utensils",
      "Kabab Specialties": "fa-fire",
      "Rice Dishes": "fa-bowl-rice", 
      "Karahi": "fa-pot-food",
      "Family Platters": "fa-users",
      "Desserts": "fa-cake-candles",
      "Salads": "fa-leaf",
      "Kids Menu": "fa-child",
      "Beverages": "fa-mug-hot",
      "Hookah": "fa-smoking"
    };
    return iconMap[category] || "fa-utensils";
  };

  if (menuLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-muted-foreground">Loading menu...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-4 animate-float">🍽️ Online Ordering</h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-4">Order authentic Afghan & Middle Eastern cuisine for pickup or delivery</p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-certificate text-emerald-500"></i>
            <span className="text-emerald-600 font-medium">100% Halal Certified</span>
          </div>
          <span className="text-muted-foreground hidden sm:inline">•</span>
          <span className="text-muted-foreground">Stone Mountain, GA</span>
          <span className="text-muted-foreground hidden sm:inline">•</span>
          <span className="text-muted-foreground">Pickup & Delivery Available</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Menu Items Section */}
        <div className="flex-1 order-2 lg:order-1">
          {/* Popular Items Section */}
          <div className="mb-12">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-2 animate-bounce-subtle">⭐ Most Popular</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Customer favorites - highly rated dishes</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {menuItems?.filter(item => popularItems.includes(item.name)).map(item => {
                const itemImage = getItemImage(item.name);
                return (
                  <div key={`popular-${item.id}`} className="relative card-enhanced rounded-xl overflow-hidden animate-float">
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                        POPULAR
                      </span>
                    </div>
                    {itemImage && (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={itemImage} 
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-xl text-foreground mb-1">{item.name}</h3>
                          <div className="flex items-center space-x-1 mt-1">
                            <i className="fa-solid fa-certificate text-emerald-500 text-sm"></i>
                            <span className="text-sm text-emerald-600 font-medium">Halal Certified</span>
                          </div>
                        </div>
                        <span className="text-2xl font-bold text-primary animate-bounce-subtle">${item.price}</span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">{item.description}</p>
                      <button 
                        onClick={() => addToCartMutation.mutate({ menuItemId: parseInt(item.id.toString()), quantity: 1 })}
                        disabled={addToCartMutation.isPending}
                        className="btn-primary-enhanced px-4 py-2 rounded-lg text-sm disabled:opacity-50 animate-bounce-subtle w-full"
                        data-testid={`button-add-cart-${item.id}`}
                      >
                        <i className="fa-solid fa-plus mr-2 animate-pulse"></i>Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">🍽️ Complete Menu</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Browse our full selection of authentic Afghan and Middle Eastern dishes</p>
          </div>
          
          <div className="space-y-8">
            {sortedCategories.map(category => (
              <div key={category} className="space-y-4">
                <div className="flex items-center space-x-3 mb-6">
                  <i className={`fa-solid ${getCategoryIcon(category)} text-2xl text-primary`}></i>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">{category}</h3>
                  <div className="flex-1 border-b border-border"></div>
                </div>
                
                <div className="grid gap-4 sm:gap-6">
                  {categorizedItems[category]?.map(item => {
                    const itemImage = getItemImage(item.name);
                    const isPopular = popularItems.includes(item.name);
                    return (
                      <div key={item.id} className="card-enhanced rounded-xl overflow-hidden">
                        <div className="flex">
                          {itemImage && (
                            <div className="w-32 h-32 flex-shrink-0 relative">
                              <img 
                                src={itemImage} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                              {isPopular && (
                                <div className="absolute top-2 left-2">
                                  <span className="bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                                    ⭐
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                          <div className="flex-1 p-4 sm:p-6">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h4 className="font-bold text-lg text-foreground mb-1">{item.name}</h4>
                                <div className="flex items-center space-x-1 mb-2">
                                  <i className="fa-solid fa-certificate text-emerald-500 text-sm"></i>
                                  <span className="text-xs text-emerald-600 font-medium">Halal</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xl font-bold text-primary">${item.price}</span>
                                <button 
                                  onClick={() => addToCartMutation.mutate({ menuItemId: parseInt(item.id.toString()), quantity: 1 })}
                                  disabled={addToCartMutation.isPending}
                                  className="btn-primary-enhanced px-3 py-2 rounded-lg text-sm disabled:opacity-50 animate-bounce-subtle"
                                  data-testid={`button-add-cart-${item.id}`}
                                >
                                  <i className="fa-solid fa-plus mr-1 animate-pulse"></i>Add
                                </button>
                              </div>
                            </div>
                            <p className="text-muted-foreground leading-relaxed text-sm line-clamp-2">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shopping Cart Panel */}
        <div className="w-full lg:w-80 card-enhanced rounded-xl h-fit lg:sticky lg:top-6 order-1 lg:order-2 animate-float">
          <div className="p-4 sm:p-6 border-b border-border">
            <h3 className="text-lg sm:text-xl font-bold flex items-center text-primary">
              <i className="fa-solid fa-shopping-cart mr-3"></i>
              Your Order
            </h3>
          </div>
          
          <div className="p-4 sm:p-6">
            {cartLoading ? (
              <div className="text-center text-muted-foreground py-8">
                <i className="fa-solid fa-spinner fa-spin text-2xl mb-2"></i>
                <p>Loading cart...</p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <i className="fa-solid fa-shopping-cart text-4xl mb-4 opacity-50"></i>
                <p>Your cart is empty</p>
                <p className="text-sm">Add some delicious items!</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cartItems.map(item => (
                    <div key={item.id} className="bg-secondary/20 border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-foreground text-sm sm:text-base">{item.menuItem.name}</h4>
                        <button 
                          onClick={() => removeFromCartMutation.mutate(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => updateCartMutation.mutate({ id: item.id, quantity: Math.max(1, item.quantity - 1) })}
                            className="w-8 h-8 bg-background border border-border rounded-lg flex items-center justify-center hover:bg-secondary transition-colors"
                          >
                            <i className="fa-solid fa-minus text-xs"></i>
                          </button>
                          <span className="w-8 text-center font-medium text-foreground">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartMutation.mutate({ id: item.id, quantity: item.quantity + 1 })}
                            className="w-8 h-8 bg-background border border-border rounded-lg flex items-center justify-center hover:bg-secondary transition-colors"
                          >
                            <i className="fa-solid fa-plus text-xs"></i>
                          </button>
                        </div>
                        <span className="font-bold text-primary">${(parseFloat(item.menuItem.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-border">
              <button 
                onClick={() => {
                  localStorage.setItem('checkoutSessionId', sessionId);
                  window.location.href = `/checkout?sessionId=${sessionId}`;
                }}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold mb-3 hover:bg-primary/90 transition-colors"
              >
                <i className="fa-solid fa-credit-card mr-2"></i>
                Proceed to Checkout
              </button>
              <div className="text-xs text-muted-foreground text-center">
                <i className="fa-solid fa-shield-halved mr-1"></i>
                Secure checkout with Stripe
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
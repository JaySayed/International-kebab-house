'use client';

import { useQuery } from "@tanstack/react-query";
import type { MenuItem } from "@shared/schema";

// Import generated food images
import qabuliPulaoImg from "@assets/generated_images/Qabuli_Pulao_dish_544cb5b2.png";
import chickenTikkaImg from "@assets/generated_images/Chicken_Tikka_Kabab_a78e3a35.png";
import beefTikkaImg from "@assets/generated_images/Beef_Tikka_Kabab_99d291f4.png";
import lambKarahiImg from "@assets/generated_images/Lamb_Karahi_curry_53f00218.png";
import mantuImg from "@assets/generated_images/Mantu_Afghan_dumplings_29495451.png";
import appetizerImg from "@assets/generated_images/Afghan_appetizers_platter_12ae089e.png";

export default function Menu() {
  const { data: menuItems, isLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });

  const categories = menuItems ? Array.from(new Set(menuItems.map(item => item.category))) : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-muted-foreground">Loading menu...</div>
      </div>
    );
  }

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

  const orderedCategories = categoryOrder.filter(cat => categories.includes(cat));

  return (
    <div className="max-w-6xl mx-auto p-6 sm:p-8 md:p-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">Our Menu</h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-2">Authentic Afghan & Middle Eastern Cuisine</p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm">
          <span className="flex items-center space-x-1">
            <i className="fa-solid fa-certificate text-emerald-500"></i>
            <span className="text-emerald-600 font-medium">100% Halal Certified</span>
          </span>
          <span className="text-muted-foreground hidden sm:inline">•</span>
          <span className="text-muted-foreground">Stone Mountain, GA</span>
        </div>
      </div>

      {/* Most Popular Section */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">⭐ Most Popular</h2>
          <p className="text-muted-foreground">Customer favorites - highly rated dishes</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems?.filter(item => popularItems.includes(item.name)).map(item => {
            const itemImage = getItemImage(item.name);
            return (
              <div key={`popular-${item.id}`} className="relative bg-card border border-primary/20 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 animate-float">
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
                      <div className="flex items-center space-x-1 mb-2">
                        <i className="fa-solid fa-certificate text-emerald-500 text-sm"></i>
                        <span className="text-sm text-emerald-600 font-medium">Halal Certified</span>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-primary animate-bounce-subtle">${item.price}</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Menu Categories */}
      {orderedCategories.map(category => {
        const categoryItems = menuItems?.filter(item => item.category === category) || [];
        
        const getCategoryIcon = (cat: string) => {
          const icons: Record<string, string> = {
            'Kababs': '🍖',
            'Rice Dishes': '🍚',
            'Afghan Specialties': '🥟',
            'Curries': '🍲',
            'Tandoori Specialties': '🔥',
            'Wraps': '🌯',
            'Appetizers': '🥘',
            'Vegetarian': '🥬',
            'Breads': '🥖',
            'Beverages': '🍵',
            'Desserts': '🍨'
          };
          return icons[cat] || '🍽️';
        };
        
        return (
          <div key={category} className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                {getCategoryIcon(category)} {category}
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {categoryItems.map(item => {
                const itemImage = getItemImage(item.name);
                const isPopular = popularItems.includes(item.name);
                return (
                  <div key={item.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 animate-float">
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
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-foreground mb-1">{item.name}</h3>
                            <div className="flex items-center space-x-1 mb-2">
                              <i className="fa-solid fa-certificate text-emerald-500 text-sm"></i>
                              <span className="text-xs text-emerald-600 font-medium">Halal</span>
                            </div>
                          </div>
                          <span className="text-xl font-bold text-primary ml-3">${item.price}</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed text-sm line-clamp-2">{item.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Footer Info */}
      <div className="mt-16 text-center py-8 border-t border-border">
        <p className="text-muted-foreground mb-2 text-sm sm:text-base">📍 6045 Memorial Dr, Ste 15, Stone Mountain, GA 30083</p>
        <p className="text-muted-foreground mb-4 text-sm sm:text-base">📞 (470) 990-6345 | 📧 internationalkababhouse@gmail.com</p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
          <span className="flex items-center space-x-2">
            <i className="fa-solid fa-clock text-primary"></i>
            <span>Tue-Sun: 11 AM - 10 PM</span>
          </span>
          <span className="flex items-center space-x-2">
            <i className="fa-solid fa-times-circle text-destructive"></i>
            <span>Closed Mondays</span>
          </span>
        </div>
      </div>
    </div>
  );
}
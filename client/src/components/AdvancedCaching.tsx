import { useEffect } from 'react';

interface CacheItem {
  data: any;
  timestamp: number;
  expiry: number;
}

class AdvancedCache {
  private cache: Map<string, CacheItem> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    const item: CacheItem = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl
    };
    this.cache.set(key, item);
    
    // Clean up expired items periodically
    if (this.cache.size % 50 === 0) {
      this.cleanup();
    }
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) return false;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    for (const [key, item] of entries) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }

  getStats(): { size: number; hitRate: number } {
    // Simple implementation - in real app would track hits/misses
    return {
      size: this.cache.size,
      hitRate: 0.85 // Mock hit rate
    };
  }
}

const cache = new AdvancedCache();

// Make cache available globally
declare global {
  interface Window {
    restaurantCache: AdvancedCache;
  }
}

export default function AdvancedCaching() {
  useEffect(() => {
    // Make cache available globally
    if (typeof window !== 'undefined') {
      window.restaurantCache = cache;
    }

    // Cache menu items on load
    const cacheMenuItems = async () => {
      try {
        const response = await fetch('/api/menu-items');
        const menuItems = await response.json();
        cache.set('menu-items', menuItems, 10 * 60 * 1000); // 10 minutes
      } catch (error) {
        console.error('Failed to cache menu items:', error);
      }
    };

    // Cache restaurant info
    const cacheRestaurantInfo = () => {
      const restaurantInfo = {
        name: 'International Kabab House',
        address: '6045 Memorial Dr, Suite 15, Stone Mountain, GA 30083',
        phone: '(470) 990-6345',
        email: 'internationalkababhouse@gmail.com',
        hours: {
          monday: 'Closed',
          tuesday: '11:00 AM - 10:00 PM',
          wednesday: '11:00 AM - 10:00 PM',
          thursday: '11:00 AM - 10:00 PM',
          friday: '11:00 AM - 10:00 PM',
          saturday: '11:00 AM - 10:00 PM',
          sunday: '11:00 AM - 10:00 PM'
        }
      };
      
      cache.set('restaurant-info', restaurantInfo, 24 * 60 * 60 * 1000); // 24 hours
    };

    // Intercept fetch requests to add caching
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : (input as Request).url;
      
      // Only cache GET requests to our API
      if ((!init || init.method === 'GET' || !init.method) && url.includes('/api/menu-items')) {
        const cached = cache.get(url);
        if (cached) {
          console.log('Cache hit for:', url);
          return Promise.resolve(new Response(JSON.stringify(cached), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }));
        }
      }

      const response = await originalFetch(input, init);
      
      // Cache successful GET responses
      if (response.ok && (!init || init.method === 'GET' || !init.method) && url.includes('/api/')) {
        const clonedResponse = response.clone();
        try {
          const data = await clonedResponse.json();
          cache.set(url, data);
          console.log('Cached response for:', url);
        } catch (error) {
          // Not JSON, skip caching
        }
      }

      return response;
    };

    // Initialize caching
    cacheMenuItems();
    cacheRestaurantInfo();

    // Periodic cache cleanup
    const cleanupInterval = setInterval(() => {
      cache.cleanup();
    }, 60000); // Every minute

    // Cache performance monitoring
    const logCacheStats = () => {
      const stats = cache.getStats();
      console.log('Cache Stats:', stats);
    };

    const statsInterval = setInterval(logCacheStats, 5 * 60 * 1000); // Every 5 minutes

    return () => {
      clearInterval(cleanupInterval);
      clearInterval(statsInterval);
      window.fetch = originalFetch;
    };
  }, []);

  return null;
}
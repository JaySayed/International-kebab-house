import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export default function AdvancedAnalytics() {
  useEffect(() => {
    // Track user interactions
    const trackEvent = (action: string, category: string, label?: string, value?: number) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
          event_category: category,
          event_label: label,
          value: value
        });
      }
    };

    // Track menu views
    const trackMenuViews = () => {
      const menuItems = document.querySelectorAll('[data-testid*="menu-item"]');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const itemName = entry.target.getAttribute('data-item-name') || 'Unknown Item';
            trackEvent('view_item', 'menu', itemName);
          }
        });
      }, { threshold: 0.5 });

      menuItems.forEach(item => observer.observe(item));
    };

    // Track button clicks
    const trackButtonClicks = () => {
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const button = target.closest('[data-testid*="button-"], [data-testid*="link-"]');
        
        if (button) {
          const testId = button.getAttribute('data-testid');
          if (testId) {
            trackEvent('click', 'engagement', testId);
          }
        }
      });
    };

    // Track form interactions
    const trackFormInteractions = () => {
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        form.addEventListener('submit', (e) => {
          const formType = form.getAttribute('data-form-type') || 'unknown';
          trackEvent('form_submit', 'conversion', formType);
        });
      });
    };

    // Track scroll depth
    const trackScrollDepth = () => {
      let maxScroll = 0;
      const milestones = [25, 50, 75, 90, 100];
      let trackedMilestones: number[] = [];

      window.addEventListener('scroll', () => {
        const scrollPercent = Math.round(
          (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
        
        if (scrollPercent > maxScroll) {
          maxScroll = scrollPercent;
          
          milestones.forEach(milestone => {
            if (scrollPercent >= milestone && !trackedMilestones.includes(milestone)) {
              trackEvent('scroll_depth', 'engagement', `${milestone}%`, milestone);
              trackedMilestones.push(milestone);
            }
          });
        }
      });
    };

    // Track time on page
    const trackTimeOnPage = () => {
      const startTime = Date.now();
      const timeCheckpoints = [30, 60, 120, 300]; // seconds
      let trackedCheckpoints: number[] = [];

      const checkTime = () => {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        
        timeCheckpoints.forEach(checkpoint => {
          if (timeSpent >= checkpoint && !trackedCheckpoints.includes(checkpoint)) {
            trackEvent('time_on_page', 'engagement', `${checkpoint}s`, checkpoint);
            trackedCheckpoints.push(checkpoint);
          }
        });
      };

      const interval = setInterval(checkTime, 10000); // Check every 10 seconds

      return () => clearInterval(interval);
    };

    // Track cart interactions
    const trackCartInteractions = () => {
      window.addEventListener('cart:add', (e: any) => {
        trackEvent('add_to_cart', 'ecommerce', e.detail.itemName, e.detail.price);
      });

      window.addEventListener('cart:remove', (e: any) => {
        trackEvent('remove_from_cart', 'ecommerce', e.detail.itemName);
      });

      window.addEventListener('purchase', (e: any) => {
        trackEvent('purchase', 'ecommerce', 'online_order', e.detail.total);
      });
    };

    // Track device and connection info
    const trackDeviceInfo = () => {
      const connection = (navigator as any).connection;
      if (connection) {
        trackEvent('connection_type', 'technical', connection.effectiveType);
      }

      const isMobile = window.innerWidth < 768;
      trackEvent('device_type', 'technical', isMobile ? 'mobile' : 'desktop');
    };

    // Initialize all tracking
    trackMenuViews();
    trackButtonClicks();
    trackFormInteractions();
    trackScrollDepth();
    trackCartInteractions();
    trackDeviceInfo();
    
    const cleanupTimeTracking = trackTimeOnPage();

    return () => {
      cleanupTimeTracking();
    };
  }, []);

  return null;
}
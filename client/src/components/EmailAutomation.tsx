import { useEffect } from 'react';

export default function EmailAutomation() {
  useEffect(() => {
    // Setup email automation triggers
    const sendWelcomeEmail = async (email: string, name: string) => {
      const emailData = {
        to: email,
        subject: '🍽️ Welcome to International Kabab House Family!',
        template: 'welcome',
        data: {
          name: name,
          restaurantName: 'International Kabab House',
          welcomeOffer: '10% off your first order with code WELCOME10',
          menuLink: `${window.location.origin}/menu`,
          orderLink: `${window.location.origin}/online-order`
        }
      };

      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailData)
        });
      } catch (error) {
        console.error('Failed to send welcome email:', error);
      }
    };

    const sendOrderConfirmation = async (email: string, orderData: any) => {
      const emailData = {
        to: email,
        subject: '✅ Order Confirmation - International Kabab House',
        template: 'order_confirmation',
        data: {
          orderNumber: orderData.orderNumber,
          items: orderData.items,
          total: orderData.total,
          estimatedTime: orderData.estimatedTime,
          restaurantPhone: '(470) 990-6345',
          restaurantAddress: '6045 Memorial Dr, Suite 15, Stone Mountain, GA 30083'
        }
      };

      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailData)
        });
      } catch (error) {
        console.error('Failed to send order confirmation:', error);
      }
    };

    const sendReservationConfirmation = async (email: string, reservationData: any) => {
      const emailData = {
        to: email,
        subject: '📅 Reservation Confirmed - International Kabab House',
        template: 'reservation_confirmation',
        data: {
          name: reservationData.name,
          date: reservationData.date,
          time: reservationData.time,
          partySize: reservationData.partySize,
          specialRequests: reservationData.specialRequests,
          restaurantPhone: '(470) 990-6345',
          restaurantAddress: '6045 Memorial Dr, Suite 15, Stone Mountain, GA 30083'
        }
      };

      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailData)
        });
      } catch (error) {
        console.error('Failed to send reservation confirmation:', error);
      }
    };

    // Listen for events to trigger emails
    window.addEventListener('newsletter:signup', (e: any) => {
      sendWelcomeEmail(e.detail.email, e.detail.name || 'Valued Customer');
    });

    window.addEventListener('order:completed', (e: any) => {
      sendOrderConfirmation(e.detail.email, e.detail.orderData);
    });

    window.addEventListener('reservation:confirmed', (e: any) => {
      sendReservationConfirmation(e.detail.email, e.detail.reservationData);
    });

    // Abandoned cart email (after 30 minutes of inactivity)
    let cartAbandonmentTimer: NodeJS.Timeout;
    
    window.addEventListener('cart:add', () => {
      clearTimeout(cartAbandonmentTimer);
      
      cartAbandonmentTimer = setTimeout(() => {
        // Check if cart still has items and no recent activity
        const cartItems = localStorage.getItem('cart');
        if (cartItems && JSON.parse(cartItems).length > 0) {
          // Trigger abandoned cart email if user email is available
          const userEmail = localStorage.getItem('userEmail');
          if (userEmail) {
            const emailData = {
              to: userEmail,
              subject: '🛒 Don\'t forget your delicious order!',
              template: 'abandoned_cart',
              data: {
                cartItems: JSON.parse(cartItems),
                checkoutLink: `${window.location.origin}/online-order`,
                specialOffer: '5% off if you complete your order in the next 24 hours with code COMEBACK5'
              }
            };

            fetch('/api/send-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(emailData)
            }).catch(console.error);
          }
        }
      }, 30 * 60 * 1000); // 30 minutes
    });

    window.addEventListener('cart:checkout', () => {
      clearTimeout(cartAbandonmentTimer);
    });

    return () => {
      clearTimeout(cartAbandonmentTimer);
    };
  }, []);

  return null;
}
import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { notificationService } from "./notification-service";
import { 
  insertCartItemSchema, 
  insertOrderSchema, 
  insertContactMessageSchema,
  insertCustomerSchema,
  insertReviewSchema,
  insertLoyaltyTransactionSchema,
  insertOrderStatusUpdateSchema,
  insertAnalyticsEventSchema,
  insertCateringOrderSchema
} from "@shared/schema";
import { z } from "zod";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function registerRoutes(app: Express): Promise<Server> {
  // Menu Items
  app.get("/api/menu-items", async (req, res) => {
    try {
      const items = await storage.getAllMenuItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  app.get("/api/menu-items/category/:category", async (req, res) => {
    try {
      const items = await storage.getMenuItemsByCategory(req.params.category);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items by category" });
    }
  });

  // Cart
  app.get("/api/cart", async (req, res) => {
    try {
      const sessionId = req.query.sessionId as string;
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }
      const items = await storage.getCartItems(sessionId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.get("/api/cart/:sessionId", async (req, res) => {
    try {
      const items = await storage.getCartItems(req.params.sessionId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(validatedData);
      res.json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to add item to cart" });
      }
    }
  });

  app.patch("/api/cart/:id", async (req, res) => {
    try {
      const { quantity } = req.body;
      const cartItem = await storage.updateCartItem(parseInt(req.params.id), quantity);
      if (cartItem) {
        res.json(cartItem);
      } else {
        res.status(404).json({ message: "Cart item not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const success = await storage.removeFromCart(parseInt(req.params.id));
      if (success) {
        res.json({ message: "Item removed from cart" });
      } else {
        res.status(404).json({ message: "Cart item not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });

  app.delete("/api/cart/session/:sessionId", async (req, res) => {
    try {
      await storage.clearCart(req.params.sessionId);
      res.json({ message: "Cart cleared" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Stripe payment route for one-time payments
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, customerInfo, cartItems } = req.body;
      
      if (!amount || amount < 0.50) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          restaurant: "International Kabab House",
          customerEmail: customerInfo?.email || '',
          customerName: customerInfo?.name || '',
          orderType: customerInfo?.orderType || 'delivery',
          cartItems: JSON.stringify(cartItems?.slice(0, 5) || []) // Limit metadata size
        }
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id 
      });
    } catch (error: any) {
      console.error('Stripe payment intent error:', error);
      res
        .status(500)
        .json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Email automation endpoint
  app.post("/api/send-email", async (req, res) => {
    try {
      const { to, subject, template, data } = req.body;
      
      // This would integrate with your email service (SendGrid, etc.)
      console.log('Email would be sent:', { to, subject, template, data });
      
      // Simulate email sending
      setTimeout(() => {
        console.log(`Email sent successfully to ${to}`);
      }, 100);
      
      res.json({ success: true, message: "Email queued successfully" });
    } catch (error: any) {
      console.error('Email sending error:', error);
      res.status(500).json({ message: "Failed to send email" });
    }
  });

  // Advanced analytics endpoint
  app.post("/api/analytics", async (req, res) => {
    try {
      const { event, category, label, value, userId, sessionId } = req.body;
      
      // Log analytics event (would integrate with analytics service)
      const analyticsData = {
        timestamp: new Date().toISOString(),
        event,
        category,
        label,
        value,
        userId,
        sessionId,
        userAgent: req.get('User-Agent'),
        ip: req.ip
      };
      
      console.log('Analytics event:', analyticsData);
      
      res.json({ success: true });
    } catch (error: any) {
      console.error('Analytics error:', error);
      res.status(500).json({ message: "Analytics tracking failed" });
    }
  });

  // Orders
  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      
      // Send notifications
      let customer = null;
      if (validatedData.customerEmail) {
        customer = await storage.getCustomerByEmail(validatedData.customerEmail);
      }
      
      // Notify restaurant of new order (only restaurant, not customer)
      await notificationService.notifyNewOrder(order, customer || undefined);
      
      // Generate confirmation number for customer (instead of notification)
      const confirmationNumber = notificationService.generateOrderConfirmationNumber(order.id);
      
      // Return order with confirmation number
      res.json({ 
        ...order, 
        confirmationNumber,
        message: `Order confirmed! Your confirmation number is ${confirmationNumber}. Please keep this for your records.`
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid order data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create order" });
      }
    }
  });

  // Contact Messages
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      
      // Send notification to restaurant
      await notificationService.notifyCustomerMessage(
        `${validatedData.firstName} ${validatedData.lastName}`.trim(),
        validatedData.email,
        'New Contact Message'
      );
      
      res.json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid contact data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to send message" });
      }
    }
  });

  // Customer Management & Loyalty System
  app.post("/api/customers", async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(validatedData);
      res.json(customer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid customer data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create customer" });
      }
    }
  });

  app.get("/api/customers/:id", async (req, res) => {
    try {
      const customer = await storage.getCustomer(parseInt(req.params.id));
      if (customer) {
        res.json(customer);
      } else {
        res.status(404).json({ message: "Customer not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer" });
    }
  });

  app.get("/api/customers/email/:email", async (req, res) => {
    try {
      const customer = await storage.getCustomerByEmail(req.params.email);
      if (customer) {
        res.json(customer);
      } else {
        res.status(404).json({ message: "Customer not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer" });
    }
  });

  app.patch("/api/customers/:id/loyalty-points", async (req, res) => {
    try {
      const { points } = req.body;
      const customer = await storage.updateCustomerLoyaltyPoints(parseInt(req.params.id), points);
      if (customer) {
        res.json(customer);
      } else {
        res.status(404).json({ message: "Customer not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update loyalty points" });
    }
  });

  // Reviews System
  app.post("/api/reviews", async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(validatedData);
      res.json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid review data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create review" });
      }
    }
  });

  app.get("/api/reviews/menu-item/:menuItemId", async (req, res) => {
    try {
      const reviews = await storage.getReviewsByMenuItem(parseInt(req.params.menuItemId));
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.get("/api/reviews/customer/:customerId", async (req, res) => {
    try {
      const reviews = await storage.getReviewsByCustomer(parseInt(req.params.customerId));
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer reviews" });
    }
  });

  app.get("/api/reviews/public", async (req, res) => {
    try {
      const reviews = await storage.getPublicReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch public reviews" });
    }
  });

  // Loyalty Transactions
  app.post("/api/loyalty-transactions", async (req, res) => {
    try {
      const validatedData = insertLoyaltyTransactionSchema.parse(req.body);
      const transaction = await storage.createLoyaltyTransaction(validatedData);
      res.json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create loyalty transaction" });
      }
    }
  });

  app.get("/api/loyalty-transactions/customer/:customerId", async (req, res) => {
    try {
      const transactions = await storage.getLoyaltyTransactionsByCustomer(parseInt(req.params.customerId));
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch loyalty transactions" });
    }
  });

  // Order Status Tracking
  app.post("/api/order-status", async (req, res) => {
    try {
      const validatedData = insertOrderStatusUpdateSchema.parse(req.body);
      const statusUpdate = await storage.createOrderStatusUpdate(validatedData);
      
      // Get order details and send notification
      const order = await storage.getOrder(validatedData.orderId);
      if (order) {
        await notificationService.notifyOrderStatusUpdate(order, validatedData.status, order.customerEmail);
      }
      
      res.json(statusUpdate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid status update data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create status update" });
      }
    }
  });

  app.get("/api/order-status/:orderId", async (req, res) => {
    try {
      const statusUpdates = await storage.getOrderStatusUpdates(parseInt(req.params.orderId));
      res.json(statusUpdates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order status" });
    }
  });

  app.get("/api/order-status/:orderId/latest", async (req, res) => {
    try {
      const latestStatus = await storage.getLatestOrderStatus(parseInt(req.params.orderId));
      if (latestStatus) {
        res.json(latestStatus);
      } else {
        res.status(404).json({ message: "No status updates found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest status" });
    }
  });

  // Analytics Events
  app.post("/api/analytics-events", async (req, res) => {
    try {
      const validatedData = insertAnalyticsEventSchema.parse(req.body);
      const event = await storage.createAnalyticsEvent(validatedData);
      res.json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid analytics data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create analytics event" });
      }
    }
  });

  app.get("/api/analytics-events", async (req, res) => {
    try {
      const events = await storage.getAnalyticsEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics events" });
    }
  });

  // Catering Orders
  app.post("/api/catering-orders", async (req, res) => {
    try {
      const validatedData = insertCateringOrderSchema.parse(req.body);
      const order = await storage.createCateringOrder(validatedData);
      
      // Send catering inquiry notification
      await notificationService.notifyNewCateringInquiry(order);
      
      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid catering order data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create catering order" });
      }
    }
  });

  app.get("/api/catering-orders", async (req, res) => {
    try {
      const orders = await storage.getAllCateringOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch catering orders" });
    }
  });

  app.get("/api/catering-orders/:id", async (req, res) => {
    try {
      const order = await storage.getCateringOrder(parseInt(req.params.id));
      if (order) {
        res.json(order);
      } else {
        res.status(404).json({ message: "Catering order not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch catering order" });
    }
  });

  // Notifications
  app.get("/api/notifications/restaurant", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const result = await notificationService.getRestaurantNotifications(limit);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const success = await notificationService.markAsRead(parseInt(req.params.id));
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: "Notification not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  app.get("/api/notifications/customer/:customerId", async (req, res) => {
    try {
      const notifications = await storage.getCustomerNotifications(parseInt(req.params.customerId));
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer notifications" });
    }
  });

  const httpServer = createServer(app);
  
  // WebSocket setup for real-time notifications
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'subscribe') {
          console.log(`Client subscribed to ${data.channel}`);
        }
      } catch (error) {
        console.error('Invalid WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });
  
  // Store WebSocket server instance for broadcasting
  (httpServer as any).wss = wss;
  
  // Connect WebSocket server to notification service
  notificationService.setWebSocketServer(wss);
  
  return httpServer;
}

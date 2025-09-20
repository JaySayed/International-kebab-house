var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import { WebSocketServer } from "ws";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  analyticsEvents: () => analyticsEvents,
  analyticsEventsRelations: () => analyticsEventsRelations,
  cartItems: () => cartItems,
  cartItemsRelations: () => cartItemsRelations,
  cateringOrders: () => cateringOrders,
  contactMessages: () => contactMessages,
  customers: () => customers,
  customersRelations: () => customersRelations,
  insertAnalyticsEventSchema: () => insertAnalyticsEventSchema,
  insertCartItemSchema: () => insertCartItemSchema,
  insertCateringOrderSchema: () => insertCateringOrderSchema,
  insertContactMessageSchema: () => insertContactMessageSchema,
  insertCustomerSchema: () => insertCustomerSchema,
  insertLoyaltyTransactionSchema: () => insertLoyaltyTransactionSchema,
  insertMenuItemSchema: () => insertMenuItemSchema,
  insertNotificationSchema: () => insertNotificationSchema,
  insertOrderSchema: () => insertOrderSchema,
  insertOrderStatusUpdateSchema: () => insertOrderStatusUpdateSchema,
  insertReviewSchema: () => insertReviewSchema,
  loyaltyTransactions: () => loyaltyTransactions,
  loyaltyTransactionsRelations: () => loyaltyTransactionsRelations,
  menuItems: () => menuItems,
  menuItemsRelations: () => menuItemsRelations,
  notifications: () => notifications,
  orderStatusUpdates: () => orderStatusUpdates,
  orderStatusUpdatesRelations: () => orderStatusUpdatesRelations,
  orders: () => orders,
  ordersRelations: () => ordersRelations,
  reviews: () => reviews,
  reviewsRelations: () => reviewsRelations
});
import { pgTable, text, serial, integer, decimal, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
var menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  image: text("image"),
  available: boolean("available").default(true)
});
var cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  menuItemId: integer("menu_item_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  sessionId: text("session_id").notNull()
});
var orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  items: text("items").notNull(),
  // JSON string of order items
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  paymentIntentId: text("payment_intent_id"),
  createdAt: text("created_at").notNull()
});
var contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull()
});
var customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  loyaltyPoints: integer("loyalty_points").default(0),
  totalOrders: integer("total_orders").default(0),
  totalSpent: decimal("total_spent", { precision: 10, scale: 2 }).default("0.00"),
  preferredLanguage: text("preferred_language").default("en"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  orderId: integer("order_id"),
  menuItemId: integer("menu_item_id"),
  rating: integer("rating").notNull(),
  // 1-5 stars
  title: text("title"),
  comment: text("comment"),
  isVerifiedPurchase: boolean("is_verified_purchase").default(false),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var loyaltyTransactions = pgTable("loyalty_transactions", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  orderId: integer("order_id"),
  points: integer("points").notNull(),
  // Can be positive (earned) or negative (redeemed)
  type: text("type").notNull(),
  // 'earned', 'redeemed', 'bonus', 'expired'
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var orderStatusUpdates = pgTable("order_status_updates", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  status: text("status").notNull(),
  // 'pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'
  message: text("message"),
  estimatedTime: text("estimated_time"),
  // e.g. "15-20 minutes"
  createdAt: timestamp("created_at").defaultNow()
});
var analyticsEvents = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(),
  // 'page_view', 'menu_view', 'add_to_cart', 'order_placed', 'payment_completed'
  customerId: integer("customer_id"),
  orderId: integer("order_id"),
  menuItemId: integer("menu_item_id"),
  sessionId: text("session_id"),
  metadata: text("metadata"),
  // JSON string for additional data
  createdAt: timestamp("created_at").defaultNow()
});
var cateringOrders = pgTable("catering_orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  eventDate: text("event_date").notNull(),
  eventTime: text("event_time").notNull(),
  guestCount: integer("guest_count").notNull(),
  cateringOption: text("catering_option").notNull(),
  // 'option1', 'option2', 'option3', 'custom'
  specialRequests: text("special_requests"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow()
});
var notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  // 'order_new', 'order_update', 'customer_message'
  title: text("title").notNull(),
  message: text("message").notNull(),
  recipient: text("recipient").notNull(),
  // 'restaurant', 'customer'
  recipientEmail: text("recipient_email"),
  orderId: integer("order_id"),
  customerId: integer("customer_id"),
  isRead: boolean("is_read").default(false),
  priority: text("priority").default("normal"),
  // 'high', 'normal', 'low'
  createdAt: timestamp("created_at").defaultNow()
});
var insertMenuItemSchema = createInsertSchema(menuItems);
var insertCartItemSchema = createInsertSchema(cartItems);
var insertOrderSchema = createInsertSchema(orders);
var insertContactMessageSchema = createInsertSchema(contactMessages);
var insertCustomerSchema = createInsertSchema(customers);
var insertReviewSchema = createInsertSchema(reviews);
var insertLoyaltyTransactionSchema = createInsertSchema(loyaltyTransactions);
var insertOrderStatusUpdateSchema = createInsertSchema(orderStatusUpdates);
var insertAnalyticsEventSchema = createInsertSchema(analyticsEvents);
var insertCateringOrderSchema = createInsertSchema(cateringOrders);
var insertNotificationSchema = createInsertSchema(notifications);
var menuItemsRelations = relations(menuItems, ({ many }) => ({
  cartItems: many(cartItems),
  reviews: many(reviews),
  analyticsEvents: many(analyticsEvents)
}));
var cartItemsRelations = relations(cartItems, ({ one }) => ({
  menuItem: one(menuItems, {
    fields: [cartItems.menuItemId],
    references: [menuItems.id]
  })
}));
var customersRelations = relations(customers, ({ many }) => ({
  reviews: many(reviews),
  loyaltyTransactions: many(loyaltyTransactions),
  analyticsEvents: many(analyticsEvents)
}));
var reviewsRelations = relations(reviews, ({ one }) => ({
  customer: one(customers, {
    fields: [reviews.customerId],
    references: [customers.id]
  }),
  order: one(orders, {
    fields: [reviews.orderId],
    references: [orders.id]
  }),
  menuItem: one(menuItems, {
    fields: [reviews.menuItemId],
    references: [menuItems.id]
  })
}));
var ordersRelations = relations(orders, ({ many }) => ({
  statusUpdates: many(orderStatusUpdates),
  reviews: many(reviews),
  loyaltyTransactions: many(loyaltyTransactions),
  analyticsEvents: many(analyticsEvents)
}));
var orderStatusUpdatesRelations = relations(orderStatusUpdates, ({ one }) => ({
  order: one(orders, {
    fields: [orderStatusUpdates.orderId],
    references: [orders.id]
  })
}));
var loyaltyTransactionsRelations = relations(loyaltyTransactions, ({ one }) => ({
  customer: one(customers, {
    fields: [loyaltyTransactions.customerId],
    references: [customers.id]
  }),
  order: one(orders, {
    fields: [loyaltyTransactions.orderId],
    references: [orders.id]
  })
}));
var analyticsEventsRelations = relations(analyticsEvents, ({ one }) => ({
  customer: one(customers, {
    fields: [analyticsEvents.customerId],
    references: [customers.id]
  }),
  order: one(orders, {
    fields: [analyticsEvents.orderId],
    references: [orders.id]
  }),
  menuItem: one(menuItems, {
    fields: [analyticsEvents.menuItemId],
    references: [menuItems.id]
  })
}));

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, and, count } from "drizzle-orm";
var DatabaseStorage = class {
  // Menu Items
  async getAllMenuItems() {
    return await db.select().from(menuItems);
  }
  async getMenuItemsByCategory(category) {
    return await db.select().from(menuItems).where(eq(menuItems.category, category));
  }
  async getMenuItem(id) {
    const [item] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return item || void 0;
  }
  // Cart Items
  async getCartItems(sessionId) {
    return await db.select().from(cartItems).leftJoin(menuItems, eq(cartItems.menuItemId, menuItems.id)).where(eq(cartItems.sessionId, sessionId)).then(
      (rows) => rows.map((row) => ({
        ...row.cart_items,
        menuItem: row.menu_items
      }))
    );
  }
  async addToCart(item) {
    const [newCartItem] = await db.insert(cartItems).values({
      ...item,
      quantity: item.quantity || 1
    }).returning();
    return newCartItem;
  }
  async updateCartItem(id, quantity) {
    const [updated] = await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id)).returning();
    return updated || void 0;
  }
  async removeFromCart(id) {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
  async clearCart(sessionId) {
    const result = await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
    return result.rowCount !== null && result.rowCount > 0;
  }
  // Orders
  async createOrder(order) {
    const [newOrder] = await db.insert(orders).values({
      ...order,
      status: order.status || "pending"
    }).returning();
    return newOrder;
  }
  async getOrder(id) {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || void 0;
  }
  // Contact Messages
  async createContactMessage(message) {
    const [newMessage] = await db.insert(contactMessages).values({
      ...message,
      phone: message.phone || null
    }).returning();
    return newMessage;
  }
  // Customer Management
  async createCustomer(customer) {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }
  async getCustomer(id) {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer || void 0;
  }
  async getCustomerByEmail(email) {
    const [customer] = await db.select().from(customers).where(eq(customers.email, email));
    return customer || void 0;
  }
  async updateCustomerLoyaltyPoints(id, points) {
    const [updated] = await db.update(customers).set({ loyaltyPoints: points }).where(eq(customers.id, id)).returning();
    return updated || void 0;
  }
  async updateCustomerStats(id, orderTotal) {
    const customer = await this.getCustomer(id);
    if (!customer) return void 0;
    const [updated] = await db.update(customers).set({
      totalOrders: (customer.totalOrders || 0) + 1,
      totalSpent: (parseFloat(customer.totalSpent || "0") + orderTotal).toFixed(2)
    }).where(eq(customers.id, id)).returning();
    return updated || void 0;
  }
  // Reviews System
  async createReview(review) {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }
  async getReviewsByMenuItem(menuItemId) {
    return await db.select().from(reviews).where(eq(reviews.menuItemId, menuItemId));
  }
  async getReviewsByCustomer(customerId) {
    return await db.select().from(reviews).where(eq(reviews.customerId, customerId));
  }
  async getPublicReviews() {
    return await db.select().from(reviews).where(eq(reviews.isPublic, true));
  }
  // Loyalty Program
  async createLoyaltyTransaction(transaction) {
    const [newTransaction] = await db.insert(loyaltyTransactions).values(transaction).returning();
    return newTransaction;
  }
  async getLoyaltyTransactionsByCustomer(customerId) {
    return await db.select().from(loyaltyTransactions).where(eq(loyaltyTransactions.customerId, customerId));
  }
  // Order Status Tracking
  async createOrderStatusUpdate(update) {
    const [newUpdate] = await db.insert(orderStatusUpdates).values(update).returning();
    return newUpdate;
  }
  async getOrderStatusUpdates(orderId) {
    return await db.select().from(orderStatusUpdates).where(eq(orderStatusUpdates.orderId, orderId));
  }
  async getLatestOrderStatus(orderId) {
    const [latest] = await db.select().from(orderStatusUpdates).where(eq(orderStatusUpdates.orderId, orderId)).orderBy(orderStatusUpdates.createdAt).limit(1);
    return latest || void 0;
  }
  // Analytics & Business Intelligence
  async createAnalyticsEvent(event) {
    const [newEvent] = await db.insert(analyticsEvents).values(event).returning();
    return newEvent;
  }
  async getAnalyticsEvents(startDate, endDate) {
    return await db.select().from(analyticsEvents);
  }
  // Catering Orders
  async createCateringOrder(order) {
    const [newOrder] = await db.insert(cateringOrders).values(order).returning();
    return newOrder;
  }
  async getCateringOrder(id) {
    const [order] = await db.select().from(cateringOrders).where(eq(cateringOrders.id, id));
    return order || void 0;
  }
  async getAllCateringOrders() {
    return await db.select().from(cateringOrders);
  }
  // Notifications
  async createNotification(notification) {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    return newNotification;
  }
  async getRestaurantNotifications(limit = 50) {
    return await db.select().from(notifications).where(eq(notifications.recipient, "restaurant")).orderBy(desc(notifications.createdAt)).limit(limit);
  }
  async getCustomerNotifications(customerId) {
    return await db.select().from(notifications).where(and(
      eq(notifications.recipient, "customer"),
      eq(notifications.customerId, customerId)
    )).orderBy(desc(notifications.createdAt));
  }
  async markNotificationAsRead(id) {
    const result = await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  async getUnreadNotificationCount(recipient) {
    const result = await db.select({ count: count() }).from(notifications).where(and(
      eq(notifications.recipient, recipient),
      eq(notifications.isRead, false)
    ));
    return result[0]?.count || 0;
  }
};
var storage = new DatabaseStorage();

// server/notification-service.ts
import { WebSocket } from "ws";
var NotificationService = class {
  wss = null;
  setWebSocketServer(wss) {
    this.wss = wss;
  }
  broadcastToClients(message) {
    if (!this.wss) return;
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
  // Create notification for new order (to restaurant)
  async notifyNewOrder(order, customer) {
    const customerName = customer ? `${customer.firstName} ${customer.lastName}`.trim() || customer.email : "Customer";
    await storage.createNotification({
      type: "order_new",
      title: `New Order #${order.id}`,
      message: `New order received from ${customerName} for $${order.total}. Total items: ${order.items ? JSON.parse(order.items).length : "N/A"}`,
      recipient: "restaurant",
      orderId: order.id,
      customerId: customer?.id,
      priority: "high"
    });
    console.log(`\u{1F4F1} SMS Alert to (470) 990-6345: New Order #${order.id} from ${customerName} - $${order.total}`);
    console.log(`\u{1F4E7} Email Alert to internationalkababhouse@gmail.com: New Order #${order.id} received`);
    this.broadcastToClients({
      type: "new_notification",
      notification: {
        type: "order_new",
        title: `New Order #${order.id}`,
        message: `New order from ${customerName} - $${order.total}`,
        orderId: order.id
      }
    });
  }
  // Generate order confirmation number for customer (no notification stored)
  generateOrderConfirmationNumber(orderId) {
    const timestamp2 = Date.now().toString().slice(-6);
    const orderPad = orderId.toString().padStart(3, "0");
    return `IKH${orderPad}${timestamp2}`;
  }
  // Create order status update notification (restaurant only)
  async notifyOrderStatusUpdate(order, newStatus, customerEmail) {
    await storage.createNotification({
      type: "order_update",
      title: `Order Status Changed #${order.id}`,
      message: `Order #${order.id} status updated to: ${newStatus}`,
      recipient: "restaurant",
      orderId: order.id,
      priority: "low"
    });
  }
  // Create catering inquiry notification
  async notifyNewCateringInquiry(cateringOrder) {
    await storage.createNotification({
      type: "catering_inquiry",
      title: "New Catering Inquiry",
      message: `Catering request for ${cateringOrder.guestCount} guests on ${cateringOrder.eventDate}. Contact: ${cateringOrder.customerEmail}`,
      recipient: "restaurant",
      recipientEmail: cateringOrder.customerEmail,
      priority: "high"
    });
  }
  // Create customer message notification
  async notifyCustomerMessage(name, email, subject) {
    await storage.createNotification({
      type: "customer_message",
      title: "New Customer Message",
      message: `Message from ${name} (${email}): ${subject}`,
      recipient: "restaurant",
      recipientEmail: email,
      priority: "normal"
    });
  }
  // Get restaurant notifications with count
  async getRestaurantNotifications(limit = 50) {
    const notifications2 = await storage.getRestaurantNotifications(limit);
    const unreadCount = await storage.getUnreadNotificationCount("restaurant");
    return {
      notifications: notifications2,
      unreadCount
    };
  }
  // Mark notification as read
  async markAsRead(notificationId) {
    return await storage.markNotificationAsRead(notificationId);
  }
};
var notificationService = new NotificationService();

// server/routes.ts
import { z } from "zod";
import Stripe from "stripe";
var stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  console.log("Stripe initialized successfully");
} else {
  console.warn("Stripe not configured: STRIPE_SECRET_KEY not provided. Payment functionality will be disabled.");
}
async function registerRoutes(app2) {
  app2.get("/api/health", async (req, res) => {
    try {
      const health = {
        status: "healthy",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
        version: "1.0.0",
        services: {
          database: "connected",
          // This could be enhanced with actual DB ping
          stripe: process.env.STRIPE_SECRET_KEY ? "configured" : "not configured",
          notifications: "operational"
        }
      };
      res.status(200).json(health);
    } catch (error) {
      res.status(503).json({
        status: "unhealthy",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/api/menu-items", async (req, res) => {
    try {
      const items = await storage.getAllMenuItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });
  app2.get("/api/menu-items/category/:category", async (req, res) => {
    try {
      const items = await storage.getMenuItemsByCategory(req.params.category);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items by category" });
    }
  });
  app2.get("/api/cart", async (req, res) => {
    try {
      const sessionId = req.query.sessionId;
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }
      const items = await storage.getCartItems(sessionId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });
  app2.get("/api/cart/:sessionId", async (req, res) => {
    try {
      const items = await storage.getCartItems(req.params.sessionId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });
  app2.post("/api/cart", async (req, res) => {
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
  app2.patch("/api/cart/:id", async (req, res) => {
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
  app2.delete("/api/cart/:id", async (req, res) => {
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
  app2.delete("/api/cart/session/:sessionId", async (req, res) => {
    try {
      await storage.clearCart(req.params.sessionId);
      res.json({ message: "Cart cleared" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });
  app2.post("/api/create-payment-intent", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({
          message: "Payment processing is not configured. Please contact the restaurant directly."
        });
      }
      const { amount, customerInfo, cartItems: cartItems2 } = req.body;
      if (!amount || amount < 0.5) {
        return res.status(400).json({ message: "Invalid amount" });
      }
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        // Convert to cents
        currency: "usd",
        automatic_payment_methods: {
          enabled: true
        },
        metadata: {
          restaurant: "International Kabab House",
          customerEmail: customerInfo?.email || "",
          customerName: customerInfo?.name || "",
          orderType: customerInfo?.orderType || "delivery",
          cartItems: JSON.stringify(cartItems2?.slice(0, 5) || [])
          // Limit metadata size
        }
      });
      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error) {
      console.error("Stripe payment intent error:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });
  app2.post("/api/send-email", async (req, res) => {
    try {
      const { to, subject, template, data } = req.body;
      console.log("Email would be sent:", { to, subject, template, data });
      setTimeout(() => {
        console.log(`Email sent successfully to ${to}`);
      }, 100);
      res.json({ success: true, message: "Email queued successfully" });
    } catch (error) {
      console.error("Email sending error:", error);
      res.status(500).json({ message: "Failed to send email" });
    }
  });
  app2.post("/api/analytics", async (req, res) => {
    try {
      const { event, category, label, value, userId, sessionId } = req.body;
      const analyticsData = {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        event,
        category,
        label,
        value,
        userId,
        sessionId,
        userAgent: req.get("User-Agent"),
        ip: req.ip
      };
      console.log("Analytics event:", analyticsData);
      res.json({ success: true });
    } catch (error) {
      console.error("Analytics error:", error);
      res.status(500).json({ message: "Analytics tracking failed" });
    }
  });
  app2.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      let customer = null;
      if (validatedData.customerEmail) {
        customer = await storage.getCustomerByEmail(validatedData.customerEmail);
      }
      await notificationService.notifyNewOrder(order, customer || void 0);
      const confirmationNumber = notificationService.generateOrderConfirmationNumber(order.id);
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
  app2.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      await notificationService.notifyCustomerMessage(
        `${validatedData.firstName} ${validatedData.lastName}`.trim(),
        validatedData.email,
        "New Contact Message"
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
  app2.post("/api/customers", async (req, res) => {
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
  app2.get("/api/customers/:id", async (req, res) => {
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
  app2.get("/api/customers/email/:email", async (req, res) => {
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
  app2.patch("/api/customers/:id/loyalty-points", async (req, res) => {
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
  app2.post("/api/reviews", async (req, res) => {
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
  app2.get("/api/reviews/menu-item/:menuItemId", async (req, res) => {
    try {
      const reviews2 = await storage.getReviewsByMenuItem(parseInt(req.params.menuItemId));
      res.json(reviews2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });
  app2.get("/api/reviews/customer/:customerId", async (req, res) => {
    try {
      const reviews2 = await storage.getReviewsByCustomer(parseInt(req.params.customerId));
      res.json(reviews2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer reviews" });
    }
  });
  app2.get("/api/reviews/public", async (req, res) => {
    try {
      const reviews2 = await storage.getPublicReviews();
      res.json(reviews2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch public reviews" });
    }
  });
  app2.post("/api/loyalty-transactions", async (req, res) => {
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
  app2.get("/api/loyalty-transactions/customer/:customerId", async (req, res) => {
    try {
      const transactions = await storage.getLoyaltyTransactionsByCustomer(parseInt(req.params.customerId));
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch loyalty transactions" });
    }
  });
  app2.post("/api/order-status", async (req, res) => {
    try {
      const validatedData = insertOrderStatusUpdateSchema.parse(req.body);
      const statusUpdate = await storage.createOrderStatusUpdate(validatedData);
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
  app2.get("/api/order-status/:orderId", async (req, res) => {
    try {
      const statusUpdates = await storage.getOrderStatusUpdates(parseInt(req.params.orderId));
      res.json(statusUpdates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order status" });
    }
  });
  app2.get("/api/order-status/:orderId/latest", async (req, res) => {
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
  app2.post("/api/analytics-events", async (req, res) => {
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
  app2.get("/api/analytics-events", async (req, res) => {
    try {
      const events = await storage.getAnalyticsEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics events" });
    }
  });
  app2.post("/api/catering-orders", async (req, res) => {
    try {
      const validatedData = insertCateringOrderSchema.parse(req.body);
      const order = await storage.createCateringOrder(validatedData);
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
  app2.get("/api/catering-orders", async (req, res) => {
    try {
      const orders2 = await storage.getAllCateringOrders();
      res.json(orders2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch catering orders" });
    }
  });
  app2.get("/api/catering-orders/:id", async (req, res) => {
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
  app2.get("/api/notifications/restaurant", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 50;
      const result = await notificationService.getRestaurantNotifications(limit);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });
  app2.patch("/api/notifications/:id/read", async (req, res) => {
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
  app2.get("/api/notifications/customer/:customerId", async (req, res) => {
    try {
      const notifications2 = await storage.getCustomerNotifications(parseInt(req.params.customerId));
      res.json(notifications2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer notifications" });
    }
  });
  const httpServer = createServer(app2);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  wss.on("connection", (ws2) => {
    console.log("Client connected to WebSocket");
    ws2.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === "subscribe") {
          console.log(`Client subscribed to ${data.channel}`);
        }
      } catch (error) {
        console.error("Invalid WebSocket message:", error);
      }
    });
    ws2.on("close", () => {
      console.log("Client disconnected from WebSocket");
    });
  });
  httpServer.wss = wss;
  notificationService.setWebSocketServer(wss);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "node:url";
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@assets": path.resolve(__dirname, "./attached_assets")
    }
  },
  build: {
    outDir: "dist/public"
  },
  server: {
    port: 5173,
    host: "0.0.0.0"
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();

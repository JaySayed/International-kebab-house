import { pgTable, text, serial, integer, decimal, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  image: text("image"),
  available: boolean("available").default(true),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  menuItemId: integer("menu_item_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  sessionId: text("session_id").notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  items: text("items").notNull(), // JSON string of order items
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  paymentIntentId: text("payment_intent_id"),
  createdAt: text("created_at").notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull(),
});

// Customer Management & Loyalty System
export const customers = pgTable("customers", {
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
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer Reviews System
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  orderId: integer("order_id"),
  menuItemId: integer("menu_item_id"),
  rating: integer("rating").notNull(), // 1-5 stars
  title: text("title"),
  comment: text("comment"),
  isVerifiedPurchase: boolean("is_verified_purchase").default(false),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Loyalty Points Transactions
export const loyaltyTransactions = pgTable("loyalty_transactions", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  orderId: integer("order_id"),
  points: integer("points").notNull(), // Can be positive (earned) or negative (redeemed)
  type: text("type").notNull(), // 'earned', 'redeemed', 'bonus', 'expired'
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Order Status Tracking
export const orderStatusUpdates = pgTable("order_status_updates", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  status: text("status").notNull(), // 'pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'
  message: text("message"),
  estimatedTime: text("estimated_time"), // e.g. "15-20 minutes"
  createdAt: timestamp("created_at").defaultNow(),
});

// Analytics & Business Intelligence
export const analyticsEvents = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(), // 'page_view', 'menu_view', 'add_to_cart', 'order_placed', 'payment_completed'
  customerId: integer("customer_id"),
  orderId: integer("order_id"),
  menuItemId: integer("menu_item_id"),
  sessionId: text("session_id"),
  metadata: text("metadata"), // JSON string for additional data
  createdAt: timestamp("created_at").defaultNow(),
});

// Catering Orders (Large Orders)
export const cateringOrders = pgTable("catering_orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  eventDate: text("event_date").notNull(),
  eventTime: text("event_time").notNull(),
  guestCount: integer("guest_count").notNull(),
  cateringOption: text("catering_option").notNull(), // 'option1', 'option2', 'option3', 'custom'
  specialRequests: text("special_requests"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications system for restaurant staff and customers
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'order_new', 'order_update', 'customer_message'
  title: text("title").notNull(),
  message: text("message").notNull(),
  recipient: text("recipient").notNull(), // 'restaurant', 'customer'
  recipientEmail: text("recipient_email"),
  orderId: integer("order_id"),
  customerId: integer("customer_id"),
  isRead: boolean("is_read").default(false),
  priority: text("priority").default("normal"), // 'high', 'normal', 'low'
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMenuItemSchema = createInsertSchema(menuItems);
export const insertCartItemSchema = createInsertSchema(cartItems);
export const insertOrderSchema = createInsertSchema(orders);
export const insertContactMessageSchema = createInsertSchema(contactMessages);
export const insertCustomerSchema = createInsertSchema(customers);
export const insertReviewSchema = createInsertSchema(reviews);
export const insertLoyaltyTransactionSchema = createInsertSchema(loyaltyTransactions);
export const insertOrderStatusUpdateSchema = createInsertSchema(orderStatusUpdates);
export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents);
export const insertCateringOrderSchema = createInsertSchema(cateringOrders);
export const insertNotificationSchema = createInsertSchema(notifications);

export type MenuItem = typeof menuItems.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type LoyaltyTransaction = typeof loyaltyTransactions.$inferSelect;
export type OrderStatusUpdate = typeof orderStatusUpdates.$inferSelect;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type CateringOrder = typeof cateringOrders.$inferSelect;
export type Notification = typeof notifications.$inferSelect;

export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type InsertLoyaltyTransaction = z.infer<typeof insertLoyaltyTransactionSchema>;
export type InsertOrderStatusUpdate = z.infer<typeof insertOrderStatusUpdateSchema>;
export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;
export type InsertCateringOrder = z.infer<typeof insertCateringOrderSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

// Relations
export const menuItemsRelations = relations(menuItems, ({ many }) => ({
  cartItems: many(cartItems),
  reviews: many(reviews),
  analyticsEvents: many(analyticsEvents),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  menuItem: one(menuItems, {
    fields: [cartItems.menuItemId],
    references: [menuItems.id],
  }),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  reviews: many(reviews),
  loyaltyTransactions: many(loyaltyTransactions),
  analyticsEvents: many(analyticsEvents),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  customer: one(customers, {
    fields: [reviews.customerId],
    references: [customers.id],
  }),
  order: one(orders, {
    fields: [reviews.orderId],
    references: [orders.id],
  }),
  menuItem: one(menuItems, {
    fields: [reviews.menuItemId],
    references: [menuItems.id],
  }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  statusUpdates: many(orderStatusUpdates),
  reviews: many(reviews),
  loyaltyTransactions: many(loyaltyTransactions),
  analyticsEvents: many(analyticsEvents),
}));

export const orderStatusUpdatesRelations = relations(orderStatusUpdates, ({ one }) => ({
  order: one(orders, {
    fields: [orderStatusUpdates.orderId],
    references: [orders.id],
  }),
}));

export const loyaltyTransactionsRelations = relations(loyaltyTransactions, ({ one }) => ({
  customer: one(customers, {
    fields: [loyaltyTransactions.customerId],
    references: [customers.id],
  }),
  order: one(orders, {
    fields: [loyaltyTransactions.orderId],
    references: [orders.id],
  }),
}));

export const analyticsEventsRelations = relations(analyticsEvents, ({ one }) => ({
  customer: one(customers, {
    fields: [analyticsEvents.customerId],
    references: [customers.id],
  }),
  order: one(orders, {
    fields: [analyticsEvents.orderId],
    references: [orders.id],
  }),
  menuItem: one(menuItems, {
    fields: [analyticsEvents.menuItemId],
    references: [menuItems.id],
  }),
}));

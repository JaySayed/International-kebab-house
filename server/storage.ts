import { 
  menuItems, 
  cartItems, 
  orders, 
  contactMessages,
  customers,
  reviews,
  loyaltyTransactions,
  orderStatusUpdates,
  analyticsEvents,
  cateringOrders,
  notifications,
  type MenuItem, 
  type CartItem, 
  type Order, 
  type ContactMessage,
  type Customer,
  type Review,
  type LoyaltyTransaction,
  type OrderStatusUpdate,
  type AnalyticsEvent,
  type CateringOrder,
  type Notification,
  type InsertMenuItem, 
  type InsertCartItem, 
  type InsertOrder, 
  type InsertContactMessage,
  type InsertCustomer,
  type InsertReview,
  type InsertLoyaltyTransaction,
  type InsertOrderStatusUpdate,
  type InsertAnalyticsEvent,
  type InsertCateringOrder,
  type InsertNotification
} from "../shared/schema";
import { db } from "./db";
import { eq, desc, and, count } from "drizzle-orm";

export interface IStorage {
  // Menu Items
  getAllMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(category: string): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  
  // Cart Items
  getCartItems(sessionId: string): Promise<(CartItem & { menuItem: MenuItem })[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
  
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  
  // Contact Messages
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  
  // Customer Management
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  getCustomer(id: number): Promise<Customer | undefined>;
  getCustomerByEmail(email: string): Promise<Customer | undefined>;
  updateCustomerLoyaltyPoints(id: number, points: number): Promise<Customer | undefined>;
  updateCustomerStats(id: number, orderTotal: number): Promise<Customer | undefined>;
  
  // Reviews System
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByMenuItem(menuItemId: number): Promise<Review[]>;
  getReviewsByCustomer(customerId: number): Promise<Review[]>;
  getPublicReviews(): Promise<Review[]>;
  
  // Loyalty Program
  createLoyaltyTransaction(transaction: InsertLoyaltyTransaction): Promise<LoyaltyTransaction>;
  getLoyaltyTransactionsByCustomer(customerId: number): Promise<LoyaltyTransaction[]>;
  
  // Order Status Tracking
  createOrderStatusUpdate(update: InsertOrderStatusUpdate): Promise<OrderStatusUpdate>;
  getOrderStatusUpdates(orderId: number): Promise<OrderStatusUpdate[]>;
  getLatestOrderStatus(orderId: number): Promise<OrderStatusUpdate | undefined>;
  
  // Analytics & Business Intelligence
  createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent>;
  getAnalyticsEvents(startDate?: Date, endDate?: Date): Promise<AnalyticsEvent[]>;
  
  // Catering Orders
  createCateringOrder(order: InsertCateringOrder): Promise<CateringOrder>;
  getCateringOrder(id: number): Promise<CateringOrder | undefined>;
  getAllCateringOrders(): Promise<CateringOrder[]>;
  
  // Notifications
  createNotification(notification: InsertNotification): Promise<Notification>;
  getRestaurantNotifications(limit?: number): Promise<Notification[]>;
  getCustomerNotifications(customerId: number): Promise<Notification[]>;
  markNotificationAsRead(id: number): Promise<boolean>;
  getUnreadNotificationCount(recipient: string): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  // Menu Items
  async getAllMenuItems(): Promise<MenuItem[]> {
    return await db.select().from(menuItems);
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    return await db.select().from(menuItems).where(eq(menuItems.category, category));
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    const [item] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return item || undefined;
  }

  // Cart Items
  async getCartItems(sessionId: string): Promise<(CartItem & { menuItem: MenuItem })[]> {
    return await db
      .select()
      .from(cartItems)
      .leftJoin(menuItems, eq(cartItems.menuItemId, menuItems.id))
      .where(eq(cartItems.sessionId, sessionId))
      .then((rows) =>
        rows.map((row) => ({
          ...row.cart_items,
          menuItem: row.menu_items!,
        }))
      );
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const [newCartItem] = await db
      .insert(cartItems)
      .values({
        ...item,
        quantity: item.quantity || 1,
      })
      .returning();
    return newCartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const [updated] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return updated || undefined;
  }

  async removeFromCart(id: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Orders
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db
      .insert(orders)
      .values({
        ...order,
        status: order.status || "pending",
      })
      .returning();
    return newOrder;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  // Contact Messages
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db
      .insert(contactMessages)
      .values({
        ...message,
        phone: message.phone || null,
      })
      .returning();
    return newMessage;
  }

  // Customer Management
  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer || undefined;
  }

  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.email, email));
    return customer || undefined;
  }

  async updateCustomerLoyaltyPoints(id: number, points: number): Promise<Customer | undefined> {
    const [updated] = await db
      .update(customers)
      .set({ loyaltyPoints: points })
      .where(eq(customers.id, id))
      .returning();
    return updated || undefined;
  }

  async updateCustomerStats(id: number, orderTotal: number): Promise<Customer | undefined> {
    // Get current customer data
    const customer = await this.getCustomer(id);
    if (!customer) return undefined;
    
    const [updated] = await db
      .update(customers)
      .set({ 
        totalOrders: (customer.totalOrders || 0) + 1,
        totalSpent: (parseFloat(customer.totalSpent || "0") + orderTotal).toFixed(2)
      })
      .where(eq(customers.id, id))
      .returning();
    return updated || undefined;
  }

  // Reviews System
  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  async getReviewsByMenuItem(menuItemId: number): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.menuItemId, menuItemId));
  }

  async getReviewsByCustomer(customerId: number): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.customerId, customerId));
  }

  async getPublicReviews(): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.isPublic, true));
  }

  // Loyalty Program
  async createLoyaltyTransaction(transaction: InsertLoyaltyTransaction): Promise<LoyaltyTransaction> {
    const [newTransaction] = await db.insert(loyaltyTransactions).values(transaction).returning();
    return newTransaction;
  }

  async getLoyaltyTransactionsByCustomer(customerId: number): Promise<LoyaltyTransaction[]> {
    return await db.select().from(loyaltyTransactions).where(eq(loyaltyTransactions.customerId, customerId));
  }

  // Order Status Tracking
  async createOrderStatusUpdate(update: InsertOrderStatusUpdate): Promise<OrderStatusUpdate> {
    const [newUpdate] = await db.insert(orderStatusUpdates).values(update).returning();
    return newUpdate;
  }

  async getOrderStatusUpdates(orderId: number): Promise<OrderStatusUpdate[]> {
    return await db.select().from(orderStatusUpdates).where(eq(orderStatusUpdates.orderId, orderId));
  }

  async getLatestOrderStatus(orderId: number): Promise<OrderStatusUpdate | undefined> {
    const [latest] = await db
      .select()
      .from(orderStatusUpdates)
      .where(eq(orderStatusUpdates.orderId, orderId))
      .orderBy(orderStatusUpdates.createdAt)
      .limit(1);
    return latest || undefined;
  }

  // Analytics & Business Intelligence
  async createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const [newEvent] = await db.insert(analyticsEvents).values(event).returning();
    return newEvent;
  }

  async getAnalyticsEvents(startDate?: Date, endDate?: Date): Promise<AnalyticsEvent[]> {
    // For now, return all events. Can add date filtering later
    return await db.select().from(analyticsEvents);
  }

  // Catering Orders
  async createCateringOrder(order: InsertCateringOrder): Promise<CateringOrder> {
    const [newOrder] = await db.insert(cateringOrders).values(order).returning();
    return newOrder;
  }

  async getCateringOrder(id: number): Promise<CateringOrder | undefined> {
    const [order] = await db.select().from(cateringOrders).where(eq(cateringOrders.id, id));
    return order || undefined;
  }

  async getAllCateringOrders(): Promise<CateringOrder[]> {
    return await db.select().from(cateringOrders);
  }

  // Notifications
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    return newNotification;
  }

  async getRestaurantNotifications(limit = 50): Promise<Notification[]> {
    return await db.select()
      .from(notifications)
      .where(eq(notifications.recipient, 'restaurant'))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);
  }

  async getCustomerNotifications(customerId: number): Promise<Notification[]> {
    return await db.select()
      .from(notifications)
      .where(and(
        eq(notifications.recipient, 'customer'),
        eq(notifications.customerId, customerId)
      ))
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationAsRead(id: number): Promise<boolean> {
    const result = await db.update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getUnreadNotificationCount(recipient: string): Promise<number> {
    const result = await db.select({ count: count() })
      .from(notifications)
      .where(and(
        eq(notifications.recipient, recipient),
        eq(notifications.isRead, false)
      ));
    return result[0]?.count || 0;
  }
}

export class MemStorage implements IStorage {
  private menuItems: Map<number, MenuItem>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private contactMessages: Map<number, ContactMessage>;
  private currentMenuItemId: number;
  private currentCartItemId: number;
  private currentOrderId: number;
  private currentContactMessageId: number;

  constructor() {
    this.menuItems = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.contactMessages = new Map();
    this.currentMenuItemId = 1;
    this.currentCartItemId = 1;
    this.currentOrderId = 1;
    this.currentContactMessageId = 1;
    
    // Initialize with sample menu items
    this.initializeMenuItems();
  }

  private initializeMenuItems() {
    const sampleItems: Omit<MenuItem, 'id'>[] = [
      {
        name: "Chicken Kabab",
        description: "Tender marinated chicken grilled to perfection, served with basmati rice",
        price: "14.99",
        category: "Kabab Specialties",
        image: null,
        available: true,
      },
      {
        name: "Beef Kabab",
        description: "Juicy beef kabab with special spices, served with naan bread",
        price: "16.99",
        category: "Kabab Specialties",
        image: null,
        available: true,
      },
      {
        name: "Lamb Kabab",
        description: "Premium lamb kabab with aromatic herbs, served with vegetables",
        price: "18.99",
        category: "Kabab Specialties",
        image: null,
        available: true,
      },
      {
        name: "Mixed Kabab Platter",
        description: "Combination of chicken, beef, and lamb kababs with rice and salad",
        price: "22.99",
        category: "Kabab Specialties",
        image: null,
        available: true,
      },
      {
        name: "Seekh Kabab",
        description: "Spiced ground meat kabab grilled on skewers, served with chutney",
        price: "13.99",
        category: "Kabab Specialties",
        image: null,
        available: true,
      },
      {
        name: "Fish Kabab",
        description: "Fresh fish marinated in spices and grilled, served with lemon rice",
        price: "15.99",
        category: "Kabab Specialties",
        image: null,
        available: true,
      },
      {
        name: "Uzbeki Pulao",
        description: "Aromatic basmati rice layered with tender lamb, carrots, and traditional spices",
        price: "22.99",
        category: "Rice Dishes",
        image: null,
        available: true,
      },
      {
        name: "Afghani Manto",
        description: "Steamed dumplings filled with seasoned beef, topped with yogurt and lentil sauce",
        price: "18.99",
        category: "Appetizers",
        image: null,
        available: true,
      },
    ];

    sampleItems.forEach(item => {
      const menuItem: MenuItem = { ...item, id: this.currentMenuItemId++ };
      this.menuItems.set(menuItem.id, menuItem);
    });
  }

  async getAllMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values());
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(item => item.category === category);
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async getCartItems(sessionId: string): Promise<(CartItem & { menuItem: MenuItem })[]> {
    const cartItemsList = Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
    const result: (CartItem & { menuItem: MenuItem })[] = [];
    
    for (const cartItem of cartItemsList) {
      const menuItem = this.menuItems.get(cartItem.menuItemId);
      if (menuItem) {
        result.push({ ...cartItem, menuItem });
      }
    }
    
    return result;
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.sessionId === insertItem.sessionId && item.menuItemId === insertItem.menuItemId
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity += (insertItem.quantity || 1);
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    } else {
      // Create new cart item
      const cartItem: CartItem = { 
        ...insertItem, 
        id: this.currentCartItemId++, 
        quantity: insertItem.quantity || 1 
      };
      this.cartItems.set(cartItem.id, cartItem);
      return cartItem;
    }
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (cartItem) {
      cartItem.quantity = quantity;
      this.cartItems.set(id, cartItem);
      return cartItem;
    }
    return undefined;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const cartItemsList = Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
    cartItemsList.forEach(item => this.cartItems.delete(item.id));
    return true;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const order: Order = { 
      ...insertOrder, 
      id: this.currentOrderId++, 
      status: insertOrder.status || "pending",
      paymentIntentId: insertOrder.paymentIntentId || null
    };
    this.orders.set(order.id, order);
    return order;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const message: ContactMessage = { 
      ...insertMessage, 
      id: this.currentContactMessageId++, 
      phone: insertMessage.phone || null 
    };
    this.contactMessages.set(message.id, message);
    return message;
  }

  // Stub implementations for new features (MemStorage is mainly for testing)
  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    throw new Error("MemStorage customer management not implemented");
  }
  async getCustomer(id: number): Promise<Customer | undefined> {
    return undefined;
  }
  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    return undefined;
  }
  async updateCustomerLoyaltyPoints(id: number, points: number): Promise<Customer | undefined> {
    return undefined;
  }
  async updateCustomerStats(id: number, orderTotal: number): Promise<Customer | undefined> {
    return undefined;
  }
  async createReview(review: InsertReview): Promise<Review> {
    throw new Error("MemStorage reviews not implemented");
  }
  async getReviewsByMenuItem(menuItemId: number): Promise<Review[]> {
    return [];
  }
  async getReviewsByCustomer(customerId: number): Promise<Review[]> {
    return [];
  }
  async getPublicReviews(): Promise<Review[]> {
    return [];
  }
  async createLoyaltyTransaction(transaction: InsertLoyaltyTransaction): Promise<LoyaltyTransaction> {
    throw new Error("MemStorage loyalty not implemented");
  }
  async getLoyaltyTransactionsByCustomer(customerId: number): Promise<LoyaltyTransaction[]> {
    return [];
  }
  async createOrderStatusUpdate(update: InsertOrderStatusUpdate): Promise<OrderStatusUpdate> {
    throw new Error("MemStorage order status not implemented");
  }
  async getOrderStatusUpdates(orderId: number): Promise<OrderStatusUpdate[]> {
    return [];
  }
  async getLatestOrderStatus(orderId: number): Promise<OrderStatusUpdate | undefined> {
    return undefined;
  }
  async createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    throw new Error("MemStorage analytics not implemented");
  }
  async getAnalyticsEvents(startDate?: Date, endDate?: Date): Promise<AnalyticsEvent[]> {
    return [];
  }
  async createCateringOrder(order: InsertCateringOrder): Promise<CateringOrder> {
    throw new Error("MemStorage catering not implemented");
  }
  async getCateringOrder(id: number): Promise<CateringOrder | undefined> {
    return undefined;
  }
  async getAllCateringOrders(): Promise<CateringOrder[]> {
    return [];
  }
  async createNotification(notification: InsertNotification): Promise<Notification> {
    throw new Error("MemStorage notifications not implemented");
  }
  async getRestaurantNotifications(limit?: number): Promise<Notification[]> {
    return [];
  }
  async getCustomerNotifications(customerId: number): Promise<Notification[]> {
    return [];
  }
  async markNotificationAsRead(id: number): Promise<boolean> {
    return false;
  }
  async getUnreadNotificationCount(recipient: string): Promise<number> {
    return 0;
  }
}

export const storage = new DatabaseStorage();

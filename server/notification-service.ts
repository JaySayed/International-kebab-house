import { storage } from "./storage";
import type { InsertNotification, Order, Customer } from "@shared/schema";
import { WebSocket } from "ws";

export class NotificationService {
  private wss: any = null;

  setWebSocketServer(wss: any) {
    this.wss = wss;
  }

  private broadcastToClients(message: any) {
    if (!this.wss) return;
    
    this.wss.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  // Create notification for new order (to restaurant)
  async notifyNewOrder(order: Order, customer?: Customer): Promise<void> {
    const customerName = customer ? `${customer.firstName} ${customer.lastName}`.trim() || customer.email : 'Customer';
    
    await storage.createNotification({
      type: 'order_new',
      title: `New Order #${order.id}`,
      message: `New order received from ${customerName} for $${order.total}. Total items: ${order.items ? JSON.parse(order.items).length : 'N/A'}`,
      recipient: 'restaurant',
      orderId: order.id,
      customerId: customer?.id,
      priority: 'high',
    });

    // Send SMS alert to store phone number (simulated)
    console.log(`📱 SMS Alert to (470) 990-6345: New Order #${order.id} from ${customerName} - $${order.total}`);
    
    // Send email alert to store email (simulated)
    console.log(`📧 Email Alert to internationalkababhouse@gmail.com: New Order #${order.id} received`);

    // Broadcast real-time update to connected clients
    this.broadcastToClients({
      type: 'new_notification',
      notification: {
        type: 'order_new',
        title: `New Order #${order.id}`,
        message: `New order from ${customerName} - $${order.total}`,
        orderId: order.id
      }
    });
  }

  // Generate order confirmation number for customer (no notification stored)
  generateOrderConfirmationNumber(orderId: number): string {
    // Create a confirmation number based on order ID and timestamp
    const timestamp = Date.now().toString().slice(-6);
    const orderPad = orderId.toString().padStart(3, '0');
    return `IKH${orderPad}${timestamp}`;
  }

  // Create order status update notification (restaurant only)
  async notifyOrderStatusUpdate(order: Order, newStatus: string, customerEmail?: string): Promise<void> {
    // Only notify restaurant for tracking (no customer notifications)
    await storage.createNotification({
      type: 'order_update',
      title: `Order Status Changed #${order.id}`,
      message: `Order #${order.id} status updated to: ${newStatus}`,
      recipient: 'restaurant',
      orderId: order.id,
      priority: 'low',
    });
  }

  // Create catering inquiry notification
  async notifyNewCateringInquiry(cateringOrder: any): Promise<void> {
    await storage.createNotification({
      type: 'catering_inquiry',
      title: 'New Catering Inquiry',
      message: `Catering request for ${cateringOrder.guestCount} guests on ${cateringOrder.eventDate}. Contact: ${cateringOrder.customerEmail}`,
      recipient: 'restaurant',
      recipientEmail: cateringOrder.customerEmail,
      priority: 'high',
    });
  }

  // Create customer message notification
  async notifyCustomerMessage(name: string, email: string, subject: string): Promise<void> {
    await storage.createNotification({
      type: 'customer_message',
      title: 'New Customer Message',
      message: `Message from ${name} (${email}): ${subject}`,
      recipient: 'restaurant',
      recipientEmail: email,
      priority: 'normal',
    });
  }

  // Get restaurant notifications with count
  async getRestaurantNotifications(limit = 50) {
    const notifications = await storage.getRestaurantNotifications(limit);
    const unreadCount = await storage.getUnreadNotificationCount('restaurant');
    
    return {
      notifications,
      unreadCount,
    };
  }

  // Mark notification as read
  async markAsRead(notificationId: number): Promise<boolean> {
    return await storage.markNotificationAsRead(notificationId);
  }
}

export const notificationService = new NotificationService();
import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY not provided - email notifications will be disabled");
}

const mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailTemplate {
  to: string;
  from: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailNotificationService {
  private readonly fromEmail = 'orders@internationalkababhouse.com';
  
  async sendEmail(template: EmailTemplate): Promise<boolean> {
    if (!process.env.SENDGRID_API_KEY) {
      console.log(`[EMAIL DISABLED] Would send: ${template.subject} to ${template.to}`);
      return true; // Return success for demo purposes
    }

    try {
      await mailService.send({
        to: template.to,
        from: template.from,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
      console.log(`Email sent successfully: ${template.subject} to ${template.to}`);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  // Order confirmation email
  async sendOrderConfirmation(customerEmail: string, orderDetails: any): Promise<boolean> {
    const template: EmailTemplate = {
      to: customerEmail,
      from: this.fromEmail,
      subject: `Order Confirmation #${orderDetails.id} - International Kabab House`,
      html: this.generateOrderConfirmationHTML(orderDetails),
      text: this.generateOrderConfirmationText(orderDetails),
    };

    return this.sendEmail(template);
  }

  // Order status update email
  async sendOrderStatusUpdate(customerEmail: string, orderDetails: any, newStatus: string): Promise<boolean> {
    const statusMessages = {
      'confirmed': 'Your order has been confirmed and we\'re preparing your delicious meal!',
      'preparing': 'Our chefs are now preparing your authentic Afghan cuisine.',
      'ready': 'Great news! Your order is ready for pickup.',
      'out_for_delivery': 'Your food is on its way to you!',
      'delivered': 'Your order has been delivered. Enjoy your meal!',
    };

    const template: EmailTemplate = {
      to: customerEmail,
      from: this.fromEmail,
      subject: `Order Update #${orderDetails.id} - ${newStatus.replace('_', ' ').toUpperCase()}`,
      html: this.generateOrderStatusHTML(orderDetails, newStatus, statusMessages[newStatus as keyof typeof statusMessages]),
      text: `Order #${orderDetails.id} Status Update: ${statusMessages[newStatus as keyof typeof statusMessages]}`,
    };

    return this.sendEmail(template);
  }

  // Welcome email for loyalty program
  async sendWelcomeEmail(customerEmail: string, customerName: string): Promise<boolean> {
    const template: EmailTemplate = {
      to: customerEmail,
      from: this.fromEmail,
      subject: 'Welcome to International Kabab House Loyalty Program!',
      html: this.generateWelcomeHTML(customerName),
      text: `Welcome ${customerName}! Thank you for joining our loyalty program. You've earned 100 welcome points!`,
    };

    return this.sendEmail(template);
  }

  // Catering inquiry confirmation
  async sendCateringConfirmation(customerEmail: string, cateringDetails: any): Promise<boolean> {
    const template: EmailTemplate = {
      to: customerEmail,
      from: this.fromEmail,
      subject: 'Catering Inquiry Received - International Kabab House',
      html: this.generateCateringConfirmationHTML(cateringDetails),
      text: `Thank you for your catering inquiry. We'll contact you within 24 hours to discuss your event.`,
    };

    return this.sendEmail(template);
  }

  // Abandoned cart reminder
  async sendAbandonedCartReminder(customerEmail: string, cartItems: any[]): Promise<boolean> {
    const template: EmailTemplate = {
      to: customerEmail,
      from: this.fromEmail,
      subject: 'Don\'t forget your delicious Afghan meal!',
      html: this.generateAbandonedCartHTML(cartItems),
      text: 'You have items waiting in your cart. Complete your order to enjoy authentic Afghan cuisine!',
    };

    return this.sendEmail(template);
  }

  // Private template generation methods
  private generateOrderConfirmationHTML(orderDetails: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; }
          .btn { background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍽️ Order Confirmed!</h1>
            <p>Thank you for choosing International Kabab House</p>
          </div>
          <div class="content">
            <h2>Order #${orderDetails.id}</h2>
            <div class="order-details">
              <p><strong>Total:</strong> $${orderDetails.total}</p>
              <p><strong>Status:</strong> ${orderDetails.status}</p>
              <p><strong>Estimated delivery:</strong> 30-45 minutes</p>
            </div>
            <p>We're preparing your authentic Afghan cuisine with care and love. You'll receive updates as your order progresses.</p>
            <p style="text-align: center;">
              <a href="https://internationalkababhouse.com/orders/${orderDetails.id}" class="btn">Track Your Order</a>
            </p>
          </div>
          <div class="footer">
            <p>International Kabab House<br>
            📞 (555) 123-4567 | 📧 orders@internationalkababhouse.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateOrderConfirmationText(orderDetails: any): string {
    return `
      ORDER CONFIRMED - International Kabab House
      
      Thank you for your order!
      
      Order #${orderDetails.id}
      Total: $${orderDetails.total}
      Status: ${orderDetails.status}
      Estimated delivery: 30-45 minutes
      
      Track your order: https://internationalkababhouse.com/orders/${orderDetails.id}
      
      Questions? Call us at (555) 123-4567
      
      International Kabab House
      Authentic Afghan & Middle Eastern Cuisine
    `;
  }

  private generateOrderStatusHTML(orderDetails: any, status: string, message: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .status-update { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📦 Order Update</h1>
            <p>Order #${orderDetails.id}</p>
          </div>
          <div class="content">
            <div class="status-update">
              <h2>Status: ${status.replace('_', ' ').toUpperCase()}</h2>
              <p>${message}</p>
            </div>
            <p>Thank you for choosing International Kabab House for your authentic Afghan dining experience!</p>
          </div>
          <div class="footer">
            <p>International Kabab House<br>
            📞 (555) 123-4567 | 📧 orders@internationalkababhouse.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateWelcomeHTML(customerName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .welcome-bonus { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px solid #f59e0b; }
          .footer { text-align: center; padding: 20px; color: #666; }
          .btn { background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Our Family!</h1>
            <p>International Kabab House Loyalty Program</p>
          </div>
          <div class="content">
            <h2>Welcome, ${customerName}!</h2>
            <div class="welcome-bonus">
              <h3>🎁 Welcome Bonus</h3>
              <p><strong>100 Points Added to Your Account!</strong></p>
              <p>Start earning rewards with every order</p>
            </div>
            <p>Thank you for joining our loyalty program! Enjoy exclusive benefits, special discounts, and earn points with every order of our authentic Afghan cuisine.</p>
            <p style="text-align: center;">
              <a href="https://internationalkababhouse.com/loyalty-program" class="btn">View Your Account</a>
            </p>
          </div>
          <div class="footer">
            <p>International Kabab House<br>
            📞 (470) 990-6345 | 📧 internationalkababhouse@gmail.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateCateringConfirmationHTML(cateringDetails: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .catering-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍽️ Catering Inquiry Received</h1>
            <p>International Kabab House</p>
          </div>
          <div class="content">
            <h2>Thank you for your catering interest!</h2>
            <div class="catering-details">
              <p><strong>Event Date:</strong> ${cateringDetails.eventDate}</p>
              <p><strong>Guest Count:</strong> ${cateringDetails.guestCount}</p>
              <p><strong>Event Type:</strong> ${cateringDetails.eventType}</p>
            </div>
            <p>We're excited to help make your event memorable with our authentic Afghan cuisine! Our catering specialist will contact you within 24 hours to discuss your requirements and provide a customized quote.</p>
            <p>We look forward to serving you and your guests!</p>
          </div>
          <div class="footer">
            <p>International Kabab House Catering<br>
            📞 (555) 123-4567 | 📧 catering@internationalkababhouse.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateAbandonedCartHTML(cartItems: any[]): string {
    const itemsList = cartItems.map(item => 
      `<li>${item.name} (${item.quantity}x) - $${(item.price * item.quantity).toFixed(2)}</li>`
    ).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .cart-items { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; }
          .btn { background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍽️ Your Afghan Feast Awaits!</h1>
            <p>Complete your order</p>
          </div>
          <div class="content">
            <h2>Don't miss out on these delicious items:</h2>
            <div class="cart-items">
              <ul>${itemsList}</ul>
            </div>
            <p>Your authentic Afghan meal is just one click away! Complete your order now and satisfy your craving for our delicious cuisine.</p>
            <p style="text-align: center;">
              <a href="https://internationalkababhouse.com/cart" class="btn">Complete My Order</a>
            </p>
          </div>
          <div class="footer">
            <p>International Kabab House<br>
            📞 (555) 123-4567 | 📧 orders@internationalkababhouse.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export const emailService = new EmailNotificationService();
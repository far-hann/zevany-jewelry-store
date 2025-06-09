const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Create transporter
const createTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    // Production email service (e.g., SendGrid, Mailgun, AWS SES)
    return nodemailer.createTransporter({
      service: 'gmail', // or your preferred service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  } else {
    // Development - use Ethereal Email for testing
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.EMAIL_USER || 'ethereal_user',
        pass: process.env.EMAIL_PASSWORD || 'ethereal_password'
      }
    });
  }
};

// Send email verification
const sendEmailVerification = async (email, verificationToken) => {
  try {
    const transporter = createTransporter();
    
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: `"Zevany Store" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Verify Your Email - Zevany Store',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin-bottom: 10px;">Welcome to Zevany Store!</h1>
            <p style="color: #666; font-size: 16px;">Please verify your email address to complete your registration</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
            <p style="margin-bottom: 20px; color: #333;">Click the button below to verify your email address:</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" 
                 style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: 600;">
                Verify Email Address
              </a>
            </div>
            <p style="margin-top: 20px; color: #666; font-size: 14px;">
              Or copy and paste this link in your browser:<br>
              <a href="${verificationUrl}" style="color: #007bff; word-break: break-all;">${verificationUrl}</a>
            </p>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 14px;">
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account with Zevany Store, please ignore this email.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', email);
  } catch (error) {
    console.error('Send verification email error:', error);
    throw new Error('Failed to send verification email');
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"Zevany Store" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Password Reset Request - Zevany Store',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin-bottom: 10px;">Password Reset Request</h1>
            <p style="color: #666; font-size: 16px;">We received a request to reset your password</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
            <p style="margin-bottom: 20px; color: #333;">Click the button below to reset your password:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" 
                 style="background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: 600;">
                Reset Password
              </a>
            </div>
            <p style="margin-top: 20px; color: #666; font-size: 14px;">
              Or copy and paste this link in your browser:<br>
              <a href="${resetUrl}" style="color: #dc3545; word-break: break-all;">${resetUrl}</a>
            </p>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 14px;">
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request a password reset, please ignore this email.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', email);
  } catch (error) {
    console.error('Send password reset email error:', error);
    throw new Error('Failed to send password reset email');
  }
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (email, order) => {
  try {
    const transporter = createTransporter();
    
    const orderItemsHtml = order.orderItems.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');
    
    const mailOptions = {
      from: `"Zevany Store" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin-bottom: 10px;">Order Confirmed!</h1>
            <p style="color: #666; font-size: 16px;">Thank you for your order</p>
            <p style="color: #007bff; font-size: 18px; font-weight: 600;">Order #${order.orderNumber}</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #333; margin-bottom: 15px;">Order Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #e9ecef;">
                  <th style="padding: 10px; text-align: left;">Image</th>
                  <th style="padding: 10px; text-align: left;">Product</th>
                  <th style="padding: 10px; text-align: center;">Qty</th>
                  <th style="padding: 10px; text-align: right;">Price</th>
                  <th style="padding: 10px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderItemsHtml}
              </tbody>
            </table>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #007bff;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Subtotal:</span>
                <span>$${order.itemsPrice.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Shipping:</span>
                <span>$${order.shippingPrice.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Tax:</span>
                <span>$${order.taxPrice.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 18px; color: #007bff;">
                <span>Total:</span>
                <span>$${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #333; margin-bottom: 15px;">Shipping Address</h3>
            <p style="margin: 0; color: #666;">
              ${order.shippingAddress.name}<br>
              ${order.shippingAddress.street}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
              ${order.shippingAddress.country}
            </p>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 14px;">
            <p>We'll send you tracking information once your order ships.</p>
            <p>Questions? Contact us at support@zevanystore.com</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent to:', email);
  } catch (error) {
    console.error('Send order confirmation email error:', error);
    throw new Error('Failed to send order confirmation email');
  }
};

// Send order status update email
const sendOrderStatusUpdateEmail = async (email, order) => {
  try {
    const transporter = createTransporter();
    
    const statusMessages = {
      processing: 'Your order is being processed',
      shipped: 'Your order has been shipped',
      delivered: 'Your order has been delivered',
      cancelled: 'Your order has been cancelled',
      refunded: 'Your refund has been processed'
    };
    
    const statusColors = {
      processing: '#ffc107',
      shipped: '#17a2b8',
      delivered: '#28a745',
      cancelled: '#dc3545',
      refunded: '#6c757d'
    };
    
    const mailOptions = {
      from: `"Zevany Store" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: `Order Update - ${order.orderNumber}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin-bottom: 10px;">Order Update</h1>
            <p style="color: #666; font-size: 16px;">Order #${order.orderNumber}</p>
          </div>
          
          <div style="background: ${statusColors[order.status]}; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
            <h2 style="margin: 0; font-size: 24px;">${statusMessages[order.status]}</h2>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
          </div>
          
          ${order.trackingNumber ? `
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
              <h3 style="color: #333; margin-bottom: 15px;">Tracking Information</h3>
              <p style="font-size: 18px; color: #007bff; font-weight: 600;">${order.trackingNumber}</p>
              <p style="color: #666;">Use this tracking number to follow your package</p>
            </div>
          ` : ''}
          
          <div style="text-align: center; color: #666; font-size: 14px;">
            <p>Questions? Contact us at support@zevanystore.com</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Order status update email sent to:', email);
  } catch (error) {
    console.error('Send order status email error:', error);
    throw new Error('Failed to send order status update email');
  }
};

// Send contact inquiry response
const sendContactInquiryResponse = async (email, name, inquiry) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Zevany Store" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Thank you for contacting Zevany Store',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin-bottom: 10px;">Thank You for Contacting Us!</h1>
            <p style="color: #666; font-size: 16px;">We've received your inquiry</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <p style="color: #333; margin-bottom: 15px;">Dear ${name},</p>
            <p style="color: #666; margin-bottom: 15px;">
              Thank you for reaching out to Zevany Store. We've received your inquiry and our team will get back to you within 24 hours.
            </p>
            <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #007bff;">
              <h4 style="margin: 0 0 10px 0; color: #333;">Your Message:</h4>
              <p style="margin: 0; color: #666;">${inquiry}</p>
            </div>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 14px;">
            <p>Best regards,<br>The Zevany Store Team</p>
            <p>Email: support@zevanystore.com</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Contact inquiry response sent to:', email);
  } catch (error) {
    console.error('Send contact inquiry response error:', error);
    throw new Error('Failed to send contact inquiry response');
  }
};

// Send admin order notification email
const sendAdminOrderNotification = async (order, customerEmail) => {
  try {
    const transporter = createTransporter();
    
    const orderItemsHtml = order.order_items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.qty}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.qty).toFixed(2)}</td>
      </tr>
    `).join('');
    
    const shippingAddress = JSON.parse(order.shipping_address);
    
    const mailOptions = {
      from: `"Zevany Store" <${process.env.EMAIL_FROM}>`,
      to: 'farhanzeb7262@gmail.com', // Admin email
      subject: `New Order Received - Order #${order.id}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px; background: #dc3545; color: white; padding: 20px; border-radius: 8px;">
            <h1 style="color: white; margin-bottom: 10px;">🛍️ New Order Alert!</h1>
            <p style="color: white; font-size: 16px; margin: 0;">A new order has been placed on Zevany Store</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #333; margin-bottom: 15px;">Order Details</h2>
            <div style="margin-bottom: 15px;">
              <strong>Order ID:</strong> ${order.id}<br>
              <strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString()}<br>
              <strong>Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}<br>
              <strong>Payment Method:</strong> ${order.payment_method}
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #333; margin-bottom: 15px;">Customer Information</h3>
            <div>
              <strong>Email:</strong> ${customerEmail}<br>
              <strong>Name:</strong> ${shippingAddress.name || 'N/A'}<br>
              <strong>Phone:</strong> ${shippingAddress.phone || 'N/A'}
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #333; margin-bottom: 15px;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #e9ecef;">
                  <th style="padding: 10px; text-align: left;">Product</th>
                  <th style="padding: 10px; text-align: center;">Qty</th>
                  <th style="padding: 10px; text-align: right;">Price</th>
                  <th style="padding: 10px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderItemsHtml}
              </tbody>
            </table>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #dc3545;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Subtotal:</span>
                <span>$${order.items_price.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Shipping:</span>
                <span>$${order.shipping_price.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Tax:</span>
                <span>$${order.tax_price.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 18px; color: #dc3545;">
                <span>Total:</span>
                <span>$${order.total_price.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #333; margin-bottom: 15px;">Shipping Address</h3>
            <p style="margin: 0; color: #666;">
              ${shippingAddress.name}<br>
              ${shippingAddress.street}<br>
              ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}<br>
              ${shippingAddress.country}
            </p>
          </div>
          
          <div style="text-align: center; background: #007bff; color: white; padding: 20px; border-radius: 8px;">
            <h3 style="color: white; margin-bottom: 15px;">Next Steps</h3>
            <p style="color: white; margin: 0;">
              ✅ Process the order in your admin dashboard<br>
              📦 Prepare items for shipping<br>
              📧 Update customer with tracking information
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Admin order notification sent for order:', order.id);
  } catch (error) {
    console.error('Send admin order notification error:', error);
    throw new Error('Failed to send admin order notification');
  }
};

module.exports = {
  sendEmailVerification,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
  sendContactInquiryResponse,
  sendAdminOrderNotification
};

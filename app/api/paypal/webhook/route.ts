import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// PayPal webhook event types
interface PayPalPaymentData {
  id?: string;
  status?: string;
  amount?: {
    value?: string;
    currency_code?: string;
  };
  payer?: {
    email_address?: string;
  };
  reason_code?: string;
}

interface PayPalWebhookEvent {
  event_type: string;
  resource: PayPalPaymentData;
}

// Email configuration
const createTransporter = () => {
  // Always use Gmail for real email sending
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send email notification
const sendPaymentNotification = async (eventType: string, paymentData: PayPalPaymentData) => {
  try {
    const transporter = createTransporter();
    
    let subject = '';
    let htmlContent = '';
    
    switch (eventType) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        subject = '💰 Payment Received - ZEVANY Store';
        htmlContent = `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #28a745; margin-bottom: 10px;">✅ Payment Received!</h1>
              <p style="color: #666; font-size: 16px;">A new payment has been successfully processed</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
              <h3 style="color: #333; margin-bottom: 20px;">Payment Details:</h3>
              <p><strong>Transaction ID:</strong> ${paymentData.id || 'N/A'}</p>
              <p><strong>Amount:</strong> $${paymentData.amount?.value || 'N/A'} ${paymentData.amount?.currency_code || 'USD'}</p>
              <p><strong>Status:</strong> ${paymentData.status || 'N/A'}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>Payer Email:</strong> ${paymentData.payer?.email_address || 'N/A'}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #666; font-size: 14px;">ZEVANY Luxury Jewelry Store</p>
            </div>
          </div>
        `;
        break;
        
      case 'PAYMENT.CAPTURE.DENIED':
        subject = '❌ Payment Denied - ZEVANY Store';
        htmlContent = `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #dc3545; margin-bottom: 10px;">❌ Payment Denied</h1>
              <p style="color: #666; font-size: 16px;">A payment attempt was denied</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
              <h3 style="color: #333; margin-bottom: 20px;">Payment Details:</h3>
              <p><strong>Transaction ID:</strong> ${paymentData.id || 'N/A'}</p>
              <p><strong>Amount:</strong> $${paymentData.amount?.value || 'N/A'} ${paymentData.amount?.currency_code || 'USD'}</p>
              <p><strong>Status:</strong> ${paymentData.status || 'N/A'}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>Reason:</strong> ${paymentData.reason_code || 'Unknown'}</p>
            </div>
          </div>
        `;
        break;
        
      case 'PAYMENT.CAPTURE.REFUNDED':
        subject = '🔄 Payment Refunded - ZEVANY Store';
        htmlContent = `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #ffc107; margin-bottom: 10px;">🔄 Payment Refunded</h1>
              <p style="color: #666; font-size: 16px;">A refund has been processed</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
              <h3 style="color: #333; margin-bottom: 20px;">Refund Details:</h3>
              <p><strong>Refund ID:</strong> ${paymentData.id || 'N/A'}</p>
              <p><strong>Amount:</strong> $${paymentData.amount?.value || 'N/A'} ${paymentData.amount?.currency_code || 'USD'}</p>
              <p><strong>Status:</strong> ${paymentData.status || 'N/A'}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            </div>
          </div>
        `;
        break;
    }
    
    const mailOptions = {
      from: `"ZEVANY Store" <${process.env.EMAIL_FROM || 'noreply@zevany.com'}>`,
      to: process.env.ADMIN_EMAIL || 'admin@zevany.com',
      subject: subject,
      html: htmlContent
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email notification sent for ${eventType}`);
    
  } catch (error) {
    console.error('❌ Failed to send email notification:', error);
  }
};

// PayPal webhook handler for Next.js API routes
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const webhookEvent: PayPalWebhookEvent = JSON.parse(body);
    
    // Get headers for signature verification (currently unused but needed for future verification)
    // const headers = {
    //   'paypal-transmission-id': request.headers.get('paypal-transmission-id'),
    //   'paypal-cert-id': request.headers.get('paypal-cert-id'),
    //   'paypal-auth-algo': request.headers.get('paypal-auth-algo'),
    //   'paypal-transmission-time': request.headers.get('paypal-transmission-time'),
    //   'paypal-transmission-sig': request.headers.get('paypal-transmission-sig'),
    // };

    console.log('PayPal webhook received:', webhookEvent.event_type);// In production, you should verify the webhook signature here
    // For now, we'll just log the event
    
    const eventType = webhookEvent.event_type;
    const paymentData = webhookEvent.resource;
    
    switch (eventType) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        console.log('Payment completed:', paymentData.id);
        // Send email notification for successful payment
        await sendPaymentNotification(eventType, paymentData);
        // Handle payment completion
        break;
      case 'PAYMENT.CAPTURE.DENIED':
        console.log('Payment denied:', paymentData.id);
        // Send email notification for denied payment
        await sendPaymentNotification(eventType, paymentData);
        // Handle payment denial
        break;
      case 'PAYMENT.CAPTURE.REFUNDED':
        console.log('Payment refunded:', paymentData.id);
        // Send email notification for refund
        await sendPaymentNotification(eventType, paymentData);
        // Handle refund
        break;
      default:
        console.log(`Unhandled PayPal webhook event: ${eventType}`);
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('PayPal webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

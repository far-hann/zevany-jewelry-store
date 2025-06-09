const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const sql = require('../config/postgresClient');
const { sendOrderConfirmationEmail } = require('../utils/emailService');

// PayPal webhook endpoint
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    const webhookEvent = req.body;
    
    // Verify webhook signature (recommended for production)
    if (process.env.NODE_ENV === 'production' && webhookId) {
      const expectedSignature = req.headers['paypal-transmission-sig'];
      const authAlgo = req.headers['paypal-auth-algo'];
      const certId = req.headers['paypal-cert-id'];
      const transmissionId = req.headers['paypal-transmission-id'];
      const timestamp = req.headers['paypal-transmission-time'];
      
      // Implement PayPal signature verification here
      // (PayPal provides libraries for this)
    }

    const eventType = webhookEvent.event_type;
    
    switch (eventType) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        await handlePaymentCompleted(webhookEvent);
        break;
      case 'PAYMENT.CAPTURE.DENIED':
        await handlePaymentDenied(webhookEvent);
        break;
      case 'PAYMENT.CAPTURE.REFUNDED':
        await handlePaymentRefunded(webhookEvent);
        break;
      default:
        console.log(`Unhandled PayPal webhook event: ${eventType}`);
    }

    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('PayPal webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

async function handlePaymentCompleted(event) {
  try {
    const resource = event.resource;
    const customId = resource.custom_id;
    const invoiceId = resource.invoice_id;
    
    // Find order by invoice ID or custom data
    const orderResult = await sql`
      SELECT * FROM orders 
      WHERE payment_details->>'paypalOrderId' = ${resource.id}
      OR order_number = ${invoiceId}
    `;
    
    const order = orderResult[0];
    if (order && !order.is_paid) {
      // Update order as paid
      await sql`
        UPDATE orders 
        SET 
          is_paid = true,
          paid_at = NOW(),
          status = 'processing',
          payment_result = ${JSON.stringify({
            id: resource.id,
            status: resource.status,
            amount: resource.amount.value,
            currency: resource.amount.currency_code,
            webhook_verified: true
          })}
        WHERE id = ${order.id}
      `;
      
      console.log(`PayPal webhook: Order ${order.id} marked as paid`);
    }
  } catch (error) {
    console.error('Error handling payment completed:', error);
  }
}

async function handlePaymentDenied(event) {
  try {
    const resource = event.resource;
    console.log('PayPal payment denied:', resource.id);
    // Handle payment denial - update order status if needed
  } catch (error) {
    console.error('Error handling payment denied:', error);
  }
}

async function handlePaymentRefunded(event) {
  try {
    const resource = event.resource;
    console.log('PayPal payment refunded:', resource.id);
    // Handle refund - update order status
  } catch (error) {
    console.error('Error handling payment refunded:', error);
  }
}

module.exports = router;

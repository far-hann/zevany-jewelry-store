const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { protect } = require('../middleware/auth');
const sql = require('../config/postgresClient');

// @desc    Create payment intent
// @route   POST /api/payment/create-intent
// @access  Private
router.post('/create-intent', protect, async (req, res) => {
  try {
    const { amount, currency = 'usd', orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }    // Verify order belongs to user
    if (orderId) {
      const orderResult = await sql`SELECT * FROM orders WHERE id = ${orderId} AND user_id = ${req.user.id}`;
      const order = orderResult[0];
      if (!order) {
        return res.status(403).json({
          success: false,
          message: 'Order not found or unauthorized'
        });
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: req.user.id,
        orderId: orderId || ''
      }
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    });
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment processing error'
    });
  }
});

// @desc    Confirm payment
// @route   POST /api/payment/confirm
// @access  Private
router.post('/confirm', protect, async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID required'
      });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }

    // Update order if provided
    if (orderId) {
      const order = await Order.findById(orderId);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      if (order.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency
      };
      order.status = 'processing';
      order.statusHistory.push({
        status: 'processing',
        timestamp: new Date(),
        note: 'Payment confirmed via Stripe'
      });

      await order.save();
    }

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      data: {
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100
        }
      }
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment confirmation error'
    });
  }
});

// @desc    Process refund
// @route   POST /api/payment/refund
// @access  Private/Admin
router.post('/refund', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'super-admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { orderId, amount, reason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (!order.isPaid || !order.paymentResult?.id) {
      return res.status(400).json({
        success: false,
        message: 'Order is not paid or payment info missing'
      });
    }

    // Create refund with Stripe
    const refund = await stripe.refunds.create({
      payment_intent: order.paymentResult.id,
      amount: amount ? Math.round(amount * 100) : undefined, // Partial or full refund
      reason: reason || 'requested_by_customer'
    });

    // Update order
    order.status = 'refunded';
    order.refundedAt = new Date();
    order.refundAmount = refund.amount / 100;
    order.statusHistory.push({
      status: 'refunded',
      timestamp: new Date(),
      note: `Refunded $${refund.amount / 100}: ${reason || 'No reason provided'}`
    });

    await order.save();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status
      }
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Refund processing error'
    });
  }
});

// @desc    Webhook endpoint for Stripe events
// @route   POST /api/payment/webhook
// @access  Public (but verified)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        
        // Update order status if metadata contains orderId
        if (paymentIntent.metadata.orderId) {
          const order = await Order.findById(paymentIntent.metadata.orderId);
          if (order && !order.isPaid) {
            order.isPaid = true;
            order.paidAt = new Date();
            order.paymentResult = {
              id: paymentIntent.id,
              status: paymentIntent.status,
              amount: paymentIntent.amount / 100,
              currency: paymentIntent.currency
            };
            order.status = 'processing';
            order.statusHistory.push({
              status: 'processing',
              timestamp: new Date(),
              note: 'Payment confirmed via webhook'
            });
            await order.save();
          }
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);
        
        // Update order status if needed
        if (failedPayment.metadata.orderId) {
          const order = await Order.findById(failedPayment.metadata.orderId);
          if (order) {
            order.statusHistory.push({
              status: order.status,
              timestamp: new Date(),
              note: 'Payment failed'
            });
            await order.save();
          }
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// @desc    Get payment methods for user
// @route   GET /api/payment/methods
// @access  Private
router.get('/methods', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.stripeCustomerId) {
      return res.json({
        success: true,
        data: []
      });
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: 'card',
    });

    res.json({
      success: true,
      data: paymentMethods.data.map(method => ({
        id: method.id,
        brand: method.card.brand,
        last4: method.card.last4,
        expMonth: method.card.exp_month,
        expYear: method.card.exp_year
      }))
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve payment methods'
    });
  }
});

module.exports = router;

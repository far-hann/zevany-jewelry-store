const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const sql = require('../config/postgresClient');
const { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail, sendAdminOrderNotification } = require('../utils/emailService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      shippingPrice = 0,
      taxPrice = 0,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided'
      });
    }

    // Validate stock and calculate prices
    let itemsPrice = 0;
    const processedItems = [];

    for (const item of orderItems) {
      const productResult = await sql`SELECT * FROM products WHERE id = ${item.product}`;
      const product = productResult[0];
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }
      if (product.inventory_quantity < item.qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${product.name}`
        });
      }
      itemsPrice += product.price * item.qty;
      processedItems.push({
        product_id: product.id,
        name: product.name,
        qty: item.qty,
        price: product.price
      });
    }    // Insert order
    const orderResult = await sql`
      INSERT INTO orders (user_id, order_items, shipping_address, payment_method, shipping_price, tax_price, total_price, items_price, status)
      VALUES (
        ${req.user.id},
        ${JSON.stringify(processedItems)},
        ${JSON.stringify(shippingAddress)},
        ${paymentMethod},
        ${shippingPrice},
        ${taxPrice},
        ${totalPrice},
        ${itemsPrice},
        'pending'
      ) RETURNING *
    `;
    const order = orderResult[0];

    // Get user email for notifications
    const userResult = await sql`SELECT email FROM users WHERE id = ${req.user.id}`;
    const userEmail = userResult[0]?.email;

    // Send admin notification email
    try {
      if (userEmail) {
        await sendAdminOrderNotification(order, userEmail);
      }
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError);
    }

    // Optionally, update product inventory here

    // Optionally, send confirmation email
    // await sendOrderConfirmationEmail(order, req.user.email);

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create new order (Guest checkout)
// @route   POST /api/orders/guest
// @access  Public
router.post('/guest', async (req, res) => {
  try {
    const { customerInfo, orderItems, giftPackaging, giftNote, shippingPrice, giftPackagingFee, totalPrice, paymentMethod, paymentDetails } = req.body;

    const order = await pool.query(
      'INSERT INTO orders (customer_info, order_items, gift_packaging, gift_note, shipping_price, gift_packaging_fee, total_price, payment_method, payment_details, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [JSON.stringify(customerInfo), JSON.stringify(orderItems), giftPackaging, giftNote, shippingPrice, giftPackagingFee, totalPrice, paymentMethod || 'manual', JSON.stringify(paymentDetails || {}), paymentMethod === 'paypal' ? 'paid' : 'pending']
    );

    // Send order confirmation email to client only
    try {
      if (customerInfo.email) {
        await sendOrderConfirmationEmail(customerInfo.email, {
          ...order,
          orderItems: orderItems // Pass order items for email rendering
        });
      }
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        orderId: order.id,
        status: order.status,
        totalPrice: order.total_price
      }
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process order. Please try again.' 
    });
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await sql`
      SELECT * FROM orders
      WHERE user_id = ${req.user.id}
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${skip}
    `;

    const totalResult = await sql`
      SELECT COUNT(*) FROM orders WHERE user_id = ${req.user.id}
    `;
    const total = totalResult[0].count;

    res.json({
      success: true,
      data: orders,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const orderResult = await sql`
      SELECT * FROM orders
      WHERE id = ${req.params.id} AND user_id = ${req.user.id}
    `;

    const order = orderResult[0];

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
router.put('/:id/pay', protect, async (req, res) => {
  try {
    const orderResult = await sql`
      SELECT * FROM orders
      WHERE id = ${req.params.id} AND user_id = ${req.user.id}
    `;

    const order = orderResult[0];

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    await sql`
      UPDATE orders
      SET
        is_paid = true,
        paid_at = NOW(),
        payment_result = ${JSON.stringify(req.body)},
        status = 'processing'
      WHERE id = ${req.params.id}
    `;

    const updatedOrderResult = await sql`
      SELECT * FROM orders WHERE id = ${req.params.id}
    `;
    const updatedOrder = updatedOrderResult[0];

    res.json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const { status, startDate, endDate, search } = req.query;
    
    // Build query
    let query = `WHERE 1=1`;
    
    if (status && status !== 'all') {
      query += ` AND status = '${status}'`;
    }
    
    if (startDate && endDate) {
      query += ` AND created_at BETWEEN '${startDate}' AND '${endDate}'`;
    }
    
    if (search) {
      query += ` AND (order_number ILIKE '%${search}%' OR (shipping_address->>'name') ILIKE '%${search}%')`;
    }

    const orders = await sql`
      SELECT * FROM orders
      ${sql.raw(query)}
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${skip}
    `;

    const totalResult = await sql`
      SELECT COUNT(*) FROM orders
      ${sql.raw(query)}
    `;
    const total = totalResult[0].count;

    // Calculate stats
    const stats = await sql`
      SELECT
        SUM(total_price) AS total_revenue,
        AVG(total_price) AS average_order_value,
        COUNT(*) AS total_orders
      FROM orders
      ${sql.raw(query)}
    `;

    res.json({
      success: true,
      data: orders,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total
      },
      stats: stats[0] || { total_revenue: 0, average_order_value: 0, total_orders: 0 }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, note } = req.body;
    const orderResult = await sql`
      SELECT * FROM orders
      WHERE id = ${req.params.id}
    `;

    const order = orderResult[0];

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    await sql`
      UPDATE orders
      SET
        status = ${status},
        status_history = status_history || jsonb_build_array(
          jsonb_build_object('status', ${status}, 'timestamp', NOW(), 'note', ${note || `Status updated to ${status}`})
        )
      WHERE id = ${req.params.id}
    `;

    if (status === 'shipped') {
      await sql`
        UPDATE orders
        SET shipped_at = NOW()
        WHERE id = ${req.params.id}
      `;
    } else if (status === 'delivered') {
      await sql`
        UPDATE orders
        SET delivered_at = NOW()
        WHERE id = ${req.params.id}
      `;
    }

    const updatedOrderResult = await sql`
      SELECT * FROM orders WHERE id = ${req.params.id}
    `;
    const updatedOrder = updatedOrderResult[0];

    // Send status update email
    try {
      await sendOrderStatusUpdateEmail(order.user.email, updatedOrder);
    } catch (emailError) {
      console.error('Failed to send status update email:', emailError);
    }

    res.json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const orderResult = await sql`
      SELECT * FROM orders
      WHERE id = ${req.params.id} AND user_id = ${req.user.id}
    `;

    const order = orderResult[0];

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if order can be cancelled
    if (order.status === 'shipped' || order.status === 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel shipped or delivered orders'
      });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Order is already cancelled'
      });
    }

    await sql`
      UPDATE orders
      SET
        status = 'cancelled',
        status_history = status_history || jsonb_build_array(
          jsonb_build_object('status', 'cancelled', 'timestamp', NOW(), 'note', 'Cancelled by customer')
        )
      WHERE id = ${req.params.id}
    `;

    // Optionally, restore product stock here

    res.json({
      success: true,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// print-orders.js
(async () => {
  try {
    const orders = await sql`SELECT id, user_id, order_items, created_at FROM orders ORDER BY created_at DESC LIMIT 10`;
    console.log(JSON.stringify(orders, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
})();

module.exports = router;

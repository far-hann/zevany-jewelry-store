const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const sql = require('../config/postgresClient');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // Fetch cart items for the user
    const cartResult = await sql`SELECT * FROM carts WHERE user_id = ${req.user.id}`;
    const cart = cartResult[0];
    if (!cart || !cart.items) {
      return res.json({
        success: true,
        data: { items: [], totalItems: 0, totalPrice: '0.00' }
      });
    }
    let totalItems = 0;
    let totalPrice = 0;
    const items = JSON.parse(cart.items);
    for (const item of items) {
      totalItems += item.quantity;
      totalPrice += item.price * item.quantity;
    }
    res.json({
      success: true,
      data: {
        items,
        totalItems,
        totalPrice: totalPrice.toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;

    // Validate product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: `Only ${product.stock} items available in stock` 
      });
    }

    const user = await User.findById(req.user.id);

    // Check if item already exists in cart
    const existingItemIndex = user.cart.findIndex(item => 
      item.product.toString() === productId && 
      item.size === size && 
      item.color === color
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = user.cart[existingItemIndex].quantity + quantity;
      
      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available in stock`
        });
      }

      user.cart[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      user.cart.push({
        product: productId,
        quantity,
        size,
        color,
        addedAt: new Date()
      });
    }

    await user.save();

    // Return updated cart
    const updatedUser = await User.findById(req.user.id).populate({
      path: 'cart.product',
      select: 'name price images stock category'
    });

    res.json({
      success: true,
      message: 'Item added to cart',
      data: updatedUser.cart
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
router.put('/:itemId', protect, async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (quantity <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Quantity must be greater than 0' 
      });
    }

    const user = await User.findById(req.user.id);
    const cartItem = user.cart.id(itemId);

    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    // Check stock availability
    const product = await Product.findById(cartItem.product);
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }

    cartItem.quantity = quantity;
    await user.save();

    res.json({
      success: true,
      message: 'Cart updated',
      data: cartItem
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
router.delete('/:itemId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const cartItem = user.cart.id(req.params.itemId);

    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    cartItem.remove();
    await user.save();

    res.json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
router.delete('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();

    res.json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

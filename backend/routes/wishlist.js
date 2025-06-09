const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const sql = require('../config/postgresClient');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const wishlistResult = await sql`SELECT * FROM wishlists WHERE user_id = ${req.user.id}`;
    const wishlist = wishlistResult[0];
    if (!wishlist || !wishlist.items) {
      return res.json({ success: true, data: [] });
    }
    const items = JSON.parse(wishlist.items);
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Add item to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
router.post('/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;
    // Validate product exists
    const productResult = await sql`SELECT * FROM products WHERE id = ${productId}`;
    const product = productResult[0];
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    // Get or create wishlist
    let wishlistResult = await sql`SELECT * FROM wishlists WHERE user_id = ${req.user.id}`;
    let wishlist = wishlistResult[0];
    let items = wishlist && wishlist.items ? JSON.parse(wishlist.items) : [];
    if (items.find(item => item.id === productId)) {
      return res.status(400).json({ success: false, message: 'Product already in wishlist' });
    }
    items.push({ id: productId, name: product.name, price: product.price });
    if (wishlist) {
      await sql`UPDATE wishlists SET items = ${JSON.stringify(items)} WHERE user_id = ${req.user.id}`;
    } else {
      await sql`INSERT INTO wishlists (user_id, items) VALUES (${req.user.id}, ${JSON.stringify(items)})`;
    }
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
router.delete('/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    user.wishlist = user.wishlist.filter(
      item => item.toString() !== req.params.productId
    );
    
    await user.save();

    res.json({
      success: true,
      message: 'Product removed from wishlist'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
router.delete('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.wishlist = [];
    await user.save();

    res.json({
      success: true,
      message: 'Wishlist cleared'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

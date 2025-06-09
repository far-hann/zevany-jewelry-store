const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { protect, optionalAuth } = require('../middleware/auth');
const sql = require('../config/postgresClient');

const router = express.Router();

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional(),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  query('sort').optional(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    // Build WHERE clause
    let where = [];
    let params = [];
    if (req.query.category) {
      where.push('category = $' + (params.length + 1));
      params.push(req.query.category);
    }
    if (req.query.minPrice) {
      where.push('price >= $' + (params.length + 1));
      params.push(parseFloat(req.query.minPrice));
    }
    if (req.query.maxPrice) {
      where.push('price <= $' + (params.length + 1));
      params.push(parseFloat(req.query.maxPrice));
    }
    let whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';

    // Sorting
    let sort = 'ORDER BY created_at DESC';
    switch (req.query.sort) {
      case 'price_asc':
        sort = 'ORDER BY price ASC';
        break;
      case 'price_desc':
        sort = 'ORDER BY price DESC';
        break;
      case 'name_asc':
        sort = 'ORDER BY name ASC';
        break;
      case 'name_desc':
        sort = 'ORDER BY name DESC';
        break;
      case 'rating':
        sort = 'ORDER BY rating DESC';
        break;
      case 'newest':
        sort = 'ORDER BY created_at DESC';
        break;
      case 'popular':
        sort = 'ORDER BY total_sold DESC';
        break;
      default:
        sort = 'ORDER BY created_at DESC';
    }

    // Query products
    const products = await sql.unsafe(
      `SELECT * FROM products ${whereClause} ${sort} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      ...params, limit, offset
    );
    const totalResult = await sql.unsafe(
      `SELECT COUNT(*) FROM products ${whereClause}`,
      ...params
    );
    const total = parseInt(totalResult[0].count || 0);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          current: page,
          total: totalPages,
          count: products.length,
          totalProducts: total,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const productResult = await sql`SELECT * FROM products WHERE id = ${req.params.id}`;
    const product = productResult[0];
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
router.get('/slug/:slug', optionalAuth, async (req, res) => {
  try {
    const productResult = await sql`SELECT * FROM products WHERE seo->>'slug' = ${req.params.slug}`;
    const product = productResult[0];
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error('Get product by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
router.post('/:id/reviews', protect, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').optional().isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('comment').optional().isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { rating, title, comment } = req.body;

    const productResult = await sql`SELECT * FROM products WHERE id = ${req.params.id}`;
    const product = productResult[0];
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user has already reviewed this product
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Add review
    const review = {
      user: req.user.id,
      rating,
      title,
      comment,
      createdAt: new Date()
    };

    product.reviews.push(review);
    await product.updateRating();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: { review }
    });

  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding review',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
router.get('/:id/related', async (req, res) => {
  try {
    const productResult = await sql`SELECT * FROM products WHERE id = ${req.params.id}`;
    const product = productResult[0];
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Find related products in same category, excluding current product
    const relatedProducts = await sql`
      SELECT * FROM products
      WHERE category = ${product.category} AND id != ${product.id} AND status = 'active'
      LIMIT 4
    `;

    res.json({
      success: true,
      data: { products: relatedProducts }
    });

  } catch (error) {
    console.error('Get related products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching related products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
router.get('/search', [
  query('q').notEmpty().withMessage('Search query is required'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    const searchQuery = req.query.q;

    // Perform text search
    const products = await sql`
      SELECT * FROM products
      WHERE to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '')) @@ plainto_tsquery('english', ${searchQuery})
      AND status = 'active'
      ORDER BY ts_rank(to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '')), plainto_tsquery('english', ${searchQuery})) DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const totalResult = await sql`
      SELECT COUNT(*) FROM products
      WHERE to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '')) @@ plainto_tsquery('english', ${searchQuery})
      AND status = 'active'
    `;
    const total = parseInt(totalResult[0].count || 0);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          current: page,
          total: totalPages,
          count: products.length,
          totalProducts: total,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        searchQuery
      }
    });

  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;

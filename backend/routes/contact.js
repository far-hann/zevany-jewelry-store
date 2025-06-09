const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { sendContactInquiryResponse } = require('../utils/emailService');
const sql = require('../config/postgresClient');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
router.post('/', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('subject')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Subject must be between 5 and 100 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
  body('phone')
    .optional()
    .custom((value) => {
      // Accept empty, null, or any string with at least 7 digits (very permissive for international)
      if (!value) return true;
      const digits = value.replace(/\D/g, '');
      if (digits.length < 7) {
        throw new Error('Please provide a valid phone number');
      }
      return true;
    })
    .withMessage('Please provide a valid phone number'),
  body('shipping_address')
    .optional()
    .isString()
    .withMessage('Shipping address must be a string')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, subject, message, phone, shipping_address } = req.body;

    // Store contact inquiry in the database
    await sql`
      INSERT INTO contact_inquiries (name, email, subject, message, phone, shipping_address)
      VALUES (${name}, ${email}, ${subject}, ${message}, ${phone}, ${shipping_address || null})
    `;

    // Send auto-response to customer
    try {
      await sendContactInquiryResponse(email, name, message);
    } catch (emailError) {
      console.error('Failed to send auto-response email:', emailError);
    }

    // Send notification to admin (you could implement this)
    // await sendAdminNotification({ name, email, subject, message, phone, shipping_address });

    res.json({
      success: true,
      message: 'Thank you for your inquiry. We will get back to you within 24 hours.'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit inquiry. Please try again later.'
    });
  }
});

// @desc    Subscribe to newsletter
// @route   POST /api/contact/newsletter
// @access  Public
router.post('/newsletter', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    const { email } = req.body;

    // Here you would usually:
    // 1. Check if email already exists in newsletter list
    // 2. Add to your email marketing service (Mailchimp, SendGrid, etc.)
    // 3. Send welcome email

    console.log(`Newsletter subscription: ${email}`);

    res.json({
      success: true,
      message: 'Successfully subscribed to newsletter!'
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe. Please try again later.'
    });
  }
});

module.exports = router;

/*
-- Users
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text,
  last_name text,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  phone text
);

-- Products
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  price numeric,
  category text,
  inventory_quantity integer,
  created_at timestamp with time zone DEFAULT now()
  -- add other fields as needed
);

-- Orders
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  order_items jsonb,
  shipping_address jsonb,
  payment_method text,
  shipping_price numeric,
  tax_price numeric,
  total_price numeric,
  items_price numeric,
  status text,
  created_at timestamp with time zone DEFAULT now()
);

-- Carts
CREATE TABLE carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) UNIQUE,
  items jsonb
);

-- Wishlists
CREATE TABLE wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) UNIQUE,
  items jsonb
);

-- Contact Inquiries
CREATE TABLE contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  subject text,
  message text,
  phone text,
  shipping_address text,
  created_at timestamp with time zone DEFAULT now()
);
*/

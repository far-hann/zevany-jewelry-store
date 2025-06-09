const express = require('express');
const sql = require('../config/postgresClient');

const router = express.Router();

// GET /api/users - Get all users
router.get('/', async (req, res) => {
  try {
    const result = await sql`SELECT id, email, first_name, last_name, created_at FROM users ORDER BY created_at DESC`;
    res.json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql`SELECT id, email, first_name, last_name, created_at FROM users WHERE id = ${id}`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST /api/users - Create a new user
router.post('/', async (req, res) => {
  try {
    const { email, firstName, lastName, hashedPassword } = req.body;
    if (!email || !firstName || !lastName) {
      return res.status(400).json({ error: 'Email, first name, and last name are required' });
    }
    // Check if user already exists
    const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    const result = await sql`INSERT INTO users (email, first_name, last_name, password_hash) VALUES (${email}, ${firstName}, ${lastName}, ${hashedPassword}) RETURNING id, email, first_name, last_name, created_at`;
    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, firstName, lastName } = req.body;
    const result = await sql`UPDATE users SET email = ${email}, first_name = ${firstName}, last_name = ${lastName}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id} RETURNING id, email, first_name, last_name, created_at, updated_at`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql`DELETE FROM users WHERE id = ${id} RETURNING id`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully', id });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;

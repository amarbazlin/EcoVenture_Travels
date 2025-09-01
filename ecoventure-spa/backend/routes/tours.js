const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');

const router = express.Router();

// GET /api/tours - Fetch all tours with category information
router.get('/tours', async (req, res) => {
  try {
    const { search, category } = req.query;
    
    let query = `
      SELECT 
        t.id,
        t.tour_key,
        t.name,
        t.description,
        t.country,
        t.image_url,
        t.days,
        t.price,
        t.old_price,
        t.rating,
        t.reviews,
        c.name as category_name,
        c.category_key
      FROM tours t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE 1=1
    `;
    
    const queryParams = [];
    
    // Add search filter
    if (search) {
      query += ` AND (t.name LIKE ? OR t.description LIKE ? OR c.name LIKE ?)`;
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    // Add category filter
    if (category) {
      query += ` AND c.category_key = ?`;
      queryParams.push(category);
    }
    
    query += ` ORDER BY t.rating DESC, t.name ASC`;
    
    const [rows] = await db.execute(query, queryParams);
    
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
    
  } catch (error) {
    console.error('Error fetching tours:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tours',
      error: error.message
    });
  }
});

// GET /api/categories - Fetch all categories
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM categories ORDER BY name');
    
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

// GET /api/tours/:id - Fetch single tour by ID
router.get('/tours/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        t.*,
        c.name as category_name,
        c.category_key
      FROM tours t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `;
    
    const [rows] = await db.execute(query, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
    
  } catch (error) {
    console.error('Error fetching tour:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tour',
      error: error.message
    });
  }
});

// POST /api/tours - Add new tour
router.post('/tours', [
  // Validation middleware
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Tour name must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('country')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Country must be between 2 and 50 characters'),
  body('category_id')
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer'),
  body('days')
    .isInt({ min: 1, max: 365 })
    .withMessage('Days must be between 1 and 365'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('image_url')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be between 0 and 5')
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
    
    const {
      name,
      description,
      country,
      category_id,
      days,
      price,
      old_price,
      image_url,
      rating = 0,
      reviews = 0
    } = req.body;
    
    // Generate tour_key from name
    const tour_key = name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Check if category exists
    const [categoryCheck] = await db.execute(
      'SELECT id FROM categories WHERE id = ?',
      [category_id]
    );
    
    if (categoryCheck.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      });
    }
    
    // Insert new tour
    const insertQuery = `
      INSERT INTO tours (
        tour_key, name, description, country, category_id, 
        days, price, old_price, image_url, rating, reviews
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.execute(insertQuery, [
      tour_key, name, description, country, category_id,
      days, price, old_price || null, image_url || null, rating, reviews
    ]);
    
    // Fetch the created tour with category info
    const [newTour] = await db.execute(`
      SELECT 
        t.*,
        c.name as category_name,
        c.category_key
      FROM tours t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `, [result.insertId]);
    
    res.status(201).json({
      success: true,
      message: 'Tour created successfully',
      data: newTour[0]
    });
    
  } catch (error) {
    console.error('Error creating tour:', error);
    
    // Handle duplicate entry error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Tour with this name already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create tour',
      error: error.message
    });
  }
});

// DELETE /api/tours/:id - Delete a tour (bonus endpoint)
router.delete('/tours/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.execute('DELETE FROM tours WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Tour deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting tour:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete tour',
      error: error.message
    });
  }
});

module.exports = router;
// src/routes/restaurants.js
const router = require('express').Router();
const pool   = require('../config/database');
const logger = require('../config/logger');
const { authenticate, authorize } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// GET /api/restaurants — list all open restaurants
router.get('/', async (req, res) => {
  try {
    const { cuisine, search } = req.query;
    let where = 'WHERE is_active = 1';
    const params = [];
    if (cuisine) { where += ' AND cuisine = ?'; params.push(cuisine); }
    if (search)  { where += ' AND name LIKE ?';  params.push(`%${search}%`); }

    const [rows] = await pool.execute(
      `SELECT id, name, slug, cuisine, description, image_url,
              rating, delivery_time, min_order, is_open
       FROM restaurants ${where} ORDER BY rating DESC`,
      params
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    logger.error('Get restaurants error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/restaurants/:slug — single restaurant + full menu
router.get('/:slug', async (req, res) => {
  try {
    const [[restaurant]] = await pool.execute(
      'SELECT * FROM restaurants WHERE slug = ? AND is_active = 1',
      [req.params.slug]
    );
    if (!restaurant) return res.status(404).json({ success: false, message: 'Not found' });

    const [categories] = await pool.execute(
      'SELECT * FROM menu_categories WHERE restaurant_id = ? ORDER BY sort_order',
      [restaurant.id]
    );
    const [items] = await pool.execute(
      `SELECT * FROM menu_items WHERE restaurant_id = ? AND is_available = 1
       ORDER BY is_popular DESC, category_id, name`,
      [restaurant.id]
    );

    // Group items under their category
    const menu = categories.map(cat => ({
      ...cat,
      items: items.filter(i => i.category_id === cat.id),
    }));

    res.json({ success: true, data: { ...restaurant, menu } });
  } catch (err) {
    logger.error('Get restaurant error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/restaurants — admin: add restaurant
router.post('/',
  authenticate, authorize('admin'),
  [
    body('name').trim().notEmpty(),
    body('cuisine').trim().notEmpty(),
    body('delivery_time').isInt({ min: 5 }),
    body('min_order').isFloat({ min: 0 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

    const { name, cuisine, description, image_url, address, delivery_time, min_order } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    try {
      const [result] = await pool.execute(
        `INSERT INTO restaurants (name, slug, cuisine, description, image_url, address, delivery_time, min_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, slug, cuisine, description, image_url, address, delivery_time, min_order]
      );
      res.status(201).json({ success: true, id: result.insertId });
    } catch (err) {
      logger.error('Create restaurant error:', err.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// PUT /api/restaurants/:id — admin: update restaurant
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  const { name, cuisine, description, delivery_time, min_order, is_open, is_active } = req.body;
  try {
    await pool.execute(
      `UPDATE restaurants SET name=?, cuisine=?, description=?, delivery_time=?,
       min_order=?, is_open=?, is_active=? WHERE id=?`,
      [name, cuisine, description, delivery_time, min_order, is_open, is_active, req.params.id]
    );
    res.json({ success: true, message: 'Updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/restaurants/:id — admin: soft delete
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    await pool.execute('UPDATE restaurants SET is_active = 0 WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Restaurant removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

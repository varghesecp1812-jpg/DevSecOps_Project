// src/routes/cart.js
const router = require('express').Router();
const pool   = require('../config/database');
const logger = require('../config/logger');
const { authenticate } = require('../middleware/auth');

// All cart routes require login
router.use(authenticate);

// GET /api/cart — get current user's cart
router.get('/', async (req, res) => {
  try {
    const [items] = await pool.execute(
      `SELECT ci.id, ci.quantity, ci.menu_item_id,
              mi.name, mi.price, mi.image_url, mi.is_veg,
              r.id AS restaurant_id, r.name AS restaurant_name, r.slug AS restaurant_slug
       FROM cart_items ci
       JOIN menu_items  mi ON ci.menu_item_id  = mi.id
       JOIN restaurants r  ON ci.restaurant_id = r.id
       WHERE ci.user_id = ?`,
      [req.user.id]
    );

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const delivery = items.length > 0 ? 40 : 0;

    res.json({
      success: true,
      data: {
        items,
        subtotal: subtotal.toFixed(2),
        delivery_charge: delivery,
        total: (subtotal + delivery).toFixed(2),
        restaurant: items[0]
          ? { id: items[0].restaurant_id, name: items[0].restaurant_name, slug: items[0].restaurant_slug }
          : null,
      },
    });
  } catch (err) {
    logger.error('Get cart error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/cart — add item to cart
router.post('/', async (req, res) => {
  const { menu_item_id, quantity = 1 } = req.body;
  if (!menu_item_id) return res.status(400).json({ success: false, message: 'menu_item_id required' });

  try {
    // Get the menu item + its restaurant
    const [[item]] = await pool.execute(
      'SELECT id, restaurant_id, is_available FROM menu_items WHERE id = ?',
      [menu_item_id]
    );
    if (!item || !item.is_available) {
      return res.status(404).json({ success: false, message: 'Item not available' });
    }

    // Prevent adding items from a different restaurant (one restaurant per cart)
    const [existing] = await pool.execute(
      'SELECT DISTINCT restaurant_id FROM cart_items WHERE user_id = ?',
      [req.user.id]
    );
    if (existing.length && existing[0].restaurant_id !== item.restaurant_id) {
      return res.status(409).json({
        success: false,
        message: 'Your cart has items from another restaurant. Clear cart first.',
        clear_required: true,
      });
    }

    // Upsert: insert or increase quantity
    await pool.execute(
      `INSERT INTO cart_items (user_id, restaurant_id, menu_item_id, quantity)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [req.user.id, item.restaurant_id, menu_item_id, quantity]
    );

    res.json({ success: true, message: 'Added to cart' });
  } catch (err) {
    logger.error('Add to cart error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/cart/:id — update quantity
router.put('/:id', async (req, res) => {
  const { quantity } = req.body;
  if (!quantity || quantity < 1) {
    return res.status(400).json({ success: false, message: 'Quantity must be >= 1' });
  }
  try {
    const [result] = await pool.execute(
      'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, req.params.id, req.user.id]
    );
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, message: 'Cart updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/cart/:id — remove one item
router.delete('/:id', async (req, res) => {
  try {
    await pool.execute(
      'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    res.json({ success: true, message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/cart — clear entire cart
router.delete('/', async (req, res) => {
  try {
    await pool.execute('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

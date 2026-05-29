// src/routes/orders.js
const router = require('express').Router();
const pool   = require('../config/database');
const logger = require('../config/logger');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

// POST /api/orders — place order from cart
router.post('/', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const { address_id, payment_method = 'cod', notes } = req.body;

    // Get cart items
    const [cartItems] = await conn.execute(
      `SELECT ci.id AS cart_id, ci.quantity, mi.id AS menu_item_id,
              mi.name, mi.price, mi.is_available, mi.restaurant_id
       FROM cart_items ci
       JOIN menu_items mi ON ci.menu_item_id = mi.id
       WHERE ci.user_id = ?`,
      [req.user.id]
    );

    if (!cartItems.length) {
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Validate all items still available
    const unavailable = cartItems.filter(i => !i.is_available);
    if (unavailable.length) {
      await conn.rollback();
      return res.status(400).json({
        success: false,
        message: `These items are no longer available: ${unavailable.map(i => i.name).join(', ')}`,
      });
    }

    const restaurantId  = cartItems[0].restaurant_id;
    const subtotal      = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const deliveryCharge = 40;
    const total         = subtotal + deliveryCharge;

    // Create order
    const [orderResult] = await conn.execute(
      `INSERT INTO orders (user_id, restaurant_id, address_id, total_amount, delivery_charge, payment_method, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, restaurantId, address_id || null, total, deliveryCharge, payment_method, notes || null]
    );
    const orderId = orderResult.insertId;

    // Insert order items (price snapshot)
    for (const item of cartItems) {
      await conn.execute(
        'INSERT INTO order_items (order_id, menu_item_id, name, price, quantity) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.menu_item_id, item.name, item.price, item.quantity]
      );
    }

    // Clear cart
    await conn.execute('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);

    await conn.commit();
    logger.info(`Order #${orderId} placed by user ${req.user.id}, total: ₹${total}`);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order_id: orderId,
      total,
    });
  } catch (err) {
    await conn.rollback();
    logger.error('Place order error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  } finally {
    conn.release();
  }
});

// GET /api/orders — my orders
router.get('/', async (req, res) => {
  try {
    const [orders] = await pool.execute(
      `SELECT o.id, o.status, o.total_amount, o.delivery_charge,
              o.payment_method, o.payment_status, o.placed_at,
              r.name AS restaurant_name, r.slug AS restaurant_slug
       FROM orders o
       JOIN restaurants r ON o.restaurant_id = r.id
       WHERE o.user_id = ?
       ORDER BY o.placed_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/orders/:id — order detail with items
router.get('/:id', async (req, res) => {
  try {
    const [[order]] = await pool.execute(
      `SELECT o.*, r.name AS restaurant_name, r.slug,
              a.line1, a.line2, a.city, a.pincode
       FROM orders o
       JOIN restaurants r ON o.restaurant_id = r.id
       LEFT JOIN addresses a ON o.address_id = a.id
       WHERE o.id = ? AND (o.user_id = ? OR ? = 'admin')`,
      [req.params.id, req.user.id, req.user.role]
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const [items] = await pool.execute(
      'SELECT * FROM order_items WHERE order_id = ?',
      [order.id]
    );

    res.json({ success: true, data: { ...order, items } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/orders/:id/cancel — user cancels (only if placed/confirmed)
router.put('/:id/cancel', async (req, res) => {
  try {
    const [[order]] = await pool.execute(
      'SELECT id, status FROM orders WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (!['placed', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel this order' });
    }
    await pool.execute("UPDATE orders SET status = 'cancelled' WHERE id = ?", [order.id]);
    res.json({ success: true, message: 'Order cancelled' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/orders/:id/status — admin updates status
router.put('/:id/status', authorize('admin'), async (req, res) => {
  const { status } = req.body;
  const valid = ['placed','confirmed','preparing','out_for_delivery','delivered','cancelled'];
  if (!valid.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }
  try {
    await pool.execute('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    logger.info(`Order #${req.params.id} status → ${status} by admin ${req.user.id}`);
    res.json({ success: true, message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

const router = require('express').Router();
const pool = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.use(authorize('admin'));

router.get('/orders', async (req, res) => {
  const [orders] = await pool.execute(
    `SELECT o.*, u.name AS customer
     FROM orders o
     JOIN users u ON o.user_id=u.id
     ORDER BY o.placed_at DESC`
  );

  res.json({
    success: true,
    data: orders
  });
});

router.get('/users', async (req, res) => {
  const [users] = await pool.execute(
    'SELECT id,name,email,role,created_at FROM users'
  );

  res.json({
    success: true,
    data: users
  });
});

module.exports = router;

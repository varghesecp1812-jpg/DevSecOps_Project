const router = require('express').Router();
const pool = require('../config/database');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', async (req, res) => {
  const [rows] = await pool.execute(
    'SELECT * FROM addresses WHERE user_id=?',
    [req.user.id]
  );

  res.json({
    success: true,
    data: rows
  });
});

router.post('/', async (req, res) => {
  const { label, line1, line2, city, pincode } = req.body;

  await pool.execute(
    `INSERT INTO addresses
    (user_id,label,line1,line2,city,pincode)
    VALUES (?,?,?,?,?,?)`,
    [req.user.id, label, line1, line2, city, pincode]
  );

  res.json({
    success: true,
    message: 'Address added'
  });
});

module.exports = router;

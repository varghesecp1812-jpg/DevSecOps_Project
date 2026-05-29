const router = require('express').Router();
const pool = require('../config/database');

router.get('/:restaurantId', async (req, res) => {
  try {
    const [items] = await pool.execute(
      'SELECT * FROM menu_items WHERE restaurant_id=?',
      [req.params.restaurantId]
    );

    res.json({
      success: true,
      data: items
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;

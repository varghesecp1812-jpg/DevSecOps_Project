// src/server.js
require('dotenv').config();
const express      = require('express');
const cookieParser = require('cookie-parser');
const morgan       = require('morgan');
const path         = require('path');
const logger       = require('./config/logger');
const { helmetMiddleware, apiLimiter, xssSanitize, hppProtect } = require('./middleware/security');

// ── Route imports ────────────────────────────────────────
const authRoutes       = require('./routes/auth');
const restaurantRoutes = require('./routes/restaurants');
const menuRoutes       = require('./routes/menu');
const cartRoutes       = require('./routes/cart');
const orderRoutes      = require('./routes/orders');
const addressRoutes    = require('./routes/addresses');
const adminRoutes      = require('./routes/admin');

const app = express();

// ── Security middleware (FIRST) ──────────────────────────
app.use(helmetMiddleware);
app.use(xssSanitize);
app.use(hppProtect);

// ── Trust proxy (for ALB / Nginx) ───────────────────────
app.set('trust proxy', 1);

// ── Body & cookie parsers ────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// ── HTTP logging ─────────────────────────────────────────
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));

// ── Static files ─────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../public')));

// ── API rate limit ───────────────────────────────────────
app.use('/api', apiLimiter);

// ── Routes ───────────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu',        menuRoutes);
app.use('/api/cart',        cartRoutes);
app.use('/api/orders',      orderRoutes);
app.use('/api/addresses',   addressRoutes);
app.use('/api/admin',       adminRoutes);

// ── Health check endpoint (for ALB target group) ─────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'foodapp', timestamp: new Date().toISOString() });
});

// ── Serve frontend for all other routes (SPA) ────────────
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ── Global error handler ─────────────────────────────────
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`, { stack: err.stack, path: req.path });
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🍔 FoodApp running on port ${PORT} [${process.env.NODE_ENV}]`);
});

module.exports = app;
// test deploy

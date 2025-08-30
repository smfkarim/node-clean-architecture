const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const morgan = require('morgan');

const config = require('./config/environment');
const errorMiddleware = require('./interfaces/middleware/errorMiddleware');
const { generalRateLimit, authRateLimit } = require('./interfaces/middleware/rateLimitMiddleware');

// Routes
const createAuthRoutes = require('./interfaces/routes/authRoutes');
const createProductRoutes = require('./interfaces/routes/productRoutes');

// DI Container
const container = require('./di/container');

const createApp = () => {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  }));

  // General middleware
  app.use(compression());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Logging
  if (config.nodeEnv !== 'test') {
    app.use(morgan('combined'));
  }

  // Rate limiting
  app.use(generalRateLimit);

  // Health check
  app.get('/health', (req, res) => {
    res.json({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
    });
  });

  // API routes
  app.use('/api/auth', authRateLimit, createAuthRoutes(
    container.get('authController'),
    container.get('authMiddleware')
  ));

  app.use('/api/products', createProductRoutes(
    container.get('productController'),
    container.get('authMiddleware')
  ));

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
    });
  });

  // Error handling middleware (must be last)
  app.use(errorMiddleware);

  return app;
};

module.exports = createApp;
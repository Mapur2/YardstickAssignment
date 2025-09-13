const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Health check endpoint
router.get('/', async (req, res) => {
  try {
    // Check database connection
    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? 'connected' : 'disconnected';

    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbStatus,
        readyState: dbState
      },
      version: '1.0.0'
    };

    // If database is not connected, return error status
    if (dbState !== 1) {
      return res.status(503).json({
        ...health,
        status: 'error',
        message: 'Database connection failed'
      });
    }

    res.json(health);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Health check failed',
      error: error.message
    });
  }
});

// Detailed health check with more information
router.get('/detailed', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? 'connected' : 'disconnected';

    // Get memory usage
    const memoryUsage = process.memoryUsage();

    // Get database stats if connected
    let dbStats = null;
    if (dbState === 1) {
      try {
        dbStats = await mongoose.connection.db.stats();
      } catch (dbError) {
        console.warn('Could not get database stats:', dbError.message);
      }
    }

    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      system: {
        memory: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
          external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`
        },
        platform: process.platform,
        nodeVersion: process.version
      },
      database: {
        status: dbStatus,
        readyState: dbState,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        name: mongoose.connection.name,
        stats: dbStats
      }
    };

    if (dbState !== 1) {
      return res.status(503).json({
        ...health,
        status: 'error',
        message: 'Database connection failed'
      });
    }

    res.json(health);
  } catch (error) {
    console.error('Detailed health check error:', error);
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Detailed health check failed',
      error: error.message
    });
  }
});

module.exports = router;

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createErrorHandler } = require('./middleware/errorHandler');
const { createLogger } = require('./logger');

function createServiceApp({ serviceName, routes, basePath = '/api' }) {
  const app = express();
  const logger = createLogger(serviceName);

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));

  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: serviceName,
      timestamp: new Date().toISOString(),
    });
  });

  app.use(basePath, routes);

  app.use((_req, _res, next) => {
    console.log("route section");
    const err = new Error('Route not found');
    err.statusCode = 404;
    next(err);
  });

  app.use(createErrorHandler(logger));

  return { app, logger };
}

module.exports = { createServiceApp };

const { success, error } = require('./utils/response');
const { createLogger } = require('./logger');
const { createErrorHandler, AppError } = require('./middleware/errorHandler');
const { authenticate, authorize } = require('./middleware/auth');
const { createServiceApp } = require('./createServiceApp');
const { startServer } = require('./startServer');
const { createSequelizeModelClient } = require('./db/sequelizeAdapter');

module.exports = {
  success,
  error,
  createLogger,
  createErrorHandler,
  AppError,
  authenticate,
  authorize,
  createServiceApp,
  startServer,
  createSequelizeModelClient,
};

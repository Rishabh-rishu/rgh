const { success, error, sendSuccessResponse, sendErrorResponse } = require('./utils/response');
const { HTTP_STATUS } = require('./utils/httpStatus');
const { createLogger } = require('./logger');
const { createErrorHandler, AppError } = require('./middleware/errorHandler');
const { authenticate, authorize } = require('./middleware/auth');
const { createServiceApp } = require('./createServiceApp');
const { startServer } = require('./startServer');
const { createSequelizeModelClient } = require('./db/sequelizeAdapter');

module.exports = {
  success,
  error,
  sendSuccessResponse,
  sendErrorResponse,
  HTTP_STATUS,
  createLogger,
  createErrorHandler,
  AppError,
  authenticate,
  authorize,
  createServiceApp,
  startServer,
  createSequelizeModelClient,
};

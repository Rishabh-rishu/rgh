function success(res, data = null, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function error(res, message = 'An error occurred', statusCode = 500, errors = null) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}

function sendSuccessResponse(res, statusCode = 200, message = 'Success', data = {}) {
  return success(res, data, message, statusCode);
}

function sendErrorResponse(res, statusCode = 501, message = 'An error occurred', errors = null) {
  return error(res, message, statusCode, errors);
}

module.exports = {
  success,
  error,
  sendSuccessResponse,
  sendErrorResponse,
};

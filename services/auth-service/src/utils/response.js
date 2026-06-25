export const sendErrorResponse = (res, status, message, data = {}) => {
  res.status(status).send({ success: false, status, message, data });
};

export const sendSuccessResponse = (res, status, message, data = {}) => {
  res.status(status).send({ success: true, status, message, data });
}
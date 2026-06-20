const sendSuccess = (res, data = {}, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
    message,
    code: 'SUCCESS',
  });
};

const sendError = (res, message, code, statusCode = 400) => {
  res.status(statusCode).json({
    success: false,
    data: {},
    message,
    code,
  });
};

module.exports = { sendSuccess, sendError };

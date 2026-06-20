const AppError = require('../errors/AppError');

const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      data: {},
      message: err.message,
      code: err.code,
    });
  }

  if (err.name === 'ZodError') {
    const issues = err.issues || err.errors || [];
    const message = issues[0]?.message || 'Validation failed';
    return res.status(400).json({
      success: false,
      data: {},
      message,
      code: 'VALIDATION_ERROR',
    });
  }

  console.error(err);
  return res.status(500).json({
    success: false,
    data: {},
    message: 'Internal server error',
    code: 'INTERNAL_ERROR',
  });
};

module.exports = errorHandler;

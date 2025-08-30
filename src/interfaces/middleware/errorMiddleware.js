const config = require('../../config/environment');
const {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
} = require('../../domain/errors/DomainErrors');

const errorMiddleware = (error, req, res, next) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (error instanceof ValidationError) {
    statusCode = 400;
    message = error.message;
  } else if (error instanceof UnauthorizedError) {
    statusCode = 401;
    message = error.message;
  } else if (error instanceof ForbiddenError) {
    statusCode = 403;
    message = error.message;
  } else if (error instanceof NotFoundError) {
    statusCode = 404;
    message = error.message;
  } else if (error instanceof ConflictError) {
    statusCode = 409;
    message = error.message;
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(error.errors).map(e => e.message).join(', ');
  } else if (error.code === 11000) {
    statusCode = 409;
    message = 'Resource already exists';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  const response = {
    success: false,
    message,
    ...(config.nodeEnv === 'development' && { stack: error.stack }),
  };

  console.error('Error:', error);
  res.status(statusCode).json(response);
};

module.exports = errorMiddleware;
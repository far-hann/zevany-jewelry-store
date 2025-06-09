const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error:', err);

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = {
      message,
      statusCode: 401
    };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = {
      message,
      statusCode: 401
    };
  }

  // Stripe errors
  if (err.type && err.type.startsWith('Stripe')) {
    let message = 'Payment processing error';
    
    switch (err.type) {
      case 'StripeCardError':
        message = err.message || 'Your card was declined';
        break;
      case 'StripeRateLimitError':
        message = 'Too many requests made to the API too quickly';
        break;
      case 'StripeInvalidRequestError':
        message = 'Invalid parameters were supplied to Stripe\'s API';
        break;
      case 'StripeAPIError':
        message = 'An error occurred internally with Stripe\'s API';
        break;
      case 'StripeConnectionError':
        message = 'Some kind of error occurred during the HTTPS communication';
        break;
      case 'StripeAuthenticationError':
        message = 'Authentication with Stripe\'s API failed';
        break;
      default:
        message = 'Payment processing error';
    }
    
    error = {
      message,
      statusCode: 400
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { errorHandler };

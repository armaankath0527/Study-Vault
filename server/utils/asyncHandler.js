// Wraps an async route handler so thrown errors are forwarded to Express's error middleware
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(err);
  if (err.name === 'CastError') return res.status(404).json({ success: false, message: 'Resource not found' });
  if (err.code === 11000) return res.status(409).json({ success: false, message: 'Email is already registered' });
  if (err.name === 'ValidationError') return res.status(400).json({ success: false, message: Object.values(err.errors)[0].message });
  res.status(err.statusCode || 500).json({ success: false, message: err.message || 'An unexpected error occurred' });
}

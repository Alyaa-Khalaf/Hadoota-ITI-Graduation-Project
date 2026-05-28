const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500

  res.status(statusCode).json({
    success: false,
    message: err.message || 'حدث خطأ في السيرفر',
    errors: err.errors || [],
    data: null
  })
}

export default errorHandler

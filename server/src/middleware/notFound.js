const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `المسار ${req.originalUrl} غير موجود`,
    data: null,
    errors: []
  });
}

export default notFound

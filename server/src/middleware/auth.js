import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح — يرجى تسجيل الدخول',
        data: null,
        errors: []
      })
    }
    // change the req.user to accept id and _id
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = {
      ...decoded,
      _id: decoded.id,
    };
    // console.log(decoded);
    // req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'التوكن غير صالح أو منتهي',
      data: null,
      errors: []
    })
  }
}

export default authMiddleware

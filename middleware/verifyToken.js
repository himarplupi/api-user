const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
  const { JWT_SECRET_KEY } = process.env
  const bearerHeader = req.headers.authorization
  console.log(bearerHeader)

  if (bearerHeader) {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]

    jwt.verify(bearerToken, JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        err.statusCode = 403
        err.status = 'fail'
        return next(err)
      }

      req.user = decoded.data.user
      return next()
    })
  } else {
    return res.status(403).json({
      status: 'fail',
      message: 'jwt must be provided'
    })
  }
}

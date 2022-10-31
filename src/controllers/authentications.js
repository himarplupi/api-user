const jwt = require('jsonwebtoken')

const ServiceAuthentication = require('../services/ServiceAuthentication')
const ServiceUser = require('../services/ServiceUser')

// Login
const createAuthentication = async (req, res) => {
  try {
    const { email, password } = req.body

    const { user_id: userId, token: refreshToken } = await ServiceAuthentication.createAuthentication(email, password)
    const user = await ServiceUser.get(userId)
    const accessToken = jwt.sign({ data: { user } }, process.env.JWT_SECRET_KEY)

    return res.json({
      status: 'success',
      data: {
        token: {
          access_token: accessToken,
          refresh_token: refreshToken
        }
      }
    })
  } catch (err) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  }
}

// Logout
const deleteAuthentication = async (req, res) => {
  try {
    const { id: userId } = jwt.verify(req.body.token, process.env.JWT_SECRET_KEY).data.user
    if (userId) {
      await ServiceAuthentication.deleteAuthentication(userId)
    }

    return res.json({
      status: 'success',
      message: 'proses logout berhasil'
    })
  } catch (err) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  }
}

module.exports = {
  createAuthentication,
  deleteAuthentication
}

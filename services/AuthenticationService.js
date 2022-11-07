const crypto = require('crypto')
const bcrypt = require('bcrypt')

const { User, Authentication } = require('../database/models')
const AuthenticationError = require('../exceptions/AuthenticationError')

// Login
const createAuthentication = async (email, password) => {
  const refreshToken = crypto.randomBytes(32).toString('hex')
  const user = await User.findOne({
    where: {
      email
    }
  })

  if (!user) {
    throw new AuthenticationError('kredensial tidak valid')
  }

  const matchPassword = bcrypt.compareSync(password, user.password)
  if (!matchPassword) {
    throw new AuthenticationError('kredensial tidak valid')
  }

  const authentication = await Authentication.create({
    user_id: user.id,
    token: refreshToken
  })

  return authentication
}

// Logout
const deleteAuthentication = async (userId) => {
  const user = await User.findByPk(userId)
  if (!user) {
    throw new AuthenticationError('kredensial tidak valid')
  }

  await Authentication.destroy({
    where: { user_id: userId }
  })

  return true
}

module.exports = {
  createAuthentication,
  deleteAuthentication
}

const crypto = require('crypto')
const bcrypt = require('bcrypt')

const { User, Authentication } = require('../database/models')
const NotFoundError = require('../exceptions/NotFoundError')
const ClientError = require('../exceptions/ClientError')

// Login
const createAuthentication = async (email, password) => {
  const refreshToken = crypto.randomBytes(32).toString('hex')
  const user = await User.findOne({
    where: {
      email
    }
  })

  if (!user) {
    throw new NotFoundError('user tidak ditemukan')
  }

  const matchPassword = bcrypt.compareSync(password, user.password)
  if (!matchPassword) {
    throw new ClientError('password tidak valid')
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
    throw new NotFoundError('user tidak ditemukan')
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

const bcrypt = require('bcrypt')
const { Op } = require('sequelize')

const { User, Authentication } = require('../database/models')
const ConflictError = require('../exceptions/ConflictError')
const NotFoundError = require('../exceptions/NotFoundError')

const getAll = async (query = null) => {
  const options = {
    attributes: {
      exclude: ['password']
    },
    order: [
      ['name', 'ASC']
    ]
  }

  // Pagination
  const { page = 1, limit = 10, search } = query
  const skip = (parseInt(page) - 1) * parseInt(limit)

  if (search) {
    // Search by name
    options.where = {
      name: {
        [Op.iLike]: `${search}%`
      }
    }
  }

  if (page && limit) {
    options.offset = skip
    options.limit = parseInt(limit)
    options.subQuery = false
  }

  const { count, rows: users } = await User.findAndCountAll(options)

  const data = {
    users: (users.length === 1) ? users[0] : users,
    metadata: {
      total_data: count,
      total_page: Math.ceil(count / parseInt(limit)),
      data_per_page: parseInt(limit),
      current_page: parseInt(page)
    }
  }

  return data
}

const get = async (id) => {
  const user = await User.findOne({
    where: { id },
    attributes: {
      exclude: ['password']
    }
  })

  if (!user) {
    throw new NotFoundError('user tidak ditemukan')
  }

  return user
}

const create = async (payload) => {
  try {
    const hashPassword = payload.password && bcrypt.hashSync(payload.password, 10)
    const user = await User.create({
      ...payload,
      password: hashPassword
    })

    return user
  } catch (err) {
    throw new ConflictError('user sudah ada')
  }
}

const update = async (id, payload) => {
  const user = await get(id)

  // Update email
  if (payload.email && payload.email !== user.email) {
    const userEmailIsExist = await User.findOne({
      where: {
        email: payload.email
      }
    })

    // email is exist
    if (userEmailIsExist) {
      throw new ConflictError('user email sudah digunakan')
    }
  }

  // Update password
  if (payload.password) {
    payload.password = bcrypt.hashSync(payload.password, 10)
  }

  const userUpdated = user.update(payload)

  return userUpdated
}

const destroy = async (id) => {
  const user = await User.findByPk(id)
  if (!user) {
    throw new NotFoundError('user tidak ditemukan')
  }

  // cek user login
  await Authentication.destroy({
    where: {
      user_id: id
    }
  })

  const userDeleted = user.destroy()

  return userDeleted
}

module.exports = {
  getAll,
  get,
  create,
  update,
  destroy
}

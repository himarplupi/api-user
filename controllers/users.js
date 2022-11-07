const fs = require('fs')
const AuthorizationError = require('../exceptions/AuthorizationError')

const userService = require('../services/UserService')

const getAvatarUrl = (req, filename) =>
  `${req.protocol}://${req.get('host')}/images/${filename || 'no-photo-available.png'}`

const getAll = async (req, res) => {
  const query = {}

  const { page, limit } = req.query

  // search by name
  if (req.query.search) {
    query.search = req.query.search
  }

  if (page && limit) {
    query.page = page
    query.limit = limit
  }

  const { metadata, users } = await userService.getAll(query)

  // Pagination
  const links = {}
  if (page > 1) {
    links.prev = `${req.protocol}://${req.get('host')}/users?page=${parseInt(page) - 1}&limit=${limit}`
    metadata.links = links
  }

  if (page < metadata.total_page) {
    links.next = `${req.protocol}://${req.get('host')}/users?page=${parseInt(page) + 1}&limit=${limit}`
    metadata.links = links
  }

  let usersMapped
  if (page && page > metadata.total_page) {
    usersMapped = []
  } else {
    usersMapped = users.length
      ? [...users.map((user) => ({
          ...user.dataValues,
          avatar: getAvatarUrl(req, user.avatar)
        }))]
      : ({
          ...users.dataValues,
          avatar: getAvatarUrl(req, users.avatar)
        })
  }

  return res.json({
    status: 'success',
    data: {
      users: usersMapped,
      metadata
    }
  })
}

const get = async (req, res, next) => {
  try {
    const { id: userId } = req.params
    const user = await userService.get(userId)
    user.avatar = getAvatarUrl(req, user.avatar)

    return res.json({
      status: 'success',
      data: {
        user
      }
    })
  } catch (err) {
    next(err)
  }
}

const create = async (req, res, next) => {
  try {
    const { body } = req
    await userService.create(body)

    return res.status(201).json({
      status: 'success',
      message: 'user baru berhasil dibuat'
    })
  } catch (err) {
    next(err)
  }
}

const update = async (req, res, next) => {
  try {
    const { id: userId } = req.params
    const { name, email, role } = req.body

    const body = {
      name, email
    }

    if (role) {
      if (req.user.role === 'admin') {
        body.role = role
      } else {
        throw new AuthorizationError('hak akses tidak valid')
      }
    }

    // Update password
    const { password, confirm_password: confirmPassword } = req.body
    if (password && confirmPassword) {
      body.password = password
    }

    // Update avatar/photo profile
    if (req.file) {
      const { avatar } = await userService.get(userId)
      if (avatar) {
        fs.unlinkSync(`./public/uploads/images/${avatar}`)
      }
      body.avatar = req.file.filename
    }

    await userService.update(userId, body)

    return res.status(200).json({
      status: 'success',
      message: 'user berhasil diperbarui'
    })
  } catch (err) {
    next(err)
  }
}

const destroy = async (req, res, next) => {
  try {
    const { id: userId } = req.params
    const { avatar } = await userService.get(userId)
    if (avatar) {
      fs.unlinkSync(`./public/uploads/images/${avatar}`)
    }

    await userService.destroy(userId)

    return res.status(200).json({
      status: 'success',
      message: 'user berhasil dihapus'
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getAll,
  create,
  get,
  update,
  destroy
}

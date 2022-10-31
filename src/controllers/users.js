const fs = require('fs')

const serviceUser = require('../services/ServiceUser')

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

  const { metadata, users } = await serviceUser.getAll(query)

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

  return res.json({
    status: 'success',
    data: {
      users: users.length
        ? [...users.map((user) => ({
            ...user.dataValues,
            avatar: getAvatarUrl(req, user.avatar)
          }))]
        : ({
            ...users.dataValues,
            avatar: getAvatarUrl(req, users.avatar)
          }),
      metadata
    }
  })
}

const get = async (req, res) => {
  try {
    const { id: userId } = req.params
    const user = await serviceUser.get(userId)
    user.avatar = getAvatarUrl(req, user.avatar)

    return res.json({
      status: 'success',
      data: {
        user
      }
    })
  } catch (err) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  }
}

const create = async (req, res) => {
  try {
    const { body } = req
    await serviceUser.create(body)

    return res.status(201).json({
      status: 'success',
      message: 'user baru berhasil dibuat'
    })
  } catch (err) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  }
}

const update = async (req, res) => {
  try {
    const { id: userId } = req.params
    const { name, email } = req.body

    const body = {
      name, email
    }

    // Update password
    const { password, confirm_password: confirmPassword } = req.body
    if (password && confirmPassword) {
      body.password = password
    }

    // Update avatar/photo profile
    if (req.file) {
      const { avatar } = await serviceUser.get(userId)
      if (avatar) {
        fs.unlinkSync(`./public/uploads/images/${avatar}`)
      }
      body.avatar = req.file.filename
    }

    await serviceUser.update(userId, body)

    return res.status(200).json({
      status: 'success',
      message: 'user berhasil diperbarui'
    })
  } catch (err) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  }
}

const destroy = async (req, res) => {
  try {
    const { id: userId } = req.params
    const { avatar } = await serviceUser.get(userId)
    if (avatar) {
      fs.unlinkSync(`./public/uploads/images/${avatar}`)
    }

    await serviceUser.destroy(userId)

    return res.status(200).json({
      status: 'success',
      message: 'user berhasil dihapus'
    })
  } catch (err) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  }
}

module.exports = {
  getAll,
  create,
  get,
  update,
  destroy
}

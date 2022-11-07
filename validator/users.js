const Joi = require('joi')
const InvariantError = require('../exceptions/InvariantError')

module.exports = async (req, res, next) => {
  const { body } = req
  let options = {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(16).required(),
    role: Joi.string().valid('admin', 'author')
  }

  if (req.method === 'PUT') {
    options = {
      ...options,
      name: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string().min(8).max(16)
    }

    // Validation update password
    if (body.password) {
      options = {
        ...options,
        confirm_password: Joi.any().valid(Joi.ref('password')).required()
      }
    }
  }

  try {
    // Schema input
    const schema = Joi.object(options)
    const validateResult = schema.validate(body)
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message)
    }

    next()
  } catch (err) {
    next(err)
  }
}

const path = require('path')
const multer = require('multer')
const ClientError = require('../exceptions/ClientError')

module.exports = (req, res, next) => {
  const destFile = path.resolve('./public/uploads/images')
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destFile)
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname))
    }
  })

  const maxSize = 2 * 1024 * 1024 // = 2MB
  const fileFilter = (req, file, cb) => {
    const validMimeType = ['png', 'jpg', 'jpeg']
    const [fileType, extFile] = file.mimetype.split('/')
    const mimeTypeIsValid = validMimeType.includes(extFile.toLowerCase())

    // cek mimetype
    if (fileType.toLowerCase() === 'image' && mimeTypeIsValid) {
      cb(null, true)
    } else {
      cb(null, false)
      return cb(new ClientError('file tidak valid'))
    }
  }

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: maxSize }
  }).single('avatar')

  upload(req, res, (err) => {
    if (err) {
      // error file size
      if (err instanceof multer.MulterError) {
        err.statusCode = 400
        err.status = 'bad request'
        err.message = `ukuran file maksimal ${maxSize / 1024 / 1024}MB`
      }

      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      })
    }

    return next()
  })
}

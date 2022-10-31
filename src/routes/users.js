const express = require('express')
const router = express.Router()

const path = require('path')
const multer = require('multer')

const destFile = path.resolve('./public/uploads/images')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, destFile)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({ storage })

const usersController = require('../controllers/users')
const usersValidator = require('../validator/users')

router.get('/', usersController.getAll)
router.get('/:id', usersController.get)
router.post('/', usersValidator, usersController.create)
router.put('/:id', [usersValidator, upload.single('avatar')], usersController.update)
router.delete('/:id', usersController.destroy)

module.exports = router

const express = require('express')
const router = express.Router()

const upload = require('../middleware/upload')
const verifyToken = require('../middleware/verifyToken')

const userController = require('../controllers/users')
const userValidator = require('../validator/users')

router.use(verifyToken)
router.get('/', userController.getAll)
router.get('/:id', userController.get)
router.post('/', userValidator, userController.create)
router.put('/:id', [userValidator, upload], userController.update)
router.delete('/:id', userController.destroy)

module.exports = router

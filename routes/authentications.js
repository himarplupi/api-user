const express = require('express')
const router = express.Router()

const verifyToken = require('../middleware/verifyToken')

const authenticationsController = require('../controllers/authentications')

router.post('/', authenticationsController.createAuthentication)
router.delete('/', verifyToken, authenticationsController.deleteAuthentication)

module.exports = router

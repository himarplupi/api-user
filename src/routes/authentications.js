const express = require('express')
const router = express.Router()

const authenticationsController = require('../controllers/authentications')

router.post('/', authenticationsController.createAuthentication)
router.post('/logout', authenticationsController.deleteAuthentication)

module.exports = router

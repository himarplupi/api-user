const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const authenticationsRouter = require('./routes/authentications')

require('dotenv').config()
const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../public')))

app.use('/images', express.static(path.join(__dirname, '../public/uploads/images')))
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/auth', authenticationsRouter)

module.exports = app

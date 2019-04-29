const nodemailer = require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars')
const exphbs = require('express-handlebars')
const mailconfig = require('../../config/mail')

const transport = nodemailer.createTransport(mailconfig)

const viewPath = path.resolve(__dirname, '..', 'views', 'emails')

transport.use(
  'compile',
  hbs({
    viewEngine: exphbs.create({
      partialsDir: path.resolve(viewPath)
    }),
    viewPath,
    extName: '.hbs'
  })
)

module.exports = transport

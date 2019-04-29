const jwt = require('jsonwebtoken')
const authConfiq = require('../../config/auth')
const { promisify } = require('util')

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' })
  }

  // Authorization token comes as: Bearer TOKEN
  // We just need the TOKEN part
  const [, token] = authHeader.split(' ')

  try {
    const decoded = await promisify(jwt.verify)(token, authConfiq.secret)

    req.userId = decoded.id

    return next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid Token' })
  }
}

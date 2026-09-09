const jwt = require('jsonwebtoken')
const { response } = require('../constants')
const { languageFunc } = require('../i18n/i18n')

const Signup = require('../models/signup')

const auth = () => {
  return async function (req, res, next) {
    const i18n = languageFunc(req?.language || 'en')
    try {
      const authHeader = req.headers.authorization
      const bearer = 'Bearer '
      if (!authHeader || !authHeader.startsWith(bearer)) {
        return response('api', res, false, 401, 'accessDenied')
      }

      const token = authHeader.replace(bearer, '')
      const secretKey = process.env.SECRET_JWT || 'secretAlwaysSecret'

      const decoded = jwt.verify(token, secretKey)
      if (decoded?.email) {
        const findUser = await Signup.findOne({ where: { Email: decoded?.email }, raw: true })
        if (findUser) {
          delete findUser.Pwd

          req.current_user = findUser
          req.current_user_id = findUser?.UserID

          return next()
        } else {
          throw Error(i18n.__('invalidUser'))
        }
      }
    } catch (error) {
      return response('api', req, res, false, 401, 'invalidToken', error)
    }
  }
}

module.exports = auth

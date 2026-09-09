const validator = require('validator')
const { response } = require('../constants')

const loginValidator = async (req, res, next) => {
  const { body } = req
  try {
    if (!validator?.isEmail(body?.email)) {
      return response('login', req, res, false, 422, 'invalidEmail', null)
    }
    if (!body?.password || validator?.isEmpty(body?.password)) {
      return response('login', req, res, false, 422, 'invalidPassword', null)
    }

    return next()
  } catch (error) {
    console.error('VALIDATION ERROR IN LOGIN ==> ', error)

    return response('login', req, res, false, 422, 'failedLogin', null)
  }
}

const signupValidator = async (req, res, next) => {
  const { body } = req
  try {
    if (!body?.email || !validator?.isEmail(body?.email)) {
      return response('sign_up', req, res, false, 400, 'invalidEmail', null)
    }
    if (!body?.password || !validator?.isLength(body?.password, { min: 6 })) {
      return response('sign_up', req, res, false, 400, 'weakPassword', null)
    }
    if (!body?.countryID || isNaN(Number(body?.countryID))) {
      return response('sign_up', req, res, false, 400, 'invalidCountryID', null)
    }

    return next()
  } catch (error) {
    console.error('VALIDATION ERROR IN SIGNUP ==> ', error)

    return response('sign_up', req, res, false, 422, 'failedSignup', null)
  }
}

module.exports = { loginValidator, signupValidator }

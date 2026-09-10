const jwt = require('jsonwebtoken')
const { response } = require('../constants')
const Signup = require('../models/signup')

require('dotenv').config()

// ** Show logs
const showLogs = true

const loginSuccess = async (req, res) => {
  try {
    console.log('req?.user :', req?.user)
    if (req?.user) {
      const { email } = req?.user
      const user = await Signup.findOne({ where: { email: req?.user?.email }, raw: true })

      if (user) {
        let isVerified = false
        if (user?.OrganizationName && user?.OrganizationSize && user?.CountryID) {
          isVerified = true
        }

        if (!user?.ProfilePicture) {
          await Signup.update({ ProfilePicture: req?.user?.picture }, { where: { email: req?.user?.email }, raw: true })
          user.ProfilePicture = req?.user?.picture
        }

        const responseObj = { userData: user, isVerified }
        delete responseObj?.userData?.Pwd

        const secretKey = process.env.SECRET_JWT || 'secretAlwaysSecret'
        const refreshTokenSecretKey = process.env.REFRESH_JWT || 'secretOrPrivateKey'

        const token = jwt.sign({ email }, secretKey, {
          expiresIn: '24h'
        })

        const refreshToken = jwt.sign(
          {
            email
          },
          refreshTokenSecretKey,
          {
            expiresIn: '365d'
          }
        )

        const tokenTime = jwt.verify(token, secretKey)
        const refreshTokenTime = jwt.verify(refreshToken, refreshTokenSecretKey)

        responseObj.token = token
        responseObj.tokenTime = tokenTime?.exp
        responseObj.refreshToken = refreshToken
        responseObj.refreshTokenTime = refreshTokenTime?.exp

        return response('google-auth-login', req, res, true, 200, 'successGoogleAuthLogin', responseObj)
      } else {
        const createUserData = {
          Email: req?.user?.email,
          Name: req?.user?.name
        }

        const responseObj = { userData: createUserData, isVerified: false }

        return response('google-auth-login', req, res, true, 202, 'successGoogleAuthLogin', responseObj)
      }
    } else {
      return response('google-auth-login', req, res, false, 404, 'failedGoogleAuthLogin', req?.user)
    }
  } catch (error) {
    console.log('error :', error)
    showLogs && console.error('Google Login Error : loginSuccess ', error)

    return response('google-auth-login', req, res, false, 422, 'failedGoogleAuthLogin', error, error)
  }
}

const loginFailed = async (req, res) => {
  res.status(401).json({
    error: true,
    message: 'Log in failure'
  })
}

module.exports.googleAuthController = { loginSuccess, loginFailed }

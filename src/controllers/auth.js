const jwt = require('jsonwebtoken')
const { sequelize } = require('../db-connection')
const { response } = require('../constants')
const Signup = require('../models/signup')

// ** Turn logs on
const showLogs = true

// ** Login API
const createLoginRecord = async (req, res) => {
  try {
    const { email, password, latitude, longitude } = req?.body

    const loginUser = await sequelize.query(
      'EXEC SPC_Login @Email = :Email, @Pwd = :Pwd, @Latitude = :Latitude, @Longtitude = :Longtitude',
      {
        type: sequelize?.QueryTypes?.SELECT,
        row: true,
        replacements: {
          Email: email,
          Pwd: password,
          Latitude: latitude ?? null,
          Longtitude: longitude ?? null
        }
      }
    )

    const loginData = loginUser?.[0]

    if (loginData) {
      if (loginData?.Code === 5999) {
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

        const userData = await Signup.findOne({ where: { email }, raw: true })
        const responseData = { ...userData }
        delete responseData?.Pwd

        const loginBody = {
          userData: responseData,
          id: responseData?.UserID,
          token,
          refreshToken,
          tokenTime: tokenTime?.exp,
          refreshTokenTime: refreshTokenTime?.exp
        }

        return response('login', req, res, true, 200, 'successLogin', loginBody)
      } else {
        return response('login', req, res, false, 422, 'invalidLogin', loginUser)
      }
    } else {
      return response('login', req, res, false, 422, 'failedLogin', loginUser)
    }
  } catch (error) {
    console.error('Error in api call AUTH => (createLoginRecord)', error)

    return response('login', req, res, false, 422, 'invalidLogin', error)
  }
}

// ** Verify User JWT
const verifyToken = async (req, res) => {
  const authHeader = req.headers.authorization
  const bearer = 'Bearer '
  if (!authHeader || !authHeader.startsWith(bearer)) {
    return response('verify-token', req, res, false, 401, 'accessDenied')
  }
  const token = authHeader.replace(bearer, '')
  const secretKey = process.env.SECRET_JWT || 'secretAlwaysSecret'
  try {
    const decoded = jwt.verify(token, secretKey)
    if (!decoded) {
      return response('verify-token', req, res, false, 401, 'invalidToken')
    } else {
      const userData = await Signup.findOne({ where: { email: decoded?.email }, raw: true })

      if (userData) {
        const responseData = { ...userData }
        delete responseData?.Pwd
        const newToken = jwt.sign({ email: decoded?.email }, secretKey, {
          expiresIn: '24h'
        })
        const tokenTime = jwt.verify(newToken, secretKey)
        const responseBody = {
          id: userData?.UserID,
          userData: responseData,
          token: newToken,
          tokenTime: tokenTime.exp
        }

        return response('verify-token', req, res, true, 200, 'tokenVerified', responseBody)
      } else {
        return response('verify-token', req, res, false, 401, 'invalidToken')
      }
    }
  } catch (err) {
    return response('verify-token', req, res, false, 422, 'tokenNotMatch', err)
  }
}

// ** Create Token From Refresh Token
const createTokenFromRefreshToken = async (req, res) => {
  try {
    const refreshTokenSecretKey = process.env.REFRESH_JWT

    const secretKey = process.env.SECRET_JWT
    const decoded = jwt.verify(req.body.refresh_token, refreshTokenSecretKey)
    const { email } = decoded
    if (!email) {
      return response('refresh-token', req, res, false, 401, 'invalidToken')
    }

    const userData = await Signup.findOne({ where: { email: decoded?.email }, raw: true })
    if (userData) {
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

      const responseObj = {}

      responseObj.token = token
      responseObj.tokenTime = tokenTime?.exp
      responseObj.refreshToken = refreshToken
      responseObj.refreshTokenTime = refreshTokenTime?.exp

      return response('refresh-token', req, res, true, 200, 'tokenVerified', responseObj)
    } else {
      return response('refresh-token', req, res, false, 401, 'invalidToken')
    }
  } catch (error) {
    console.log('error :', error)

    return response('refresh-token', req, res, false, 422, 'invalidToken', error)
  }
}

// // ** Signup API
// const signUpUser = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       password,
//       accountSource,
//       countryID,
//       latitude,
//       longitude,
//       address,
//       organizationName,
//       organizationSize
//     } = req?.body

//     const user = await Signup.findOne({ where: { email }, raw: true })

//     if (!user) {
//       const createdUser = await sequelize.query(
//         'EXEC SPC_signup @Name = :Name, @EmailAddress = :EmailAddress, @Password = :Password, @Source = :Source, @CountryID = :CountryID, @Latitude = :Latitude, @Longtitude = :Longitude, @OrganizationName = :OrganizationName, @Organizationsize = :OrganizationSize, @Address = :Address',
//         {
//           type: sequelize.QueryTypes.SELECT,
//           row: true,
//           replacements: {
//             // Name: name ?? null,
//             // EmailAddress: email,
//             // Password: password,
//             // Source: accountSource ?? null,
//             // CountryID: countryID,
//             // Latitude: latitude,
//             // Longitude: longitude,
//             // OrganizationName: organizationName ?? null,
//             // OrganizationSize: organizationSize ?? null,
//             // Address: address
//              Name: name ?? null,
//             EmailAddress: email,
//             Password: password,
//             Source: accountSource ?? null,
//             CountryID: countryID ?? null,
//             Latitude: latitude ?? null,
//             Longtitude: longitude ?? null, // Changed to match stored procedure parameter
//             OrganizationName: organizationName ?? null,
//             OrganizationSize: organizationSize ?? null,
//             Address: address ?? null
//           }
//         }
//       )

//       if (createdUser?.[0]?.Code === 6000) {
//         return response('sign_up', req, res, false, 422, 'failedSignup', user)
//       }
//       if (createdUser?.[0]?.Code === 6999) {
//         return res.status(422).send({ status: false, statusCode: 422, message: createdUser?.[0]?.Message, data: null })
//       }

//       const responseObj = { ...req.body }
//       delete responseObj.password

//       const secretKey = process.env.SECRET_JWT || 'secretAlwaysSecret'
//       const refreshTokenSecretKey = process.env.REFRESH_JWT || 'secretOrPrivateKey'

//       const token = jwt.sign({ email }, secretKey, {
//         expiresIn: '24h'
//       })

//       const refreshToken = jwt.sign(
//         {
//           email
//         },
//         refreshTokenSecretKey,
//         {
//           expiresIn: '365d'
//         }
//       )

//       const tokenTime = jwt.verify(token, secretKey)
//       const refreshTokenTime = jwt.verify(refreshToken, refreshTokenSecretKey)

//       responseObj.token = token
//       responseObj.tokenTime = tokenTime?.exp
//       responseObj.refreshToken = refreshToken
//       responseObj.refreshTokenTime = refreshTokenTime?.exp

//       return response('sign_up', req, res, true, 201, 'successSignup', responseObj)
//     } else {
//       return response('sign_up', req, res, true, 422, 'signUpEmailExists', {})
//     }
//   } catch (error) {
//     console.log('error :', error)
//     showLogs && console.error('Error in api call AUTH => (signUpUser)', error)

//     return response('sign_up', req, res, false, 400, 'failedSignup', error)
//   }
// }

const signUpUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      accountSource,
      countryID,
      latitude,
      longitude,
      address,
      organizationName,
      organizationSize
    } = req?.body

    const user = await Signup.findOne({ where: { email }, raw: true })

    if (!user) {
      const createdUser = await sequelize.query(
        'EXEC SPC_signup @Name = :Name, @EmailAddress = :EmailAddress, @Password = :Password, @Source = :Source, @CountryID = :CountryID, @Latitude = :Latitude, @Longtitude = :Longtitude, @OrganizationName = :OrganizationName, @Organizationsize = :OrganizationSize, @Address = :Address',
        {
          type: sequelize.QueryTypes.SELECT,
          replacements: {
            Name: name ?? null,
            EmailAddress: email,
            Password: password,
            Source: accountSource ?? null,
            CountryID: countryID ?? null,
            Latitude: latitude ?? null,
            Longtitude: longitude ?? null, // Changed to match stored procedure parameter
            OrganizationName: organizationName ?? null,
            OrganizationSize: organizationSize ?? null,
            Address: address ?? null
          }
        }
      )

      // Check if createdUser is an array and has at least one element
      if (Array.isArray(createdUser) && createdUser.length > 0) {
        const result = createdUser[0];
        
        if (result?.Code === 6000) {
          return response('sign_up', req, res, false, 422, 'failedSignup', result)
        }
        if (result?.Code === 6999) {
          return res.status(422).send({ 
            status: false, 
            statusCode: 422, 
            message: result?.Message || 'Signup failed', 
            data: null 
          })
        }
      }

      // If we reach here, the stored procedure executed successfully
      const responseObj = { ...req.body }
      delete responseObj.password

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

      return response('sign_up', req, res, true, 201, 'successSignup', responseObj)
    } else {
      return response('sign_up', req, res, true, 422, 'signUpEmailExists', {})
    }
  } catch (error) {
    console.log('error :', error)
    showLogs && console.error('Error in api call AUTH => (signUpUser)', error)

    return response('sign_up', req, res, false, 400, 'failedSignup', error)
  }
}

const deleteUser = async (req, res) => {
  try {
    const { id } = req?.params

    const user = await Signup.findOne({ where: { UserID: id }, raw: true })

    if (!user) {
      return response('delete-user', req, res, true, 202, 'No User Found', {})
    }
    await Signup.destroy({ where: { UserID: id } })

    return response('delete-user', req, res, true, 200, 'User Deleted Successfully', null)
  } catch (error) {
    showLogs && console.error('Error in api call AUTH => (delete-user)', error)

    return response('delete-user', req, res, false, 422, 'Failed to delete user', {})
  }
}

module.exports.loginController = { createLoginRecord, verifyToken, createTokenFromRefreshToken, signUpUser, deleteUser }

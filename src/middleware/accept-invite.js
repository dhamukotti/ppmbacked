const jwt = require('jsonwebtoken')
const { response } = require('../constants')

const Signup = require('../models/signup')
const InviteMgt = require('../models/invite-management')

const checkUserInvitation = () => {
  return async function (req, res, next) {
    try {
      const invitationID = req?.params?.id

      if (!invitationID) {
        return response('accept-invite', req, res, false, 422, 'invitationNotFound')
      }

      const invitation = await InviteMgt.findByPk(invitationID)

      if (!invitation) {
        return response('accept-invite', req, res, false, 422, 'invitationNotFound')
      }

      const findUser = await Signup.findOne({
        where: { Email: invitation?.InvitedEmailaddress },
        attributes: ['Email', 'UserID']
      })

      const authHeader = req.headers.authorization
      const bearer = 'Bearer '
      if (!authHeader || !authHeader.startsWith(bearer)) {
        if (findUser) {
          return response('accept-invite', req, res, true, 307, 'acceptInviteNotLoggedIn', { redirect: '/login' })
        } else {
          return response('accept-invite', req, res, true, 307, 'acceptInviteNotRegistered', { redirect: '/register' })
        }
      }
      const token = authHeader.replace(bearer, '')
      const secretKey = process.env.SECRET_JWT || 'secretAlwaysSecret'

      const decoded = jwt.verify(token, secretKey)

      if (decoded?.email) {
        if (decoded?.email?.toUpperCase() !== invitation?.InvitedEmailaddress) {
          return response('accept-invite', req, res, true, 403, 'acceptInviteLoggedInWithDifferenAccount', {
            redirect: '/login'
          })
        }

        if (invitation?.Status === 'Accepted') {
          return response('accept-invite', req, res, true, 202, 'invitationAlreadyAccepted', {
            projectID: invitation?.ProjectID
          })
        }

        if (findUser) {
          delete findUser.Pwd

          req.current_user = findUser
          req.current_user_id = findUser?.UserID
          req.invitation = invitation

          return next()
        }
      }
    } catch (error) {
      console.log('error :', error)

      return response('accept-invite', req, res, false, 422, 'acceptInviteError', error)
    }
  }
}

module.exports = checkUserInvitation

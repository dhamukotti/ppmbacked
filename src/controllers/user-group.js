const { validationResult } = require('express-validator')
const { response } = require('../constants')
const { sequelize } = require('../db-connection')

const showLogs = false

const createUserGroupAction = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      const { email, organizationID } = req?.body
      await sequelize.query('EXEC spc_createUserGroup @InvEmail = :email, @OrganizationID = :organizationID', {
        type: sequelize?.QueryTypes?.SELECT,
        replacements: {
          email,
          organizationID
        },
        raw: true
      })

      return response('createUserGroup', req, res, true, 200, 'createUserGroupSuccess')
    } else {
      return response('createUserGroup', req, res, false, 400, 'createUserGroupValidationError', errors?.array())
    }
  } catch (error) {
    showLogs && console.log('Error : => : createUserGroup :', error)

    return response('createUserGroup', req, res, false, 422, 'createUserGroupActionFailed', null, error)
  }
}

const getUserGroup = async (req, res) => {
  try {
    const userID = req?.current_user?.UserID
    const procedure = await sequelize.query('EXEC spc_GetUserGroupInfo @UserID = :userID', {
      type: sequelize?.QueryTypes?.SELECT,
      replacements: {
        userID
      },
      raw: true
    })

    return response('getUserGroup', req, res, true, 200, 'getUserGroupSuccess', procedure)
  } catch (error) {
    showLogs && console.log('Error : => : getUserGroup :', error)

    return response('getUserGroup', req, res, false, 422, 'getUserGroupActionFailed', null, error)
  }
}

module.exports.userGroupController = {
  createUserGroupAction,
  getUserGroup
}

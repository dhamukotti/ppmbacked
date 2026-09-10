const { validationResult } = require('express-validator')
const { response } = require('../constants')
const { sequelize } = require('../db-connection')
const { commands } = require('../constants/command')
const Workspace = require('../models/workspace')
const UserProjects = require('../models/user-project')
const { Op } = require('@sequelize/core')

const showLogs = false

const listWorkspace = async (req, res) => {
  const { UserID } = req?.current_user

  try {
    // Find workspaces where the user is either the creator or a member in UserProjects
    const workspaces = await Workspace.findAll({
      where: {
        IsDelete: 0,
        [Op.or]: [
          { CreatedBy: UserID }, // Workspace created by the user
          { '$UserProjects.UserID$': UserID } // User is a member in UserProjects
        ]
      },
      include: [
        {
          model: UserProjects,
          required: false // Include UserProjects conditionally
        }
      ],
      distinct: true // Ensure distinct results
    })

    if (workspaces?.length !== 0) {
      return response('workspace-list', req, res, true, 200, 'workspaceListFound', workspaces)
    }

    return response('workspace-list', req, res, true, 202, 'workspaceListFound', [])
  } catch (error) {
    console.error('error :', error)

    return response('workspace-list', req, res, false, 422, 'workspaceListFailed')
  }
}

const workspaceAction = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      const { command, workspaceName, organizationID, workspaceID = null } = req?.body
      const procedure = await sequelize.query(
        'EXEC spc_WorkSpace @Command = :command, @Workspacename = :workspaceName, @CreateBy = :createBy, @OrganizationID = :organizationID, @WorkspaceID = :workspaceID, @DeletedBy = :deletedBy, @UpdatedBy = :updatedBy',
        {
          type: sequelize?.QueryTypes?.SELECT,
          replacements: {
            command,
            workspaceName,
            organizationID,
            workspaceID,
            createBy: req?.current_user?.UserID,
            deletedBy: req?.current_user?.UserID,
            updatedBy: req?.current_user?.UserID
          },
          raw: true
        }
      )

      const executed = procedure?.[0]

      if (executed.Code === 6001) {
        return response('workspace', req, res, false, 400, 'workspaceValidationInvalidCommandError', null, null)
      } else if (executed.Code === 5999) {
        return response('workspace', req, res, true, 200, 'workspaceSuccess')
      } else {
        return response('workspace', req, res, false, 400, 'workspaceValidationError', null, executed ?? null)
      }
    } else {
      return response('workspace', req, res, false, 400, 'workspaceValidationError', errors?.array())
    }
  } catch (error) {
    showLogs && console.log('ERROR : => : workspaceAction :', error)

    return response('workspace', req, res, false, 422, 'workspaceActionFailed', null, error)
  }
}

const addWorkspace = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      const { workspaceName, organizationID } = req?.body
      await sequelize.query(
        'EXEC spc_WorkSpace @Command = :command, @Workspacename = :workspaceName, @CreateBy = :createBy, @OrganizationID = :organizationID',
        {
          type: sequelize?.QueryTypes?.SELECT,
          replacements: {
            command: commands.workspaceCreate,
            workspaceName,
            organizationID,
            createBy: req?.current_user?.UserID
          },
          raw: true
        }
      )

      return response('workspace', req, res, true, 200, 'workspaceAddSuccess')
    } else {
      return response('workspace', req, res, false, 400, 'workspaceValidationError', errors?.array())
    }
  } catch (error) {
    showLogs && console.log('ERROR : => : workspaceAction :', error)

    return response('workspace', req, res, false, 422, 'workspaceAddFailed', null, error)
  }
}

const updateWorkspace = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      const { workspaceName, organizationID } = req?.body
      const workspaceID = Number(req?.params?.id)

      await sequelize.query(
        'EXEC spc_WorkSpace @Command = :command, @Workspacename = :workspaceName, @WorkspaceID = :workspaceID, @OrganizationID = :organizationID, @UpdatedBy = :updatedBy',
        {
          type: sequelize?.QueryTypes?.SELECT,
          replacements: {
            command: commands.workspaceUpdate,
            workspaceName,
            workspaceID,
            organizationID,
            updatedBy: req?.current_user?.UserID
          },
          raw: true
        }
      )

      return response('workspace', req, res, true, 200, 'workspaceUpdateSuccess')
    } else {
      return response('workspace', req, res, false, 400, 'workspaceValidationError', errors?.array())
    }
  } catch (error) {
    showLogs && console.log('ERROR : => : workspaceAction :', error)

    return response('workspace', req, res, false, 422, 'workspaceUpdateFailed', null, error)
  }
}

const deleteWorkspace = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      const { workspaceName, organizationID } = req?.body
      const workspaceID = Number(req?.params?.id)
      await sequelize.query(
        'EXEC spc_WorkSpace @Command = :command, @Workspacename = :workspaceName, @WorkspaceID = :workspaceID, @OrganizationID = :organizationID, @DeletedBy = :deletedBy',
        {
          type: sequelize?.QueryTypes?.SELECT,
          replacements: {
            command: commands.workspaceDelete,
            workspaceName,
            workspaceID,
            organizationID,
            deletedBy: req?.current_user?.UserID
          },
          raw: true
        }
      )

      return response('workspace', req, res, true, 200, 'workspaceDeleteSuccess')
    } else {
      return response('workspace', req, res, false, 400, 'workspaceValidationError', null, errors?.array())
    }
  } catch (error) {
    showLogs && console.log('ERROR : => : workspaceAction :', error)

    return response('workspace', req, res, false, 422, 'workspaceDeleteFailed', null, error)
  }
}

module.exports.workspaceController = {
  workspaceAction,
  listWorkspace,
  addWorkspace,
  updateWorkspace,
  deleteWorkspace
}

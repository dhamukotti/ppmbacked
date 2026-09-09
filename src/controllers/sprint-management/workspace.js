const { validationResult } = require('express-validator')
const { response } = require('../../constants')
const { sequelize } = require('../../db-connection')
const { commands } = require('../../constants/command')
const SprintWorkspace = require('../../models/sprint-management/sprint-workspace')

const showLogs = true

const listWorkspace = async (req, res) => {
  try {
    // Find workspaces where the user is either the creator or a member in UserProjects
    const workspaces = await SprintWorkspace.findAll({
      where: { IsDelete: 0 }
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

const addWorkspace = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      const { workspaceName, organizationID } = req?.body

      await SprintWorkspace.create({
        WorkspaceName: workspaceName,
        OrganizationID: organizationID,
        IsDelete: 0,
        CreatedBy: req?.current_user?.UserID
      })

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
      const workspaceID = Number(req?.params?.id)
      await SprintWorkspace.update({ IsDelete: 1 }, { where: { WorkspaceID: workspaceID } })

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
  listWorkspace,
  addWorkspace,
  updateWorkspace,
  deleteWorkspace
}

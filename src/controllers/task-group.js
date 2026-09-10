const { validationResult } = require('express-validator')
const { response } = require('../constants')
const { sequelize } = require('../db-connection')
const { commands } = require('../constants/command')
const { TaskGroups, ColumnTypeLookup, AdditionalColumnSubTask } = require('../models')
const AdditionalColumnValuesTask = require('../models/additional-column-task')
const { sendProjectUpdate } = require('../socket-connection')

const showLogs = true

const listTaskGroup = async (req, res) => {
  const projectID = Number(req?.query?.projectID)

  try {
    if (projectID) {
      const taskGroups = await TaskGroups.findAll({
        where: { ProjectID: projectID, IsDelete: 0 },
        include: [
          {
            model: AdditionalColumnValuesTask,
            include: [{ model: ColumnTypeLookup, as: 'ColumnType' }],
            as: 'additionalColumns',
            where: { IsDelete: 0 },
            required: false // Include task groups even if they don't have additional columns
          }
        ]
      })

      if (taskGroups?.length !== 0) {
        return response('taskGroup-list', req, res, true, 200, 'taskGroupListFound', taskGroups)
      }
    }

    return response('taskGroup-list', req, res, true, 202, 'taskGroupListFound', [])
  } catch (error) {
    console.error('error :', error)

    return response('taskGroup-list', req, res, false, 422, 'taskGroupListFailed')
  }
}

const taskgroupAction = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      const { command, taskGroupName, organizationID, taskGroupID = null } = req?.body
      const procedure = await sequelize.query(
        'EXEC spc_TaskGroupMgt @Command = :command, @Workspacename = :taskGroupName, @CreateBy = :createBy, @OrganizationID = :organizationID, @WorkspaceID = :taskGroupID, @DeletedBy = :deletedBy, @UpdatedBy = :updatedBy',
        {
          type: sequelize?.QueryTypes?.SELECT,
          replacements: {
            command,
            taskGroupName,
            organizationID,
            taskGroupID,
            createBy: req?.current_user?.UserID,
            deletedBy: req?.current_user?.UserID,
            updatedBy: req?.current_user?.UserID
          },
          raw: true
        }
      )

      const executed = procedure?.[0]

      if (executed.Code === 6001) {
        return response('taskGroup', req, res, false, 400, 'taskGroupValidationInvalidCommandError', null, null)
      } else if (executed.Code === 5999) {
        return response('taskGroup', req, res, true, 200, 'taskGroupSuccess')
      } else {
        return response('taskGroup', req, res, false, 400, 'taskGroupValidationError', null, executed ?? null)
      }
    } else {
      return response('taskGroup', req, res, false, 400, 'taskGroupValidationError', errors?.array())
    }
  } catch (error) {
    showLogs && console.log('ERROR : => : taskgroupAction :', error)

    return response('taskGroup', req, res, false, 422, 'taskgroupActionFailed', null, error)
  }
}

const addTaskGroup = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      const { groupName, projectID } = req?.body
      await sequelize.query(
        'EXEC spc_TaskGroupMgt @Command = :command, @Groupname = :groupName, @CreateBy = :createBy, @ProjectID = :projectID',
        {
          type: sequelize?.QueryTypes?.SELECT,
          replacements: {
            command: commands.taskGroupCreate,
            groupName,
            projectID,
            createBy: req?.current_user?.UserID
          },
          raw: true
        }
      )

      return response('taskGroup', req, res, true, 200, 'taskGroupAddSuccess')
    } else {
      return response('taskGroup', req, res, false, 400, 'taskGroupValidationError', errors?.array())
    }
  } catch (error) {
    showLogs && console.log('ERROR : => : addTaskGroup :', error)

    return response('taskGroup', req, res, false, 422, 'taskGroupAddFailed', null, error)
  }
}

const updateTaskGroup = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      const { groupName } = req?.body
      const taskGroupID = Number(req?.params?.id)

      await sequelize.query(
        'EXEC spc_TaskGroupMgt @Command = :command, @Groupname = :groupName, @TaskGroupID = :taskGroupID, @UpdateBy = :updatedBy',
        {
          type: sequelize?.QueryTypes?.SELECT,
          replacements: {
            command: commands.taskGroupUpdate,
            groupName,
            taskGroupID,
            updatedBy: req?.current_user?.UserID
          },
          raw: true
        }
      )

      return response('taskGroup', req, res, true, 200, 'taskGroupUpdateSuccess')
    } else {
      return response('taskGroup', req, res, false, 400, 'taskGroupValidationError', errors?.array())
    }
  } catch (error) {
    showLogs && console.log('ERROR : => : updateTaskGroup :', error)

    return response('taskGroup', req, res, false, 422, 'taskGroupUpdateFailed', null, error)
  }
}

const deleteTaskGroup = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      const taskGroupID = Number(req?.params?.id)
       const { projectID, groupName } = req.body

      await sequelize.query(
        'EXEC spc_TaskGroupMgt @Command = :command, @TaskGroupID = :taskGroupID, @DeletedBy = :deletedBy, @ProjectID = :projectID,@Groupname = :groupName',
        {
          type: sequelize?.QueryTypes?.SELECT,
          replacements: {
            command: commands.taskGroupDelete,
            taskGroupID,
            deletedBy: req?.current_user?.UserID,
             projectID,
            groupName
          },
          raw: true
        }
      )

      return response('taskGroup', req, res, true, 200, 'taskGroupDeleteSuccess')
    } else {
      return response('taskGroup', req, res, false, 400, 'taskGroupValidationError', null, errors?.array())
    }
  } catch (error) {
    showLogs && console.log('ERROR : => : deleteTaskGroup :', error)

    return response('taskGroup', req, res, false, 422, 'taskGroupDeleteFailed', null, error)
  }
}

const createColumn = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      const { columnName, columnTypeID, taskGroupID, workspaceID, projectID } = req?.body
      await sequelize.query(
        'EXEC spc_AdditionalColumnMgt @Command = :command, @ColumnName = :columnName, @ColumnTypeID = :columnTypeID, @UserID = :userID, @TaskGroupID = :taskGroupID, @WorkspaceID = :workspaceID, @ProjectID = :projectID',
        {
          type: sequelize?.QueryTypes?.SELECT,
          replacements: {
            command: commands.additionalColumnCreate,
            columnName,
            columnTypeID,
            userID: req?.current_user?.UserID,
            taskGroupID,
            workspaceID,
            projectID
          },
          raw: true
        }
      )
          console.log(req?.current_user?.UserID,req?.current_user)

      sendProjectUpdate(
        projectID?.toString(),
        JSON.stringify({ value: 'createdColumn', by: req?.current_user?.UserID, user: req?.current_user })

    
      )

      return response('additionalColumnCreate', req, res, true, 200, 'additionalColumnCreateSuccess')
    } else {
      return response(
        'additionalColumnCreate',
        req,
        res,
        false,
        400,
        'additionalColumnCreateValidationError',
        errors?.array()
      )
    }
  } catch (error) {
    showLogs && console.log('ERROR : => : createColumn :', error)

    return response('taskGroup', req, res, false, 422, 'additionalColumnCreateError', null, error)
  }
}

const updateColumn = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      const { columnName, projectID, isSubTask = false } = req?.body
      if (isSubTask) {
        const columnID = req?.params?.id
        await AdditionalColumnSubTask.update({ ColumnName: columnName }, { where: { AdditionalColumnID: columnID } })

        sendProjectUpdate(
          projectID?.toString(),
          JSON.stringify({ value: 'createdColumn', by: req?.current_user?.UserID, user: req?.current_user })
        )

        return response('addColUpdate', req, res, true, 200, 'addColUpdateSuccess')
      } else {
        const columnID = req?.params?.id
        await AdditionalColumnValuesTask.update({ ColumnName: columnName }, { where: { AdditionalColumnID: columnID } })

        sendProjectUpdate(
          projectID?.toString(),
          JSON.stringify({ value: 'createdColumn', by: req?.current_user?.UserID, user: req?.current_user })
        )

        return response('addColUpdate', req, res, true, 200, 'addColUpdateSuccess')
      }
    } else {
      return response('addColUpdate', req, res, false, 400, 'addColUpdateValidationError', errors?.array())
    }
  } catch (error) {
    showLogs && console.log('ERROR : => : createColumn :', error)

    return response('taskGroup', req, res, false, 422, 'addColUpdateError', null, error)
  }
}

const deleteColumn = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      const columnID = req?.params?.id
      const isSubTask = req?.query?.isSubTask?.toString() === '1'

      if (isSubTask) {
        const addData = await AdditionalColumnSubTask.findByPk(columnID)
        await AdditionalColumnSubTask.update({ IsDelete: 1 }, { where: { AdditionalColumnID: columnID } })

        sendProjectUpdate(
          addData?.ProjectID?.toString(),
          JSON.stringify({ value: 'createdColumn', by: req?.current_user?.UserID, user: req?.current_user })
        )

        return response('addColDelete', req, res, true, 200, 'addColDeleteSuccess')
      } else {
        const addData = await AdditionalColumnValuesTask.findByPk(columnID)
        await AdditionalColumnValuesTask.update({ IsDelete: 1 }, { where: { AdditionalColumnID: columnID } })

        sendProjectUpdate(
          addData?.ProjectID?.toString(),
          JSON.stringify({ value: 'createdColumn', by: req?.current_user?.UserID, user: req?.current_user })
        )

        return response('addColDelete', req, res, true, 200, 'addColDeleteSuccess')
      }
    } else {
      return response('addColDelete', req, res, false, 400, 'addColDeleteValidationError', errors?.array())
    }
  } catch (error) {
    showLogs && console.log('ERROR : => : deleteColumn :', error)

    return response('taskGroup', req, res, false, 422, 'addColDeleteError', null, error)
  }
}

module.exports.taskgroupController = {
  taskgroupAction,
  listTaskGroup,
  addTaskGroup,
  updateTaskGroup,
  deleteTaskGroup,
  createColumn,
  updateColumn,
  deleteColumn
}

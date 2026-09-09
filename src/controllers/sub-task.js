const { validationResult } = require('express-validator')
const { response } = require('../constants')
const { sequelize } = require('../db-connection')
const { commands } = require('../constants/command')
const {
  ColumnTypeLookup,
  SubTasks,
  Signup,
  AdditionalColumnSubTask,
  ProjectStatus,
  SubTaskDynamicColumn
} = require('../models')
const DynamicDropdown = require('../models/dynamic-dropdown')
const createRecentActivityRecord = require('../utils/recent-activity')

const showLogs = true

const list = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      const { taskID } = req?.query

      let subTaskList = []

      subTaskList = await SubTasks.findAll({
        where: { TaskMasterID: taskID, IsDelete: 0 },
        include: [
          { model: ProjectStatus, as: 'Status', attributes: ['StatusID', 'Statusname', 'Colorcode'] },
          { model: Signup, as: 'Owner', attributes: ['Email', 'Name', 'UserID', 'ProfilePicture'] },
          {
            model: SubTaskDynamicColumn,
            include: [
              { model: ColumnTypeLookup, as: 'columnType' },
              { model: Signup, as: 'User' },
              { model: DynamicDropdown, as: 'Dropdown' },
              { model: ProjectStatus, as: 'Status' }
            ],
            where: { IsDelete: 0 },
            as: 'additionalValues',
            required: false
          }
        ],
        order: [['SubTaskID', 'ASC']]
      })

      if (subTaskList?.length) {
        return response('sub-task-list', req, res, true, 200, 'successGetSubTask', subTaskList)
      } else {
        return response('sub-task-list', req, res, true, 202, 'successGetSubTaskNoFound', [])
      }
    } else {
      return response('sub-task-list', req, res, false, 400, 'failedToGetSubTasksValidation', null, errors?.array())
    }
  } catch (error) {
    showLogs && console.error('sub-task-list error :', error)

    return response('sub-task-list', req, res, false, 422, 'failedToGetSubTasks')
  }
}

const addSubTask = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      const { taskID } = req?.body

      const subTaskCreate = await sequelize.query(
        'EXEC spc_SubTaskMasterMgt @Command = :command, @TaskName = :taskName, @CreateBy = :createBy, @TaskID = :taskID',
        {
          type: sequelize?.QueryTypes?.SELECT,
          replacements: {
            command: commands.taskMasterCreate,
            taskName: 'Sub Task',
            taskID,
            createBy: req?.current_user?.UserID
          },
          raw: true
        }
      )
      const SubTaskID = subTaskCreate?.[0]?.SubTaskID
      await createRecentActivityRecord({
        taskID,
        subTaskID: SubTaskID,
        doneBy: req?.current_user?.UserID,
        title: 'Sub-Task Added',
        description: `${req?.current_user?.Name} created a new sub-task`,
        activityType: 'Create',
        newState: 'Sub Task'
      })

      return response('sub-task-add', req, res, true, 200, 'addSubTaskSuccess')
    } else {
      return response('sub-task-add', req, res, false, 400, 'addSubTaskValidation', null, errors?.array())
    }
  } catch (err) {
    console.log('err', err)

    return response('sub-task-add', req, res, false, 422, 'addSubTaskFailed')
  }
}

const update = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      if (req?.body?.AdditionalColumnID) {
        const additionalColumnData = await AdditionalColumnSubTask.findByPk(req?.body?.AdditionalColumnID, {
          include: [{ model: ColumnTypeLookup, as: 'ColumnType' }]
        })

        await sequelize.query(
          'EXEC spc_SubTaskMasterMgt @Command = :command, @DynamicValues = :value, @CreateBy = :createBy, @SubTaskID = :subTaskID, @ProjectID = :projectID, @WorkspaceID = :workspaceID, @AdditionalColumnID = :additionalColumnID, @ColumnType = :columnType, @TaskID = :taskID, @DynamicID = :dynamicID, @DynamicDropdownID = :dropdownID, @StatusID = :statusID, @DisplayText = :displayText',
          {
            type: sequelize?.QueryTypes?.SELECT,
            replacements: {
              command: commands.taskMasterUpdateDynamic,
              value: req?.body?.value ?? null,
              subTaskID: req?.params?.id,
              projectID: additionalColumnData?.ProjectID,
              workspaceID: additionalColumnData?.WorkspaceID,
              createBy: req?.current_user?.UserID,
              additionalColumnID: req?.body?.AdditionalColumnID,
              columnType: additionalColumnData?.AdditionalColumnTypeID,
              taskID: req?.body?.TaskID,
              dynamicID: req?.body?.DynamicID,
              dropdownID: additionalColumnData?.ColumnType?.Keyname === 'DDL' ? req?.body?.value : null,
              statusID: additionalColumnData?.ColumnType?.Keyname === 'LBL' ? req?.body?.value : null,
              displayText: req?.body?.displayText ?? null
            },
            raw: true
          }
        )

        const activityBody = {
          taskID: req?.body?.TaskID,
          subTaskID: req?.params?.id,
          doneBy: req?.current_user?.UserID,
          title: req?.body?.Title ?? 'Sub-Task Updated',
          description: req?.body?.Description ?? `${req?.current_user?.Name} updated a sub-task`,
          activityType: 'Update',
          previousState: req?.body?.PreviousState,
          newState: req?.body?.NewState
        }

        if (req?.body?.IsCritical) {
          activityBody.isCritical = req?.body?.IsCritical
        }

        await createRecentActivityRecord(activityBody)

        return response('sub-task-update', req, res, true, 200, 'updateTaskSuccess')
      }

      const activityBody = {
        taskID: req?.body?.TaskID,
        subTaskID: req?.params?.id,
        doneBy: req?.current_user?.UserID,
        title: req?.body?.Title ?? 'Sub-Task Updated',
        description: req?.body?.Description ?? `${req?.current_user?.Name} updated a sub-task`,
        activityType: 'Update',
        previousState: req?.body?.PreviousState,
        newState: req?.body?.NewState
      }

      if (req?.body?.IsCritical) {
        activityBody.isCritical = req?.body?.IsCritical
      }

      await createRecentActivityRecord(activityBody)

      await SubTasks.update(req?.body, { where: { SubTaskID: req?.params?.id } })

      return response('sub-task-update', req, res, true, 200, 'updateTaskSuccess')
    } else {
      return response('sub-task-update', req, res, false, 400, 'updateTaskValidation')
    }
  } catch (error) {
    console.log('error :', error)
    showLogs && console.error('sub-task-update error :', error)

    return response('sub-task-update', req, res, false, 422, 'updateTaskFailed')
  }
}

const deleteSubTask = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      await SubTasks.update({ IsDelete: 1 }, { where: { SubTaskID: req?.params?.id } })

      const subTaskData = await SubTasks.findByPk(req?.params?.id)
      const activityBody = {
        taskID: subTaskData?.TaskMasterID,
        doneBy: req?.current_user?.UserID,
        title: req?.body?.Title ?? 'Sub Task Deleted',
        description: `${req?.current_user?.Name} deleted a sub-task named ${subTaskData?.SubTaskName}`,
        activityType: 'Delete',
        previousState: subTaskData?.SubTaskName,
        isCritical: 1
      }

      await createRecentActivityRecord(activityBody)

      return response('task-delete', req, res, true, 200, 'deleteTaskSuccess')
    } else {
      throw Error('deleteTaskFailed')
    }
  } catch (err) {
    console.log('err :', err)

    return response('task-delete', req, res, false, 422, 'deleteTaskFailed')
  }
}

const createSubTaskColumn = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      const { columnName, columnTypeID, taskGroupID, workspaceID, projectID, taskID } = req?.body
      await sequelize.query(
        'EXEC spc_AdditionalSubColumnMgt @Command = :command, @ColumnName = :columnName, @ColumnTypeID = :columnTypeID,@TaskID = :taskID, @UserID = :userID, @TaskGroupID = :taskGroupID, @WorkspaceID = :workspaceID, @ProjectID = :projectID',
        {
          type: sequelize?.QueryTypes?.SELECT,
          replacements: {
            command: commands.additionalColumnCreate,
            columnName,
            taskID,
            columnTypeID,
            userID: req?.current_user?.UserID,
            taskGroupID,
            workspaceID,
            projectID
          },
          raw: true
        }
      )

      const activityBody = {
        taskID,
        doneBy: req?.current_user?.UserID,
        title: req?.body?.Title ?? 'Created a Column in sub-task',
        description: `${req?.current_user?.Name} created a sub-task column named ${columnName}`,
        activityType: 'Create',
        previousState: req?.body?.PreviousState,
        newState: columnName
      }

      if (req?.body?.IsCritical) {
        activityBody.isCritical = req?.body?.IsCritical
      }

      await createRecentActivityRecord(activityBody)

      return response('additionalColumnCreate', req, res, true, 200, 'additionalColumnCreateSuccess')
    } else {
      return response('create-column', req, res, false, 400, 'createSubColumnError', errors?.array())
    }
  } catch (error) {
    console.log('error :', error)
    showLogs && console.log('ERROR : => : createColumn :', error)

    return response('taskGroup', req, res, false, 422, 'additionalColumnCreateError', null, error)
  }
}

const getListOfColumns = async (req, res) => {
  try {
    const { taskID } = req?.query

    const dyColumns = await AdditionalColumnSubTask.findAll({
      where: { TaskID: taskID, IsDelete: 0 },
      include: [{ model: ColumnTypeLookup, as: 'ColumnType' }]
    })

    if (dyColumns?.length) {
      return response('list-sub-dy-column', req, res, true, 200, 'getDynamicSubColumnsSuccess', dyColumns)
    } else {
      return response('list-sub-dy-column', req, res, true, 202, 'getDynamicSubColumnsNotFound', [])
    }
  } catch (error) {
    console.log('error :', error)

    return response('list-sub-dy-column', req, res, false, 422, 'getDynamicSubColumnsFailed')
  }
}

module.exports.subTaskController = {
  list,
  addSubTask,
  update,
  deleteSubTask,
  createSubTaskColumn,
  getListOfColumns
}

const { validationResult } = require('express-validator')
const { response } = require('../constants')
const Signup = require('../models/signup')
const TaskGroups = require('../models/task-group')
const { sequelize } = require('../db-connection')
const { commands } = require('../constants/command')
const {
  DynamicColumns,
  ColumnTypeLookup,
  TaskMaster,
  ProjectPriority,
  ProjectStatus,
  AdditionalColumnValuesTask
} = require('../models')
const DynamicDropdown = require('../models/dynamic-dropdown')
const { sendProjectUpdate } = require('../socket-connection')
const createRecentActivityRecord = require('../utils/recent-activity')
const { uploadToFTP } = require('../ftp-connection')

const showLogs = true

const listTasks = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      const { taskGroupID: TaskGroupID, projectID: ProjectID } = req?.query

      let tasksList = []
      if (TaskGroupID) {
        tasksList = await TaskMaster.findAll({
          where: { TaskGroupID, IsDelete: 0 },
          include: [
            { model: ProjectStatus, as: 'Status', attributes: ['StatusID', 'Statusname', 'Colorcode'] },
            { model: ProjectPriority, as: 'Priority', attributes: ['PriorityID', 'PriorityName', 'Colorcode'] },
            { model: Signup, as: 'Owner', attributes: ['Email', 'Name', 'UserID', 'ProfilePicture'] },
            {
              model: DynamicColumns,
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
          order: [['TaskID', 'ASC']]
        })
      } else if (ProjectID) {
        const taskGroups = await TaskGroups.findAll({
          where: { ProjectID },
          attributes: ['TaskGroupID'],
          raw: true
        })

        if (taskGroups?.length) {
          tasksList = await TaskMaster.findAll({
            where: { TaskGroupID: taskGroups?.map(i => i?.TaskGroupID) },
            include: [
              { model: ProjectStatus, as: 'Status', attributes: ['StatusID', 'Statusname', 'Colorcode'] },
              { model: ProjectPriority, as: 'Priority', attributes: ['PriorityID', 'PriorityName', 'Colorcode'] },
              { model: Signup, as: 'Owner', attributes: ['Email', 'Name', 'UserID'] },
              {
                model: DynamicColumns,
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
            order: [['TaskID', 'ASC']]
          })
        }
      }
      if (tasksList?.length) {
        return response('task-list', req, res, true, 200, 'successGetTask', tasksList)
      } else {
        return response('task-list', req, res, true, 202, 'successGetTaskNoFound', [])
      }
    } else {
      return response('task-list', req, res, false, 400, 'failedToGetTasksValidation', null, errors?.array())
    }
  } catch (error) {
    showLogs && console.error('task-list error :', error)

    return response('task-list', req, res, false, 422, 'failedToGetTasks')
  }
}

const addTasks = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      const { taskGroupID, projectID, workspaceID } = req?.body

      const taskCreate = await sequelize.query(
        'EXEC spc_TaskMasterMgt @Command = :command, @TaskName = :taskName, @CreateBy = :createBy, @TaskGroupID = :taskGroupID, @ProjectID = :projectID, @WorkspaceID = :workspaceID',
        {
          type: sequelize?.QueryTypes?.SELECT,
          replacements: {
            command: commands.taskMasterCreate,
            taskName: 'Task',
            taskGroupID,
            projectID,
            workspaceID,
            createBy: req?.current_user?.UserID
          },
          raw: true
        }
      )
      sendProjectUpdate(
        projectID?.toString(),
        JSON.stringify({ value: 'updateTaskList', by: req?.current_user?.UserID, user: req?.current_user })
      )

      const TaskID = taskCreate?.[0]?.TaskID

      await createRecentActivityRecord({
        taskID: TaskID,
        doneBy: req?.current_user?.UserID,
        title: 'Task Added',
        description: `${req?.current_user?.Name} created a new task`,
        activityType: 'Create',
        newState: 'Task'
      })

      return response('task-add', req, res, true, 200, 'addTaskSuccess')
    } else {
      return response('task-add', req, res, false, 400, 'addTaskValidation', null, errors?.array())
    }
  } catch (err) {
    console.log('err', err)

    return response('task-add', req, res, false, 422, 'addTaskFailed')
  }
}

const updateTasks = async (req, res) => {
  console.time('TotalExecutionTime')
  try {
    console.time('ValidationTime')
    const errors = validationResult(req)
    console.timeEnd('ValidationTime')

    if (errors?.isEmpty()) {
      console.time('FetchProjectDataTime')
      const projectData = await TaskMaster.findOne({
        where: { TaskID: req?.params?.id },
        attributes: [],
        include: [{ model: TaskGroups, as: 'taskGroup', attributes: ['ProjectID'] }],
        raw: true
      })
      console.timeEnd('FetchProjectDataTime')

      if (req?.body?.AdditionalColumnID) {
        console.time('FetchAdditionalColumnDataTime')
        const additionalColumnData = await AdditionalColumnValuesTask.findByPk(req?.body?.AdditionalColumnID, {
          include: [{ model: ColumnTypeLookup, as: 'ColumnType' }]
        })
        console.timeEnd('FetchAdditionalColumnDataTime')

        if (additionalColumnData?.ColumnType?.Keyname === 'FLE' && req?.body?.file) {
          console.log('REQFILES', req?.files)
          console.timeEnd('TotalExecutionTime')

          return response('task-update', req, res, true, 200, 'updateTaskSuccess')
        }

        console.time('SPExecutionTime')
        await sequelize.query(
          'EXEC spc_TaskMasterMgt @Command = :command, @DynamicValues = :value, @CreateBy = :createBy, @TaskGroupID = :taskGroupID, @ProjectID = :projectID, @WorkspaceID = :workspaceID, @AdditionalColumnID = :additionalColumnID, @ColumnType = :columnType, @TaskID = :taskID, @DynamicID = :dynamicID, @DynamicDropdownID = :dropdownID, @StatusID = :statusID, @DisplayText = :displayText',
          {
            type: sequelize?.QueryTypes?.SELECT,
            replacements: {
              command: commands.taskMasterUpdateDynamic,
              value: req?.body?.value,
              taskGroupID: additionalColumnData?.TaskGroupID,
              projectID: additionalColumnData?.ProjectID,
              workspaceID: additionalColumnData?.WorkspaceID,
              createBy: req?.current_user?.UserID,
              additionalColumnID: req?.body?.AdditionalColumnID,
              columnType: additionalColumnData?.AdditionalColumnTypeID,
              taskID: req?.params?.id,
              displayText: req?.body?.displayText ?? null,
              dynamicID: req?.body?.DynamicID,
              dropdownID: additionalColumnData?.ColumnType?.Keyname === 'DDL' ? req?.body?.value : null,
              statusID: additionalColumnData?.ColumnType?.Keyname === 'LBL' ? req?.body?.value : null
            },
            raw: true
          }
        )
        console.timeEnd('SPExecutionTime')

        console.time('ProjectUpdateNotificationTime')
        sendProjectUpdate(
          additionalColumnData?.ProjectID?.toString(),
          JSON.stringify({ value: 'updateTaskList', by: req?.current_user?.UserID, user: req?.current_user })
        )
        console.timeEnd('ProjectUpdateNotificationTime')

        console.time('CreateActivityRecordTime')
        const activityBody = {
          taskID: req?.params?.id,
          doneBy: req?.current_user?.UserID,
          additionColID: req?.body?.AdditionalColumnID,
          title: req?.body?.Title ?? 'Update Column Value',
          description:
            req?.body?.Description ??
            `${req?.current_user?.Name} updated value of column ${additionalColumnData?.ColumnName}`,
          activityType: 'Update',
          previousState: req?.body?.PreviousState,
          newState: req?.body?.NewState
        }

        if (req?.body?.IsCritical) {
          activityBody.isCritical = req?.body?.IsCritical
        }

        await createRecentActivityRecord(activityBody)
        console.timeEnd('CreateActivityRecordTime')

        console.timeEnd('TotalExecutionTime')
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~')
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~')

        return response('task-update', req, res, true, 200, 'updateTaskSuccess')
      }

      console.time('DefaultProjectUpdateNotificationTime')
      sendProjectUpdate(
        projectData?.['taskGroup.ProjectID']?.toString(),
        JSON.stringify({ value: 'updateTaskList', by: req?.current_user?.UserID, user: req?.current_user })
      )
      console.timeEnd('DefaultProjectUpdateNotificationTime')

      console.time('TaskMasterUpdateTime')
      await TaskMaster.update(req?.body, { where: { TaskID: req?.params?.id } })
      console.timeEnd('TaskMasterUpdateTime')

      console.time('CreateDefaultActivityRecordTime')
      const activityBody = {
        taskID: req?.params?.id,
        doneBy: req?.current_user?.UserID,
        title: req?.body?.Title ?? 'Task Updated',
        description: req?.body?.Description ?? `${req?.current_user?.Name} updated a task`,
        activityType: 'Update',
        previousState: req?.body?.PreviousState,
        newState: req?.body?.NewState
      }

      if (req?.body?.IsCritical) {
        activityBody.isCritical = req?.body?.IsCritical
      }

      await createRecentActivityRecord(activityBody)
      console.timeEnd('CreateDefaultActivityRecordTime')

      console.timeEnd('TotalExecutionTime')
      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~')
      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~')

      return response('task-update', req, res, true, 200, 'updateTaskSuccess')
    } else {
      console.timeEnd('TotalExecutionTime')
      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~')
      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~')

      return response('task-update', req, res, false, 400, 'updateTaskValidation')
    }
  } catch (error) {
    showLogs && console.error('task-update error :', error)
    console.timeEnd('TotalExecutionTime')
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~')
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~')

    return response('task-update', req, res, false, 422, 'updateTaskFailed')
  }
}

const deleteTask = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      await TaskMaster.update({ IsDelete: 1 }, { where: { TaskID: req?.params?.id } })

      return response('task-delete', req, res, true, 200, 'deleteTaskSuccess')
    } else {
      throw Error('deleteTaskFailed')
    }
  } catch {
    return response('task-delete', req, res, false, 422, 'deleteTaskFailed')
  }
}

const deleteMultipleTask = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      const { taskIds } = req?.body

      await TaskMaster.update({ IsDelete: 1 }, { where: { TaskID: taskIds } })

      return response('task-delete', req, res, true, 200, 'deleteTaskSuccess')
    } else {
      throw Error('deleteTaskFailed')
    }
  } catch (error) {
    showLogs && console.error('task-delete error :', error)

    return response('task-delete', req, res, false, 422, 'deleteTaskFailed')
  }
}

const deleteDynamicTask = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (errors?.isEmpty()) {
      await DynamicColumns.update({ IsDelete: 1 }, { where: { DynamicID: req?.params?.id } })

      return response('task-delete', req, res, true, 200, 'deleteTaskSuccess')
    } else {
      throw Error('deleteTaskFailed')
    }
  } catch {
    return response('task-delete', req, res, false, 422, 'deleteTaskFailed')
  }
}

const fileUpload = async (req, res) => {
  try {
    const file = req?.files?.file

    const filePath = await uploadToFTP(file)

    const errors = validationResult(req)
    if (errors?.isEmpty() && filePath) {
      const additionalColumnData = await AdditionalColumnValuesTask.findByPk(req?.body?.AdditionalColumnID, {
        include: [{ model: ColumnTypeLookup, as: 'ColumnType' }]
      })

      if (additionalColumnData?.ColumnType?.Keyname === 'FLE' && req?.body?.file) {
        return response('task-update', req, res, true, 200, 'updateTaskSuccess')
      }

      await sequelize.query(
        'EXEC spc_TaskMasterMgt @Command = :command, @DynamicValues = :value, @CreateBy = :createBy, @TaskGroupID = :taskGroupID, @ProjectID = :projectID, @WorkspaceID = :workspaceID, @AdditionalColumnID = :additionalColumnID, @ColumnType = :columnType, @TaskID = :taskID, @DynamicID = :dynamicID, @DynamicDropdownID = :dropdownID, @StatusID = :statusID, @DisplayText = :displayText',
        {
          type: sequelize?.QueryTypes?.SELECT,
          replacements: {
            command: commands.taskMasterUpdateDynamic,
            value: `https:/${filePath}`,
            taskGroupID: additionalColumnData?.TaskGroupID,
            projectID: additionalColumnData?.ProjectID,
            workspaceID: additionalColumnData?.WorkspaceID,
            createBy: req?.current_user?.UserID,
            additionalColumnID: req?.body?.AdditionalColumnID,
            columnType: additionalColumnData?.AdditionalColumnTypeID,
            taskID: req?.params?.id,
            displayText: req?.body?.displayText ?? null,
            dynamicID: req?.body?.DynamicID ?? null,
            dropdownID: additionalColumnData?.ColumnType?.Keyname === 'DDL' ? req?.body?.value : null,
            statusID: additionalColumnData?.ColumnType?.Keyname === 'LBL' ? req?.body?.value : null
          },
          raw: true
        }
      )

      sendProjectUpdate(
        additionalColumnData?.ProjectID?.toString(),
        JSON.stringify({ value: 'updateTaskList', by: req?.current_user?.UserID, user: req?.current_user })
      )

      const activityBody = {
        taskID: req?.params?.id,
        doneBy: req?.current_user?.UserID,
        additionColID: req?.body?.AdditionalColumnID,
        title: req?.body?.Title ?? 'Update Column Value',
        description:
          req?.body?.Description ??
          `${req?.current_user?.Name} updated value of column ${additionalColumnData?.ColumnName}`,
        activityType: 'Update',
        previousState: req?.body?.PreviousState,
        newState: req?.body?.NewState
      }

      if (req?.body?.IsCritical) {
        activityBody.isCritical = req?.body?.IsCritical
      }

      await createRecentActivityRecord(activityBody)

      return response('task-update', req, res, true, 200, 'updateTaskSuccess')
    } else {
      return response('task-update', req, res, false, 400, 'updateTaskValidation')
    }
  } catch (error) {
    showLogs && console.error('task-update error :', error)

    return response('task-update', req, res, false, 422, 'updateTaskFailed')
  }
}

module.exports.taskMasterController = {
  listTasks,
  addTasks,
  updateTasks,
  deleteTask,
  deleteMultipleTask,
  deleteDynamicTask,
  fileUpload
}

const { Op } = require('sequelize')
const { response } = require('../constants')
const { sequelize } = require('../db-connection')
const { DynamicColumns, RecentActivity, ProjectPriority, ProjectStatus } = require('../models')
const AdditionalColumnSubTask = require('../models/additional-column-subtask')
const AdditionalColumnValuesTask = require('../models/additional-column-task')
const DynamicDropdown = require('../models/dynamic-dropdown')
const Project = require('../models/project')
const SubTasks = require('../models/subtask')
const SubTaskDynamicColumn = require('../models/subtask-dynamic-column')
const TaskGroups = require('../models/task-group')
const TaskMaster = require('../models/task-master')
const Workspace = require('../models/workspace')
const SprintWorkspace = require('../models/sprint-management/sprint-workspace')
const BugQueueManagement = require('../models/sprint-management/bug-queue')

const syncTables = async (req, res) => {
  if (req?.body?.password === 'Abc@123123') {
    console.log('STARTED')
    try {
      // Sync all models
      await BugQueueManagement.sync({ alter: true, force: true })
      console.log('All models were synchronized successfully.')
    } catch (error) {
      console.error('An error occurred while syncing the database:', error)

      return response('db-operations', req, res, false, 400, 'syncError')
    }

    return response('db-operations', req, res, true, 200, 'syncSuccess')
  } else {
    return response('db-operations', req, res, false, 422, 'validationError')
  }
}

const tables = [
  SubTaskDynamicColumn,
  AdditionalColumnSubTask,
  DynamicColumns,
  RecentActivity,
  SubTasks,
  AdditionalColumnValuesTask,
  DynamicDropdown,
  TaskMaster
]

const isDefaultTables = [ProjectPriority, ProjectStatus]

const mainTables = [TaskGroups, Project, Workspace]

const dropTables = async (req, res) => {
  if (req?.body?.password === 'Abc@123123') {
    try {
      // Sync all models
      for (let tb = 0; tb < tables.length; tb++) {
        const element = tables[tb]
        try {
          await element.destroy({ where: {} })
          console.log(`Truncated Table ${element.name} (${tb + 1} of ${tables.length})`)
        } catch (truncateError) {
          console.error(`Error truncating table ${element.name}:`, truncateError.message)

          return response(
            'db-operations',
            req,
            res,
            false,
            400,
            `syncError: Failed to truncate table ${element.name} due to foreign key constraints`
          )
        }
      }
      for (let dtb = 0; dtb < isDefaultTables.length; dtb++) {
        const element = isDefaultTables[dtb]
        try {
          await element.destroy({
            where: {
              IsDefault: {
                [Op.is]: null
              }
            }
          })
          console.log(`Truncated Table with IsDefault NULL ${element.name} (${dtb + 1} of ${tables.length})`)
        } catch (truncateError) {
          console.error(`Error truncating table ${element.name}:`, truncateError.message)

          return response(
            'db-operations',
            req,
            res,
            false,
            400,
            `syncError: Failed to truncate table ${element.name} due to foreign key constraints`
          )
        }
      }
      for (let dtb = 0; dtb < mainTables.length; dtb++) {
        const element = mainTables[dtb]
        try {
          await element.destroy({ where: {} })
          console.log(`Truncated Main Table with  ${element.name} (${dtb + 1} of ${tables.length})`)
        } catch (truncateError) {
          console.error(`Error truncating table ${element.name}:`, truncateError.message)

          return response(
            'db-operations',
            req,
            res,
            false,
            400,
            `syncError: Failed to truncate table ${element.name} due to foreign key constraints`
          )
        }
      }

      return response('db-operations', req, res, true, 200, 'syncSuccess')
    } catch (error) {
      console.error('An unexpected error occurred during database truncation:', error)

      return response('db-operations', req, res, false, 400, 'syncError')
    }
  } else {
    return response('db-operations', req, res, false, 422, 'validationError')
  }
}

module.exports = function (app, router) {
  router.post('/db-sync', syncTables)
  router.post('/db-drop', dropTables)

  app.use('/api', router)
}

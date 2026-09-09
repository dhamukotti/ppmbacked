const { validationResult } = require('express-validator')
const { response } = require('../constants')

const ProjectPriority = require('../models/project-priority')
const { sequelize } = require('../db-connection')
const { commands } = require('../constants/command')

// ** List

const listProjectPriority = async (req, res) => {
  try {
    const taskGroupID = req?.query?.taskGroupID
    let projectPriorities = []

    if (!taskGroupID) {
      projectPriorities = await ProjectPriority.findAll({ raw: true, where: { IsDefault: 1 } })
    } else {
      projectPriorities = await ProjectPriority.findAll({
        raw: true,
        where: { TaskgroupID: taskGroupID, IsDefault: 0 }
      })
    }

    if (projectPriorities?.length) {
      return response('project-priority-list', req, res, true, 200, 'successProjectPriorityList', projectPriorities)
    } else {
      return response('project-priority-list', req, res, true, 202, 'projectPriorityListNoData', [])
    }
  } catch (error) {
    return response('project-priority-list', req, res, false, 422, 'failedProjectPriorityList', null, error)
  }
}

const add = async (req, res) => {
  try {
    const errors = validationResult(req)

    if (errors.isEmpty()) {
      const { PriorityName, Colorcode, TaskgroupID } = req?.body

      await sequelize.query(
        'EXEC spc_ProjectPriorityManagement @Command = :command, @PriorityName = :PriorityName, @CreatedBy = :createBy, @Colorcode = :Colorcode, @TaskgroupID = :TaskgroupID',
        {
          type: sequelize?.QueryTypes?.SELECT,
          replacements: {
            command: commands.createPriority,
            PriorityName,
            TaskgroupID,
            createBy: req?.current_user?.UserID,
            Colorcode
          },
          raw: true
        }
      )

      return response('project-add', req, res, true, 201, 'successProjectAdd', null)
    } else {
      return response('project-add', req, res, false, 400, 'failedProjectAdd', null, errors.array())
    }
  } catch (error) {
    console.log('error :', error)

    return response('project-add', req, res, false, 422, 'failedProjectAdd', null, error)
  }
}

const update = async (req, res) => {
  try {
    const errors = validationResult(req)

    if (errors.isEmpty()) {
      const PriorityID = req?.params?.id
      const { PriorityName, Colorcode } = req?.body

      await ProjectPriority.update({ PriorityName, Colorcode }, { where: { PriorityID } })

      return response('project-add', req, res, true, 201, 'successProjectAdd', null)
    } else {
      return response('project-add', req, res, false, 400, 'failedProjectAdd', null, errors.array())
    }
  } catch (error) {
    console.log('error :', error)

    return response('project-add', req, res, false, 422, 'failedProjectAdd', null, error)
  }
}

module.exports.priorityController = {
  list: listProjectPriority,
  add,
  update
}

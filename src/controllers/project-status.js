const { validationResult } = require('express-validator')
const { response } = require('../constants')

const { sequelize } = require('../db-connection')
const { commands } = require('../constants/command')
const ProjectStatus = require('../models/project-status')

// ** List Project
const list = async (req, res) => {
  try {
    const taskGroupID = req?.query?.taskGroupID
    let projectStatus = []
    if (!taskGroupID) {
      projectStatus = await ProjectStatus.findAll({ raw: true, where: { IsDefault: 1 } })
    } else {
      projectStatus = await ProjectStatus.findAll({ raw: true, where: { TaskgroupID: taskGroupID, IsDefault: 0 } })
    }
    if (projectStatus?.length) {
      return response('project-priority-list', req, res, true, 200, 'successProjectPriorityList', projectStatus)
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
      const { Statusname, Colorcode, TaskgroupID } = req?.body

      await sequelize.query(
        'EXEC spc_ProjectStatusManagement @Command = :command, @Statusname = :Statusname, @CreateBy = :createBy, @Colorcode = :Colorcode, @TaskgroupID = :TaskgroupID',
        {
          type: sequelize?.QueryTypes?.SELECT,
          replacements: {
            command: commands.createStatus,
            Statusname,
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
    return response('project-add', req, res, false, 422, 'failedProjectAdd', null, error)
  }
}

const deleteStatus = async (req, res) => {
  try {
    const errors = validationResult(req)

    if (errors.isEmpty()) {
      const { StatusID } = req?.body

      await sequelize.query('EXEC spc_ProjectStatusManagement @Command = :command, @StatusID = :StatusID', {
        type: sequelize?.QueryTypes?.SELECT,
        replacements: {
          command: commands.removeStatus,
          StatusID
        },
        raw: true
      })

      return response('project-add', req, res, true, 201, 'successProjectAdd', null)
    } else {
      return response('project-add', req, res, false, 400, 'failedProjectAdd', null, errors.array())
    }
  } catch (error) {
    return response('project-add', req, res, false, 422, 'failedProjectAdd', null, error)
  }
}

const update = async (req, res) => {
  try {
    const errors = validationResult(req)

    if (errors.isEmpty()) {
      const StatusID = req?.params?.id
      const { Statusname, Colorcode } = req?.body

      await ProjectStatus.update({ Statusname, Colorcode }, { where: { StatusID } })

      return response('project-add', req, res, true, 201, 'successProjectAdd', null)
    } else {
      return response('project-add', req, res, false, 400, 'failedProjectAdd', null, errors.array())
    }
  } catch (error) {
    console.log('error :', error)

    return response('project-add', req, res, false, 422, 'failedProjectAdd', null, error)
  }
}

module.exports.statusController = {
  list,
  add,
  deleteStatus,
  update
}

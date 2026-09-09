const { Sequelize } = require('@sequelize/core')
const { response } = require('../../constants')
const { BugPriority } = require('../../models/index')

// ** Turn logs on
const showLogs = true

const list = async (req, res) => {
  try {
    const { workspaceID } = req?.query

    let conditions = {}

    if (workspaceID) {
      conditions = { IsDelete: 0, IsDefault: 0, WorkSpaceID: workspaceID }
    } else {
      conditions = { IsDefault: 1 }
    }

    const bugPriority = await BugPriority.findAll({
      where: conditions
    })

    if (bugPriority?.length) {
      return response('bug-priority', req, res, true, 200, 'successBugPriorityList', bugPriority)
    } else {
      return response('bug-priority', req, res, true, 202, 'noBugPriorityList', bugPriority)
    }
  } catch (error) {
    showLogs && console.error('UPDATE SPRINT ERROR:', error)

    return response('bug-priority', req, res, false, 500, 'failedBugUpdated', {})
  }
}

const add = async (req, res) => {
  try {
    const { PriorityName, Colorcode, WorkspaceID } = req?.body

    const createBody = {
      PriorityName,
      Colorcode,
      WorkSpaceID: WorkspaceID,
      CreateDate: Sequelize.fn('GETDATE'),
      CreatedBy: req?.current_user?.UserID,
      IsDelete: 0,
      IsDefault: 0
    }

    await BugPriority.create(createBody)

    return response('project-add', req, res, true, 201, 'successProjectAdd', null)
  } catch (error) {
    console.log('error :', error)

    return response('project-add', req, res, false, 422, 'failedProjectAdd', null, error)
  }
}

const update = async (req, res) => {
  try {
    const PriorityID = req?.params?.id
    const { PriorityName, Colorcode } = req?.body

    await BugPriority.update({ PriorityName, Colorcode }, { where: { PriorityID } })

    return response('project-add', req, res, true, 201, 'successProjectAdd', null)
  } catch (error) {
    console.log('error :', error)

    return response('project-add', req, res, false, 422, 'failedProjectAdd', null, error)
  }
}

module.exports.bugQueuePriorityCtrl = {
  list,
  add,
  update
}

const { default: Sequelize } = require('@sequelize/core')
const { response } = require('../../constants')
const { BugQueueManagement, BugPriority } = require('../../models/index')
const { Signup } = require('../../models')

// ** Turn logs on
const showLogs = true

// ** List all sprints tasks
const listBugs = async (req, res) => {
  try {
    const { workspaceID } = req?.query

    if (!workspaceID) {
      return response('sprints', req, res, false, 400, 'failedBugsList', [])
    }

    const sprints = await BugQueueManagement.findAll({
      where: { IsDelete: 0, WorkSpaceID: workspaceID },
      include: [
        { model: Signup, as: 'createdBy' },
        { model: BugPriority, as: 'Priority', attributes: ['PriorityID', 'PriorityName', 'Colorcode'] }
      ]
    })

    if (sprints?.length) {
      return response('sprints', req, res, true, 200, 'successBugsList', sprints)
    } else {
      return response('sprints', req, res, true, 202, 'noBugsList', sprints)
    }
  } catch (error) {
    showLogs && console.error('GET SPRINTS ERROR:', error)

    return response('sprints', req, res, false, 500, 'failedBugsList', [])
  }
}

// ** Get sprint by ID
const getBugById = async (req, res) => {
  try {
    const { id } = req.params
    const sprint = await BugQueueManagement.findOne({ where: { BugID: id, IsDelete: 0 } })
    if (!sprint) {
      return response('sprints', req, res, false, 404, 'bugNotFound', {})
    }

    return response('sprints', req, res, true, 200, 'successBugFound', sprint)
  } catch (error) {
    showLogs && console.error('GET SPRINT ERROR:', error)

    return response('sprints', req, res, false, 500, 'failedBugDetail', {})
  }
}

// ** Create a new sprint
const createBug = async (req, res) => {
  try {
    const { name, workspaceID } = req?.body

    if (!workspaceID) throw Error('Sprint ID Not Found')

    const createSprintObject = {
      BugName: name || 'New Bug',
      IsDelete: 0,
      WorkSpaceID: workspaceID,
      CreateDate: Sequelize.fn('GETDATE'),
      CreateBy: req?.current_user?.UserID
    }

    console.log('createSprintObject :', createSprintObject)
    const sprint = await BugQueueManagement.create(createSprintObject)

    return response('sprints', req, res, true, 201, 'bugCreated', sprint)
  } catch (error) {
    showLogs && console.error('CREATE SPRINT ERROR:', error)

    return response('sprints', req, res, false, 500, 'failedBugCreate', {})
  }
}

// ** Update sprint by ID
const updateBug = async (req, res) => {
  try {
    const { id } = req.params
    const sprint = await BugQueueManagement.findByPk(id)
    if (!sprint) {
      return response('sprints', req, res, false, 404, 'bugNotFound', {})
    }
    await sprint.update(req.body)

    return response('sprints', req, res, true, 200, 'successBugUpdated', sprint)
  } catch (error) {
    showLogs && console.error('UPDATE SPRINT ERROR:', error)

    return response('sprints', req, res, false, 500, 'failedBugUpdated', {})
  }
}

// ** Soft delete sprint by ID
const deleteBug = async (req, res) => {
  try {
    const { id } = req.params
    const sprint = await BugQueueManagement.findByPk(id)
    if (!sprint) {
      return response('sprints', req, res, false, 404, 'bugNotFound', {})
    }
    await sprint.update({ IsDelete: 1, DeletedDate: new Date(), DeletedBy: req.user?.id || null })

    return response('sprints', req, res, true, 200, 'successBugDelete', {})
  } catch (error) {
    showLogs && console.error('DELETE SPRINT ERROR:', error)

    return response('sprints', req, res, false, 500, 'failedBugDelete', {})
  }
}

// ** Soft delete sprint by ID
const deleteMultiple = async (req, res) => {
  try {
    if (req?.body?.bugs?.length) {
      await BugQueueManagement.update({ IsDelete: 1 }, { where: { BugID: req?.body?.bugs } })

      return response('sprints', req, res, true, 200, 'successBugDelete', {})
    } else {
      return response('sprints', req, res, false, 404, 'bugNotFound', {})
    }
  } catch (error) {
    showLogs && console.error('DELETE SPRINT ERROR:', error)

    return response('sprints', req, res, false, 500, 'failedBugDelete', {})
  }
}

const priorityList = async (req, res) => {
  try {
    const bugPriority = await BugPriority.findAll({
      where: { IsDelete: 0, CreateBy: req?.current_user?.UserID }
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

module.exports.bugQueueController = {
  listBugs,
  getBugById,
  createBug,
  updateBug,
  deleteBug,
  deleteMultiple,
  priorityList
}

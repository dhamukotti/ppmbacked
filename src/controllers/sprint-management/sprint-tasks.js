const { response } = require('../../constants')
const SprintTaskManagement = require('../../models/sprint-management/sprint-tasks')

// ** Turn logs on
const showLogs = true

// ** List all sprints tasks
const listTasks = async (req, res) => {
  try {
    const { sprintID } = req?.query

    if (!sprintID) throw Error('No Sprint ID Found')

    const sprints = await SprintTaskManagement.findAll({ where: { SprintID: sprintID, IsDelete: 0 } })

    if (sprints?.length) {
      return response('sprints', req, res, true, 200, 'successSprintList', sprints)
    } else {
      return response('sprints', req, res, true, 202, 'noSprintsFound', sprints)
    }
  } catch (error) {
    showLogs && console.error('GET SPRINTS ERROR:', error)

    return response('sprints', req, res, false, 500, 'failedSprintsList', [])
  }
}

// ** Get sprint by ID
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params
    const sprint = await SprintTaskManagement.findOne({ where: { SprintTaskID: id, IsDelete: 0 } })
    if (!sprint) {
      return response('sprints', req, res, false, 404, 'taskNotFound', {})
    }

    return response('sprints', req, res, true, 200, 'successTaskDetail', sprint)
  } catch (error) {
    showLogs && console.error('GET SPRINT ERROR:', error)

    return response('sprints', req, res, false, 500, 'failedSprintDetail', {})
  }
}

// ** Create a new sprint
const createTask = async (req, res) => {
  try {
    const { name, sprintID } = req?.body

    if (!sprintID) throw Error('Sprint ID Not Found')

    const createSprintObject = {
      Taskname: name || 'New Task',
      SprintID: sprintID,
      CreateBy: req?.current_user?.UserID
    }

    const sprint = await SprintTaskManagement.create(createSprintObject)

    return response('sprints', req, res, true, 201, 'taskCreatedSuccessfully', sprint)
  } catch (error) {
    showLogs && console.error('CREATE SPRINT ERROR:', error)

    return response('sprints', req, res, false, 500, 'failedToCreateTask', {})
  }
}

// ** Update sprint by ID
const updateSprint = async (req, res) => {
  try {
    const { id } = req.params
    const sprint = await SprintTaskManagement.findByPk(id)
    if (!sprint) {
      return response('sprints', req, res, false, 404, 'sprintNotFound', {})
    }
    await sprint.update(req.body)

    return response('sprints', req, res, true, 200, 'successSprintUpdated', sprint)
  } catch (error) {
    showLogs && console.error('UPDATE SPRINT ERROR:', error)

    return response('sprints', req, res, false, 500, 'failedSprintUpdate', {})
  }
}

// ** Soft delete sprint by ID
const deleteSprint = async (req, res) => {
  try {
    const { id } = req.params
    const sprint = await SprintTaskManagement.findByPk(id)
    if (!sprint) {
      return response('sprints', req, res, false, 404, 'sprintNotFound', {})
    }
    await sprint.update({ IsDelete: 1, DeletedDate: new Date(), DeletedBy: req.user?.id || null })

    return response('sprints', req, res, true, 200, 'successSprintDeleted', {})
  } catch (error) {
    showLogs && console.error('DELETE SPRINT ERROR:', error)

    return response('sprints', req, res, false, 500, 'failedSprintDeletion', {})
  }
}

module.exports.sprintTaskController = {
  listTasks,
  getTaskById,
  createTask,
  updateSprint,
  deleteSprint
}

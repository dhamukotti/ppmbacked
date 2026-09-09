const { response } = require('../../constants')
const SprintManagement = require('../../models/sprint-management/sprints')
const SprintWorkspace = require('../../models/sprint-management/sprint-workspace')

const showLogs = true

// 📑 List all sprints
const listSprintsBasic = async (req, res) => {
  try {
    const sprints = await SprintManagement.findAll({
      where: { IsDelete: false, WorkSpaceID: req?.query?.workspaceID }
    })

    if (sprints?.length) {
      return response('sprints', req, res, true, 200, 'successSprintList', sprints)
    } else {
      return response('sprints', req, res, true, 202, 'noSprintsFound', [])
    }
  } catch (error) {
    showLogs && console.error('GET SPRINTS ERROR:', error)
    return response('sprints', req, res, false, 500, 'failedSprintsList', [])
  }
}

// 📑 List all sprints
const listSprints = async (req, res) => {
  try {
    const { SprintGroupID } = req.query

    const sprints = await SprintManagement.findAll({
      where: { IsDelete: false, SprintGroupID: SprintGroupID || null }
    })

    if (sprints?.length) {
      return response('sprints', req, res, true, 200, 'successSprintList', sprints)
    } else {
      return response('sprints', req, res, true, 202, 'noSprintsFound', [])
    }
  } catch (error) {
    showLogs && console.error('GET SPRINTS ERROR:', error)
    return response('sprints', req, res, false, 500, 'failedSprintsList', [])
  }
}

// 📑 Get sprint by ID
const getSprintById = async (req, res) => {
  try {
    const { id } = req.params
    const sprint = await SprintManagement.findOne({
      where: { SprintID: id, IsDelete: false }
    })
    if (!sprint) {
      return response('sprints', req, res, false, 404, 'sprintNotFound', {})
    }

    return response('sprints', req, res, true, 200, 'successSprintDetail', sprint)
  } catch (error) {
    showLogs && console.error('GET SPRINT ERROR:', error)
    return response('sprints', req, res, false, 500, 'failedSprintDetail', {})
  }
}

// 📑 Create a new sprint
const createSprint = async (req, res) => {
  try {
    const { name, workspaceID, sprintGroupID } = req.body

    const createSprintObject = {
      Name: name || 'New Sprint',
      CreateBy: req.current_user?.UserID,
      WorkSpaceID: workspaceID,
      SprintGroupID: sprintGroupID
    }

    const sprint = await SprintManagement.create(createSprintObject)

    return response('sprints', req, res, true, 201, 'successSprintCreated', sprint)
  } catch (error) {
    showLogs && console.error('CREATE SPRINT ERROR:', error)
    return response('sprints', req, res, false, 500, 'failedSprintCreation', {})
  }
}

// 📑 Update sprint by ID
const updateSprint = async (req, res) => {
  try {
    const { id } = req.params
    const sprint = await SprintManagement.findByPk(id)
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

// 📑 Soft delete sprint by ID
const deleteSprint = async (req, res) => {
  try {
    const { id } = req.params
    const sprint = await SprintManagement.findByPk(id)
    if (!sprint) {
      return response('sprints', req, res, false, 404, 'sprintNotFound', {})
    }

    await sprint.update({
      IsDelete: true,
      DeletedDate: new Date(),
      DeletedBy: req.current_user?.UserID || null
    })

    return response('sprints', req, res, true, 200, 'successSprintDeleted', {})
  } catch (error) {
    showLogs && console.error('DELETE SPRINT ERROR:', error)
    return response('sprints', req, res, false, 500, 'failedSprintDeletion', {})
  }
}

// 📑 Start sprint
const startSprint = async (req, res) => {
  try {
    const { id } = req.params
    const sprint = await SprintManagement.findByPk(id)
    if (!sprint) {
      return response('sprints', req, res, false, 404, 'sprintNotFound', {})
    }

    await sprint.update({
      SprintStatus: 'Active',
      SprintTimelineStart: sprint.SprintTimelineStart || new Date()
    })

    return response('sprints', req, res, true, 200, 'successSprintStarted', sprint)
  } catch (error) {
    showLogs && console.error('START SPRINT ERROR:', error)
    return response('sprints', req, res, false, 500, 'failedSprintStart', {})
  }
}

// 📑 Pause sprint
const pauseSprint = async (req, res) => {
  try {
    const { id } = req.params
    const sprint = await SprintManagement.findByPk(id)
    if (!sprint) {
      return response('sprints', req, res, false, 404, 'sprintNotFound', {})
    }

    await sprint.update({
      SprintStatus: 'Paused'
    })

    return response('sprints', req, res, true, 200, 'successSprintPaused', sprint)
  } catch (error) {
    showLogs && console.error('PAUSE SPRINT ERROR:', error)
    return response('sprints', req, res, false, 500, 'failedSprintPause', {})
  }
}

// 📑 Complete sprint
const completeSprint = async (req, res) => {
  try {
    const { id } = req.params
    const sprint = await SprintManagement.findByPk(id)
    if (!sprint) {
      return response('sprints', req, res, false, 404, 'sprintNotFound', {})
    }

    await sprint.update({
      SprintStatus: 'Completed',
      SprintTimelineEnd: new Date()
    })

    return response('sprints', req, res, true, 200, 'successSprintCompleted', sprint)
  } catch (error) {
    showLogs && console.error('COMPLETE SPRINT ERROR:', error)
    return response('sprints', req, res, false, 500, 'failedSprintCompletion', {})
  }
}

// 📑 Update sprint timer (add elapsed time)
const updateSprintTimer = async (req, res) => {
  try {
    const { id } = req.params
    const { seconds } = req.body
    const sprint = await SprintManagement.findByPk(id)
    if (!sprint) {
      return response('sprints', req, res, false, 404, 'sprintNotFound', {})
    }

    const updatedSeconds = sprint.SprintTimeElapsedInSeconds + (seconds || 0)

    await sprint.update({
      SprintTimeElapsedInSeconds: updatedSeconds
    })

    return response('sprints', req, res, true, 200, 'successSprintTimerUpdated', sprint)
  } catch (error) {
    showLogs && console.error('UPDATE SPRINT TIMER ERROR:', error)
    return response('sprints', req, res, false, 500, 'failedSprintTimerUpdate', {})
  }
}

module.exports.sprintController = {
  listSprintsBasic,
  listSprints,
  getSprintById,
  createSprint,
  updateSprint,
  deleteSprint,
  startSprint,
  pauseSprint,
  completeSprint,
  updateSprintTimer
}

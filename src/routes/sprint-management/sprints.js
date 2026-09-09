const { sprintController: sm } = require('../../controllers/sprint-management/sprints')
const auth = require('../../middleware/auth.middleware')

module.exports = function (app, router) {
  // 📑 List all sprints name and id
  router.get('/sprints-basic', auth(), sm.listSprintsBasic)

  // 📑 List all sprints
  router.get('/sprints', auth(), sm.listSprints)

  // 📑 Get sprint by ID
  router.get('/sprints/:id', auth(), sm.getSprintById)

  // 📑 Create a new sprint
  router.post('/sprints', auth(), sm.createSprint)

  // 📑 Update a sprint
  router.put('/sprints/:id', auth(), sm.updateSprint)

  // 📑 Soft delete a sprint
  router.delete('/sprints/:id', auth(), sm.deleteSprint)

  // 📑 Start a sprint
  router.post('/sprints/:id/start', auth(), sm.startSprint)

  // 📑 Pause a sprint
  router.post('/sprints/:id/pause', auth(), sm.pauseSprint)

  // 📑 Complete a sprint
  router.post('/sprints/:id/complete', auth(), sm.completeSprint)

  // 📑 Update sprint timer (increment elapsed time)
  router.post('/sprints/:id/update-timer', auth(), sm.updateSprintTimer)

  // Mount the router
  app.use('/api', router)
}

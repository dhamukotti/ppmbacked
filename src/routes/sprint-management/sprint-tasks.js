const { sprintTaskController: st } = require('../../controllers/sprint-management/sprint-tasks')
const auth = require('../../middleware/auth.middleware')

module.exports = function (app, router) {
  router.get('/sprint-tasks', auth(), st.listTasks)
  router.get('/sprint-tasks/:id', auth(), st.getTaskById)
  router.post('/sprint-tasks', auth(), st.createTask)
  router.put('/sprint-tasks/:id', auth(), st.updateSprint)
  router.delete('/sprint-tasks/:id', auth(), st.deleteSprint)

  app.use('/api', router)
}

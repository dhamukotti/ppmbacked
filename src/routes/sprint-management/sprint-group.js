const { sprintGroupController: sgc } = require('../../controllers/sprint-management/sprint-group')
const auth = require('../../middleware/auth.middleware')

module.exports = function (app, router) {
  router.get('/sprint-group', auth(), sgc.list)
  router.post('/sprint-group', auth(), sgc.create)
  router.put('/sprint-group/:id', auth(), sgc.update)
  router.delete('/sprint-group/:id', auth(), sgc.deleteSprintGroup)
  app.use('/api', router)
}

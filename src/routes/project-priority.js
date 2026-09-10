const { priorityController: pc } = require('../controllers/project-priority')

// ** Middlewares
const auth = require('../middleware/auth.middleware')
const { add, update } = require('../validator/project-priority')

module.exports = function (app, router) {
  router.get('/project-priority', auth(), pc.list)
  router.post('/project-priority', auth(), add, pc.add)
  router.put('/project-priority/:id', auth(), update, pc.update)

  app.use('/api', router)
}

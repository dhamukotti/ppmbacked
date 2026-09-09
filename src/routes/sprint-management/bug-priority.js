const { bugQueuePriorityCtrl: bqp } = require('../../controllers/sprint-management/bug-priority')
const auth = require('../../middleware/auth.middleware')

module.exports = function (app, router) {
  router.get('/bug-queue-priority', auth(), bqp.list)
  router.post('/bug-queue-priority', auth(), bqp.add)
  router.put('/bug-queue-priority/:id', auth(), bqp.update)

  app.use('/api', router)
}

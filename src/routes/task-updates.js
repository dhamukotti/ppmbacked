const { taskUpdatesController: tu } = require('../controllers/task-updates')

const auth = require('../middleware/auth.middleware')

module.exports = function (app, router) {
  router.get('/task-updates/:taskID', auth(), tu.listUpdates)
  router.post('/task-updates', auth(), tu.writeUpdate)
  router.put('/task-updates/like/:updateID', auth(), tu.likeUpdate)
  router.post('/task-updates/reply', auth(), tu.replyToUpdate)

  app.use('/api', router)
}

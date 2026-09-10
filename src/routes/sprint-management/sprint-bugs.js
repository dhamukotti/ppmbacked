const { bugQueueController: bq } = require('../../controllers/sprint-management/sprint-bugs')
const auth = require('../../middleware/auth.middleware')

module.exports = function (app, router) {
  router.get('/bug-queue', auth(), bq.listBugs)
  router.get('/bug-queue/:id', auth(), bq.getBugById)
  router.post('/bug-queue', auth(), bq.createBug)
  router.put('/bug-queue/:id', auth(), bq.updateBug)
  router.delete('/bug-queue/:id', auth(), bq.deleteBug)
  router.delete('/bug-delete', auth(), bq.deleteMultiple)

  app.use('/api', router)
}

const { taskMasterController: tm } = require('../controllers/task-master')
const { listVal, addVal, updateVal, delMultiVal, deleteDy } = require('../validator/task-master')

const auth = require('../middleware/auth.middleware')

module.exports = function (app, router) {
  router.get('/task', auth(), listVal, tm.listTasks)
  router.post('/task', auth(), addVal, tm.addTasks)
  router.put('/task/:id', auth(), updateVal, tm.updateTasks)
  router.delete('/dynamic-task/:id', auth(), deleteDy, tm.deleteDynamicTask)
  router.delete('/task/:id', auth(), tm.deleteTask)
  router.delete('/task-delete-mulitple', auth(), delMultiVal, tm.deleteMultipleTask)
  router.post('/task/fileupload/:id', auth(), updateVal, tm.fileUpload)
  app.use('/api', router)
}

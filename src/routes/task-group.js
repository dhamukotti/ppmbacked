const { taskgroupController: tg } = require('../controllers/task-group')

const {
  taskGroupAdd: add,
  taskGroupUpdate: upd,
  taskGroupDelete: del,
  createColumn: crc,
  updateColumn: upc,
  deleteColumn: ddc
} = require('../validator/task-group')

const auth = require('../middleware/auth.middleware')

module.exports = function (app, router) {
  router.get('/task-group', auth(), tg.listTaskGroup)
  router.post('/task-group', auth(), add, tg.addTaskGroup)
  router.put('/task-group/:id', auth(), upd, tg.updateTaskGroup)
  router.delete('/task-group/:id', auth(), del, tg.deleteTaskGroup)
  router.post('/create-column', auth(), crc, tg.createColumn)
  router.put('/update-column/:id', auth(), upc, tg.updateColumn)
  router.delete('/delete-column/:id', auth(), ddc, tg.deleteColumn)

  app.use('/api', router)
}

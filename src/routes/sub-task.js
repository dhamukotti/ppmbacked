const { subTaskController: st } = require('../controllers/sub-task')
const { listVal, addVal, updateVal, createColumn, listCol } = require('../validator/sub-tasks')

const auth = require('../middleware/auth.middleware')

module.exports = function (app, router) {
  router.get('/sub-task', auth(), listVal, st.list)
  router.post('/sub-task', auth(), addVal, st.addSubTask)
  router.put('/sub-task/:id', auth(), updateVal, st.update)
  router.delete('/sub-task/:id', auth(), st.deleteSubTask)
  router.get('/sub-task-column', auth(), listCol, st.getListOfColumns)
  router.post('/sub-task-column', auth(), createColumn, st.createSubTaskColumn)

  app.use('/api', router)
}

const { dpController: dc } = require('../controllers/dynamic-dropdown')

// ** Middlewares
const auth = require('../middleware/auth.middleware')
const { add, update, deleteVal } = require('../validator/dynamic-dropdown')

module.exports = function (app, router) {
  router.get('/dropdown-items', auth(), dc.list)
  router.post('/dropdown-items', auth(), add, dc.add)
  router.put('/dropdown-items/:id', auth(), update, dc.update)
  router.delete('/dropdown-items/:id', auth(), deleteVal, dc.deleteDP)

  app.use('/api', router)
}

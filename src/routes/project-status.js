const { statusController: sc } = require('../controllers/project-status')

// ** Middlewares
const auth = require('../middleware/auth.middleware')
const { add, update } = require('../validator/project-status')

module.exports = function (app, router) {
  router.get('/project-status', auth(), sc.list)
  router.post('/project-status', auth(), add, sc.add)
  router.put('/project-status/:id', auth(), update, sc.update)

  app.use('/api', router)
}

const { recentActivityController: rac } = require('../controllers/recent-activity')

// ** Middlewares
const auth = require('../middleware/auth.middleware')

module.exports = function (app, router) {
  router.get('/recent-activity', auth(), rac.list)

  app.use('/api', router)
}

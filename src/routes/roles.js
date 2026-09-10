const { rolesController: rc } = require('../controllers/roles')
const auth = require('../middleware/auth.middleware')

module.exports = function (app, router) {
  router.get('/roles', auth(), rc.roleList)

  app.use('/api', router)
}

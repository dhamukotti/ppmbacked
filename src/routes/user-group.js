const { userGroupController: ug } = require('../controllers/user-group')
const { createUserGroupValidation: cug } = require('../validator/user-group')
const auth = require('../middleware/auth.middleware')

module.exports = function (app, router) {
  router.post('/user-group', auth(), cug, ug.createUserGroupAction)
  router.get('/user-group', auth(), ug.getUserGroup)

  app.use('/api', router)
}

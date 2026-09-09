const { organizationController: oc } = require('../controllers/organization')
const { validateOrganization, validateOrganizationUpdate } = require('../validator/organization')
const auth = require('../middleware/auth.middleware')

module.exports = function (app, router) {
  router.get('/organization', auth(), oc.listOrganization)
  router.post('/organization', auth(), validateOrganization, oc.addOrganization)
  router.put('/organization/:id', auth(), validateOrganizationUpdate, oc.updateOrganization)

  app.use('/api', router)
}

const { columnTypeLookup: ctl } = require('../controllers/column-type-lookup')

const auth = require('../middleware/auth.middleware')

module.exports = function (app, router) {
  router.get('/column-type', auth(), ctl.list)

  app.use('/api', router)
}

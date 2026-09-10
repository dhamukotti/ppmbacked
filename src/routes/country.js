const { countriesController: cs } = require('../controllers/country')
module.exports = function (app, router) {
  router.get('/country', cs.getAllCountries)

  app.use('/api', router)
}

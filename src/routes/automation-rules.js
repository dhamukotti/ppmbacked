const { automationRulesController: ar } = require('../controllers/automation-rules')
module.exports = function (app, router) {
  router.get('/automation-rules/:projectID', ar.get)
  router.post('/automation-rules', ar.add)
  router.put('/automation-rules/:ruleID', ar.update)
  router.delete('/automation-rules/:ruleID', ar.deleteRule)

  app.use('/api', router)
}

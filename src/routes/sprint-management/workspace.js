const { workspaceController: wc } = require('../../controllers/sprint-management/workspace')

const { workspaceAdd: add, workspaceUpdate: upd, workspaceDelete: del } = require('../../validator/workspace')

const auth = require('../../middleware/auth.middleware')

module.exports = function (app, router) {
  router.get('/sprint-workspace', auth(), wc.listWorkspace)
  router.post('/sprint-workspace', auth(), add, wc.addWorkspace)
  router.put('/sprint-workspace/:id', auth(), upd, wc.updateWorkspace)
  router.delete('/sprint-workspace/:id', auth(), del, wc.deleteWorkspace)

  app.use('/api', router)
}

const { workspaceController: wc } = require('../controllers/workspace')

const {
  workspaceActionValidation: wav,
  workspaceAdd: add,
  workspaceUpdate: upd,
  workspaceDelete: del
} = require('../validator/workspace')

const auth = require('../middleware/auth.middleware')

module.exports = function (app, router) {
  router.post('/workspace-action', auth(), wav, wc.workspaceAction)
  router.get('/workspace',  wc.listWorkspace)
  router.post('/workspace', auth(), add, wc.addWorkspace)
  router.put('/workspace/:id', auth(), upd, wc.updateWorkspace)
  router.delete('/workspace/:id', auth(), del, wc.deleteWorkspace)

  app.use('/api', router)
}

const { workspaceController: wc } = require('../controllers/management')

const {
  projectMngValidation: pmv,
  taskMngValidation: tmv,
  registerInvitation: rc,
  inviteUserValidation: inu,
  acceptInviteValidation: acc
} = require('../validator/workspace')

const auth = require('../middleware/auth.middleware')
const checkUserInvitation = require('../middleware/accept-invite')

module.exports = function (app, router) {
  router.post('/project-management', auth(), pmv, wc.projectAction)
  router.post('/task-management', auth(), tmv, wc.taskAction)
  router.post('/invite-user', auth(), inu, wc.inviteUserAction)
  router.get('/invite/:id', wc.getInvitation)
  router.post('/register-invite', rc, wc.registrationOnInvite)
  router.post('/accept-invite/:id', checkUserInvitation(), acc, wc.acceptInvitation)

  app.use('/api', router)
}

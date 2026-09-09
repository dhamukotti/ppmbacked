const { projectController: pc } = require('../controllers/project')

// ** Middlewares
const { validationProjectAdd, validationProjectView, validationProjectUpdate } = require('../validator/project')
const auth = require('../middleware/auth.middleware')

module.exports = function (app, router) {
  router.get('/project', auth(), pc.listProject)
  router.post('/project', auth(), validationProjectAdd, pc.addProject)
  router.get('/project/:id', auth(), validationProjectView, pc.viewProject)
  router.put('/project/:id', auth(), validationProjectUpdate, pc.updateProject)
  router.delete('/project/:id', auth(), validationProjectView, pc.deleteProject)
  router.get('/project-members', auth(), pc.listUsers)

  app.use('/api', router)
}

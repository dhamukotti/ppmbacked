const { loginController: lc } = require('../controllers/auth')
const { signupValidator, loginValidator } = require('../validator/auth')

module.exports = function (app, router) {
  router.post('/login', loginValidator, lc.createLoginRecord)
  router.get('/verify-token', lc.verifyToken)
  router.post('/get-refresh-token', lc.createTokenFromRefreshToken)
  router.post('/signup', signupValidator, lc.signUpUser)
  router.delete('/delete-user/:id', lc.deleteUser)

  app.use('/api', router)
}

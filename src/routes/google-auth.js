const { googleAuthController: gc } = require('../controllers/google-auth')
const passport = require('passport')

module.exports = function (app, router) {
  router.get('/login/success', gc.loginSuccess)

  router.get('/login/failed', gc.loginFailed)

  router.get('/google', passport.authenticate('google', ['profile', 'email']))

  router.get(
    '/google/callback',
    passport.authenticate('google', {
      successRedirect: process.env.CLIENT_URL + '/login-success',
      failureRedirect: '/login'
    })
  )

  router.get('/logout', (req, res, next) => {
    req.logout(err => {
      if (err) {
        return next(err)
      } else {
        res.redirect(process.env.CLIENT_URL)
      }
    })
  })

  app.use('/auth', router)
}

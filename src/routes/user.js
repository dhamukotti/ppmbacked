const { userController: uc } = require('../controllers/user')

const auth = require('../middleware/auth.middleware')

module.exports = function (app, router) {
  router.get('/profile', auth(), uc.getUserProfile)
  router.post('/forgot-password', uc.forgotPassword)
  router.post('/verify-otp', uc.verifyOTP)
  router.patch('/update-password', uc.updatePassword)
  router.put('/change-password', auth(), uc.changePassword)
  router.put('/profile-update', auth(), uc.profileUpdate)

  router.get('/user/recent-activity', auth(), uc.recentActivity)

  app.use('/api', router)
}

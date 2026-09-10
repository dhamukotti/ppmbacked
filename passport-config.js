const dotenv = require('dotenv')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

dotenv.config()

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process?.env?.BASE_URL + '/auth/google/callback',
      scope: ['profile', 'email']
    },
    (accessToken, refreshToken, profile, done) => {
      // Handle user profile data and authentication
      console.log('AUTHENTICATION SUCCESS', profile?._json)
      done(null, profile?._json)
    },
    err => {
      console.error('PASSPORT ERROR ', err)
    }
  )
)

passport.serializeUser((user, done) => {
  console.log('user serializeUser :', user)
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

module.exports = passport

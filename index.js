require('dotenv').config()

// ** Basic Imports
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const flash = require('express-flash')
const fileUpload = require('express-fileupload')
const express = require('express')
const session = require('express-session')
const http = require('http')
const { initSocket } = require('./src/socket-connection')

// ** Swagger Imports
const swaggerUI = require('swagger-ui-express')

// ** Custom Imports
const corsConfig = require('./src/constants/cors')
const { websiteSpecs } = require('./src/api-docs/api')
// const { rateLimiterUsingThirdParty } = require('./src/middleware/rateLimiter')

// ** PassportJS Config
require('./passport-config')
const passport = require('passport')
const extractDomain = require('./src/constants/extractDomain')

// ** DB Connection
require('./src/db-connection').connectToDatabase()

// ** Express Setup
const app = express()
const router = express.Router()

// ** Define PORT
const PORT = process.env.PORT || 9900

// ** Middleware
app.use(cors(corsConfig))

// Create an HTTP server from the Express app
const server = http.createServer(app)

// Initialize Socket.IO with the server
initSocket(server, {
  cors: {
    origin: '*'
  }
})

app.use(bodyParser.json())
app.use(fileUpload())
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false, parameterLimit: 1000000 }))
app.use(flash())
// ** RateLimiting
// app.use(rateLimiterUsingThirdParty)

// ** Session Config
const ppmSession = {
  secret: 'PPM',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, // Security: Prevents JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === 'production', // Secure cookie in production
    sameSite: 'None', // Required for cross-site cookies (Google Auth)
    maxAge: 60000 * 30
  }
}
app.use(session(ppmSession))
app.use(passport.initialize())
app.use(passport.session(ppmSession))

// ** Public Folder Import
app.use('/public', express.static(path.join(__dirname, 'public')))

// ** View Engine Setup
app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'ejs')

// ** Swagger UI
app.use('/swagger', swaggerUI.serveFiles(websiteSpecs), swaggerUI.setup(websiteSpecs))

// ** Api Calls and functions
app.get('/', (req, res) => {
  res.render('index')
})

// ** Routes Import
requireRoutes(path.join(__dirname, '/src/routes'))

// ** Reusable function to require routes
function requireRoutes(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      // Recursively load routes from subdirectories
      requireRoutes(fullPath)
    } else if (file.endsWith('.js') && file !== 'index.js') {
      // Require route file and register with app and router
      require(fullPath)(app, router)
    }
  })
}

// ** Default Route
app.get('*', (req, res) => {
  res.render('not-found', { route: process.env.BASE_URL, domain: extractDomain(process.env.BASE_URL) })
})

// ** Server Start
server.listen(PORT, () => {
  console.log(`Listening on port ${process.env.BASE_URL}`)
})

module.exports = app

require('dotenv').config()
const { Sequelize } = require('@sequelize/core')
const { MsSqlDialect } = require('@sequelize/mssql')

// Create a Sequelize instance
const sequelize = new Sequelize({
  dialect: MsSqlDialect,
  server: process.env.DB_SERVER_IP,
  port: 1433,
  database: process.env.DB_NAME,
  pool: {
    max: 20,          // default is 5 — too low for most apps
    min: 2,
    acquire: 60000,   // ms to wait before throwing timeout (increase this)
    idle: 10000,      // ms a connection can sit idle before being released
    evict: 1000,      // how often to check for idle connections
  },
  authentication: {
    type: 'default',
    options: {
      userName: process.env.DB_USER_NAME,
      password: process.env.DB_PASSWORD
    }
  },
  encrypt: false,
  connectTimeout: 120000,
  trustServerCertificate: true
})

// Function to establish the database connection
async function connectToDatabase() {
  try {
    await sequelize.authenticate()
    console.log('Connected to SQL Server database')

    return 'Connected to SQL Server database'
  } catch (error) {
    console.log('Connected to SQL Server database',process.env.DB_USER_NAME);
    console.log('Connected to SQL Server database',process.env.DB_PASSWORD);
console.log('Connected to SQL Server database',process.env.DB_NAME);
    console.error('Error connecting to SQL Server database:', error)

    return error
  }
}

// Export the function to connect to the database
module.exports = { connectToDatabase, sequelize }

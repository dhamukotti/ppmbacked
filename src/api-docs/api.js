const swaggerJsDoc = require('swagger-jsdoc')

const serverList = process.env.BASE_URL || ''
const serversUrl = serverList.split(',').map(item => {
  return { url: item.trim() }
})

const websiteSpecs = swaggerJsDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: "PPM-API's",
      version: '1.0.0',
      description: 'for website'
    },
    servers: serversUrl,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/api-docs/swagger/*.js']
})

module.exports = {
  websiteSpecs
}

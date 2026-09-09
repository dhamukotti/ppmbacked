const originArray = process.env.CORS_ORIGINS?.replaceAll(' ', '')?.split(',')

const corsConfig = {
  origin: originArray,
  methods: 'GET,POST,PUT,DELETE,PATCH',
  credentials: true
}
module.exports = corsConfig

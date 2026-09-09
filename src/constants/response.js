const { languageFunc } = require('../i18n/i18n')
const messages = require('../i18n/locales/en.json')

const responseObj = (
  api,
  req,
  res,
  status = false,
  statusCode = 500,
  languageMessage = messages.somethingWentWrong,
  data = {},
  error = null
) => {
  // Log the response message dynamically
  const i18n = languageFunc(req.language || 'en')
  const message = i18n.__(languageMessage)
  if (data !== 'logger') {
    return res.status(statusCode).send({ status, statusCode, message, data: status === false ? error : data })
  }
}

module.exports = responseObj

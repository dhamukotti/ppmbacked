const path = require('path')
const { I18n } = require('i18n')

const en = require('./locales/en.json')
const ar = require('./locales/ar.json')

function languageFunc(language = 'en') {
  return new I18n({
    locales: [en, ar],
    directory: path.join(__dirname, '/locales'),
    defaultLocale: language
  })
}

module.exports = {
  languageFunc
}

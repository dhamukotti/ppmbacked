const { response } = require('../constants')
const Country = require('../models/country')

// ** Turn logs on
const showLogs = false

// ** Country List
const getAllCountries = async (req, res) => {
  try {
    const countries = await Country.findAll()
    if (countries) {
      return response('country', req, res, true, 200, 'successCountryList', countries)
    } else {
      return response('country', req, res, true, 202, 'noCountriesFound', [])
    }
  } catch (error) {
    showLogs && console.error('GET COUNTRIES ERROR :', error)

    res.status(422).json({ error })
  }
}

module.exports.countriesController = { getAllCountries }

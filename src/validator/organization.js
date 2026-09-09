const { body, param } = require('express-validator')

const validateOrganization = [
  body('OrganizationName').exists().isString(),
  body('CountryID').exists().isNumeric().isLength({ max: 4 })
]

const validateOrganizationUpdate = [
  param('id').exists().isNumeric(),
  body('OrganizationName').optional().isString(),
  body('CountryID').optional().isNumeric().isLength({ max: 4 })
]

module.exports = { validateOrganization, validateOrganizationUpdate }

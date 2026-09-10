const { body } = require('express-validator')

const createUserGroupValidation = [
  body('email').exists().isString().isLength({ max: 200 }),
  body('organizationID').exists().isNumeric()
]
module.exports = {
  createUserGroupValidation
}

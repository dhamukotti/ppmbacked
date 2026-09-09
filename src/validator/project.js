const { body, param } = require('express-validator')

const validationProjectAdd = [
  body('ProjectName').exists().isString().isLength({ max: 50 }),
  body('WorkspaceID').exists().isNumeric(),
  body('IsOpen').exists().isNumeric()
]

const validationProjectView = [param('id').exists().isNumeric()]

const validationProjectUpdate = [
  param('id').exists().isNumeric(),
  body('ProjectName').exists().isString().isLength({ max: 50 })
]

module.exports = { validationProjectAdd, validationProjectView, validationProjectUpdate }

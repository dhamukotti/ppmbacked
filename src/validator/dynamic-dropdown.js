const { body, param } = require('express-validator')

const add = [
  body('Valuetxt').exists().isString().isLength({ max: 50 }),
  body('WorkspaceID').exists().isNumeric(),
  body('ProjectID').exists().isNumeric(),
  body('TaskGroupID').exists().isNumeric(),
  body('TaskID').exists().isNumeric()
]

const update = [body('Valuetxt').exists().isString().isLength({ max: 50 }), param('id').exists().isNumeric()]

const deleteVal = [param('id').exists().isNumeric()]

module.exports = { add, update, deleteVal }

const { body, param } = require('express-validator')

const add = [
  body('PriorityName').exists().isString().isLength({ max: 50 }),
  body('Colorcode').exists().isHexColor(),
  body('TaskgroupID').exists().isNumeric()
]

const update = [
  body('PriorityName').exists().isString().isLength({ max: 50 }),
  body('Colorcode').exists().isHexColor(),
  param('id').exists().isNumeric()
]

module.exports = { add, update }

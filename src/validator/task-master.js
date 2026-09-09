const { query, body, param } = require('express-validator')

const listVal = [query('taskGroupID').optional().isNumeric(), query('projectID').optional().isNumeric()]

const addVal = [
  body('taskGroupID').exists().isNumeric(),
  body('Taskname').optional().isString().isLength({ max: 50 }),
  body('StatusID').optional().isNumeric(),
  body('PriorityID').optional().isNumeric()
]

const updateVal = [
  param('id').exists(),
  body('Taskname').optional().isString().isLength({ max: 50 }),
  body('StatusID').optional().isNumeric(),
  body('PriorityID').optional().isNumeric()
]

const delMultiVal = [body('taskIds').exists().isArray()]

const deleteDy = [param('id').exists()]

module.exports = { listVal, addVal, updateVal, delMultiVal, deleteDy }

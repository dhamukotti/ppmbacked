const { query, body, param } = require('express-validator')

const listVal = [query('taskGroupID').optional().isNumeric(), query('projectID').optional().isNumeric()]

const listCol = [query('taskID').exists().isNumeric()]

const addVal = [body('taskID').exists().isNumeric(), body('SubTaskName').optional().isString().isLength({ max: 50 })]

const updateVal = [param('id').exists(), body('SubTaskName').optional().isString().isLength({ max: 50 })]

const delMultiVal = [body('taskIds').exists().isArray()]

const deleteDy = [param('id').exists()]

const createColumn = [
  body('columnName').exists().isString().isLength({ max: 25 }),
  body('columnTypeID').exists().isNumeric(),
  body('taskGroupID').exists().isNumeric(),
  body('workspaceID').exists().isNumeric(),
  body('projectID').exists().isNumeric(),
  body('taskID').exists().isNumeric()
]

module.exports = { listVal, addVal, updateVal, delMultiVal, deleteDy, createColumn, listCol }

const { body, param } = require('express-validator')

const taskMngValidation = [
  body('groupName').exists().isString().isLength({ max: 50 }),
  body('projectID').exists().isNumeric(),
  body('taskGroupID').optional().isNumeric()
]

const taskGroupAdd = [
  body('groupName').exists().isString().isLength({ max: 50 }),
  body('projectID').exists().isNumeric()
]

const taskGroupUpdate = [param('id').exists().isNumeric()]

const taskGroupDelete = [
  body('groupName').exists().isString().isLength({ max: 50 }),
  body('projectID').exists().isNumeric(),
  body('taskGroupID').optional().isNumeric()
]

const createColumn = [
  body('columnName').exists().isString().isLength({ max: 25 }),
  body('columnTypeID').exists().isNumeric(),
  body('taskGroupID').exists().isNumeric(),
  body('workspaceID').exists().isNumeric(),
  body('projectID').exists().isNumeric()
]

const updateColumn = [
  param('id')?.exists().isNumeric(),
  body('columnName').exists().isString().isLength({ max: 25 }),
  body('projectID').exists().isNumeric()
]

const deleteColumn = [param('id')?.exists().isNumeric()]

module.exports = {
  taskMngValidation,
  taskGroupAdd,
  taskGroupUpdate,
  taskGroupDelete,
  createColumn,
  updateColumn,
  deleteColumn
}

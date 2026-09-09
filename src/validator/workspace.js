const { body, param } = require('express-validator')

const workspaceActionValidation = [
  body('command').exists().isString().isLength({ min: 2, max: 3 }),
  body('workspaceName').exists().isString().isLength({ max: 50 }),
  body('organizationID').exists().isNumeric(),
  body('workspaceID').optional().isNumeric()
]

const workspaceAdd = [
  body('workspaceName').exists().isString().isLength({ max: 50 }),
  body('organizationID').exists().isNumeric()
]

const workspaceUpdate = [
  body('workspaceName').exists().isString().isLength({ max: 50 }),
  body('organizationID').exists().isNumeric(),
  param('id').exists().isNumeric()
]

const workspaceDelete = [
  param('id').exists().isNumeric(),
  body('organizationID').exists().isNumeric(),
  body('workspaceName').exists().isString().isLength({ max: 50 })
]

const projectMngValidation = [
  body('command').exists().isString().isLength({ min: 2, max: 3 }),
  body('projectName').exists().isString().isLength({ max: 50 }),
  body('workspaceID').exists().isNumeric(),
  body('projectID').optional().isNumeric()
]

const taskMngValidation = [
  body('command').exists().isString().isLength({ min: 2, max: 3 }),
  body('groupName').exists().isString().isLength({ max: 50 }),
  body('projectID').exists().isNumeric(),
  body('taskGroupID').optional().isNumeric()
]

const inviteUserValidation = [
  body('invitations').exists().isArray(),
  body('projectID').exists().isNumeric(),
  body('workspaceID').exists().isNumeric()
]

const createUserGroupValidation = [
  body('email').exists().isString().isLength({ max: 200 }),
  body('organizationID').exists().isNumeric()
]

const acceptInviteValidation = [param('id').exists().isNumeric()]

const registerInvitation = [
  body('fullName').exists().isString(),
  body('invitationID').exists().isNumeric(),
  body('password').exists().isStrongPassword()
]

module.exports = {
  workspaceActionValidation,
  workspaceAdd,
  workspaceUpdate,
  workspaceDelete,
  projectMngValidation,
  taskMngValidation,
  inviteUserValidation,
  createUserGroupValidation,
  registerInvitation,
  acceptInviteValidation
}

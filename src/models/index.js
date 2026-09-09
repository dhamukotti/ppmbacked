const TaskGroups = require('./task-group')
const Project = require('./project')
const Signup = require('./signup')
const Workspace = require('./workspace')
const ColumnTypeLookup = require('./column-type-lookup')
const TaskMaster = require('./task-master')
const ProjectStatus = require('./project-status')
const ProjectPriority = require('./project-priority')
const DynamicColumns = require('./dynamic-column')
const AdditionalColumnValuesTask = require('./additional-column-task')
const DynamicDropdown = require('./dynamic-dropdown')
const AdditionalColumnSubTask = require('./additional-column-subtask')
const SubTasks = require('./subtask')
const SubTaskDynamicColumn = require('./subtask-dynamic-column')
const RecentActivity = require('./recent-activity')
const UserProjects = require('./user-project')
const Roles = require('./role')
const BugQueueManagement = require('./sprint-management/bug-queue')
const BugPriority = require('./sprint-management/bug-priority')

// Define associations here if not already done in the individual model files
TaskGroups.hasMany(AdditionalColumnValuesTask, {
  foreignKey: 'TaskGroupID',
  as: 'additionalColumns'
})
Project.hasMany(AdditionalColumnValuesTask, {
  foreignKey: 'ProjectID',
  as: 'additionalColumns'
})

TaskMaster.hasMany(AdditionalColumnSubTask, {
  foreignKey: 'TaskID',
  as: 'additionalColumns'
})

AdditionalColumnValuesTask.belongsTo(Project, {
  foreignKey: 'ProjectID',
  as: 'project'
})
AdditionalColumnValuesTask.belongsTo(TaskGroups, {
  foreignKey: 'TaskGroupID',
  as: 'taskGroup'
})

AdditionalColumnSubTask.belongsTo(TaskGroups, {
  foreignKey: 'TaskGroupID',
  as: 'taskGroup'
})

AdditionalColumnValuesTask.belongsTo(ColumnTypeLookup, {
  foreignKey: 'AdditionalColumnTypeID',
  as: 'ColumnType'
})

AdditionalColumnSubTask.belongsTo(ColumnTypeLookup, {
  foreignKey: 'AdditionalColumnTypeID',
  as: 'ColumnType'
})

TaskMaster.hasMany(DynamicColumns, {
  foreignKey: 'TaskID',
  as: 'additionalValues'
})

SubTasks.hasMany(SubTaskDynamicColumn, {
  foreignKey: 'SubTaskID',
  as: 'additionalValues'
})

DynamicColumns.belongsTo(TaskMaster, {
  foreignKey: 'TaskID',
  as: 'taskMaster'
})

SubTaskDynamicColumn.belongsTo(SubTasks, {
  foreignKey: 'SubTaskID',
  as: 'subTasks'
})

DynamicColumns.belongsTo(ColumnTypeLookup, {
  foreignKey: 'Columntype',
  as: 'columnType'
})

SubTaskDynamicColumn.belongsTo(ColumnTypeLookup, {
  foreignKey: 'Columntype',
  as: 'columnType'
})

DynamicColumns.belongsTo(ProjectStatus, { as: 'Status', foreignKey: 'StatusID' })
DynamicColumns.belongsTo(DynamicDropdown, { as: 'Dropdown', foreignKey: 'DynamicDropdownID' })
DynamicColumns.belongsTo(Signup, { as: 'User', foreignKey: 'DynamicUserID' })

SubTaskDynamicColumn.belongsTo(ProjectStatus, { as: 'Status', foreignKey: 'StatusID' })
SubTaskDynamicColumn.belongsTo(DynamicDropdown, { as: 'Dropdown', foreignKey: 'DynamicDropdownID' })
SubTaskDynamicColumn.belongsTo(Signup, { as: 'User', foreignKey: 'DynamicUserID' })

// TaskMaster belongs to Project and Workspace
TaskMaster.belongsTo(Project, {
  foreignKey: 'ProjectID',
  as: 'Project'
})
Project.hasMany(TaskMaster, {
  foreignKey: 'ProjectID',
  as: 'Tasks'
})

TaskMaster.belongsTo(Workspace, { foreignKey: 'WorkspaceID' })
TaskMaster.belongsTo(ProjectStatus, { as: 'Status', foreignKey: 'StatusID' })
TaskMaster.belongsTo(ProjectPriority, { as: 'Priority', foreignKey: 'PriorityID' })
TaskMaster.belongsTo(Signup, { as: 'Owner', foreignKey: 'Taskowner' })
TaskMaster.belongsTo(TaskGroups, { as: 'taskGroup', foreignKey: 'TaskGroupID' })

SubTasks.belongsTo(ProjectStatus, { as: 'Status', foreignKey: 'StatusID' })
SubTasks.belongsTo(Signup, { as: 'Owner', foreignKey: 'SubtaskOwner' })

Project.belongsTo(Signup, { as: 'CreatedBy', foreignKey: 'CreateBy' })

// ** RECENT ACTIVITY ASSOCIATIONS

// Defining the associations
RecentActivity.belongsTo(TaskMaster, {
  as: 'task',
  foreignKey: 'TaskMasterID'
})

RecentActivity.belongsTo(SubTasks, {
  foreignKey: 'SubTasksID'
})

RecentActivity.belongsTo(Signup, {
  as: 'doneBy',
  foreignKey: 'DoneBy'
})

// Reverse associations (optional)
TaskMaster.hasMany(RecentActivity, { foreignKey: 'TaskMasterID' })
SubTasks.hasMany(RecentActivity, { foreignKey: 'SubTasksID' })
Signup.hasMany(RecentActivity, { foreignKey: 'DoneBy' })

// ** USER PROJECTS RELATIONS

UserProjects.belongsTo(Workspace, { foreignKey: 'WorkspaceID' })
Workspace.hasMany(UserProjects, { foreignKey: 'WorkspaceID' })

UserProjects.belongsTo(Project, { foreignKey: 'ProjectID' })
Project.hasMany(UserProjects, { foreignKey: 'ProjectID' })

UserProjects.belongsTo(Signup, { foreignKey: 'UserID', as: 'User' })
Signup.hasMany(UserProjects, { foreignKey: 'UserID' })

UserProjects.belongsTo(Roles, { foreignKey: 'RoleID', as: 'Role' })

// ** SPRINT MANAGEMENT
BugQueueManagement.belongsTo(Signup, {
  as: 'createdBy',
  foreignKey: 'CreateBy'
})
BugQueueManagement.belongsTo(BugPriority, { as: 'Priority', foreignKey: 'PriorityID' })

module.exports = {
  TaskGroups,
  TaskMaster,
  DynamicColumns,
  Project,
  ProjectStatus,
  ProjectPriority,
  Signup,
  Workspace,
  SubTasks,
  SubTaskDynamicColumn,
  AdditionalColumnSubTask,
  AdditionalColumnValuesTask,
  ColumnTypeLookup,
  RecentActivity,
  BugQueueManagement,
  BugPriority
}

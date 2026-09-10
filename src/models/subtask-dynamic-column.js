const { DataTypes, default: Sequelize } = require('@sequelize/core')
const { sequelize } = require('../db-connection')
const Project = require('./project')
const Signup = require('./signup')
const Workspace = require('./workspace')
const ColumnTypeLookup = require('./column-type-lookup')
const TaskMaster = require('./task-master')
const ProjectStatus = require('./project-status')
const DynamicDropdown = require('./dynamic-dropdown')
const SubTasks = require('./subtask')
const AdditionalColumnSubTask = require('./additional-column-subtask')

const SubTaskDynamicColumn = sequelize.define(
  'SubtaskDynamicColumns',
  {
    DynamicID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      allowNull: false
    },
    DynamicColumnValues: {
      type: DataTypes.STRING(),
      allowNull: true
    },
    Columntype: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ColumnTypeLookup,
        key: 'ID'
      }
    },
    SubTaskID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: SubTasks,
        key: 'SubTaskID'
      }
    },
    TaskID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: TaskMaster,
        key: 'TaskID'
      }
    },
    ProjectID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Project,
        key: 'ID'
      }
    },
    IsDelete: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CreateDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    },
    CreateBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Signup,
        key: 'UserID'
      }
    },
    DeletedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    DeletedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Signup,
        key: 'UserID'
      }
    },
    WorkspaceID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Workspace,
        key: 'WorkspaceID'
      }
    },
    AdditionalColumnID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: AdditionalColumnSubTask,
        key: 'AdditionalColumnID'
      }
    },
    DynamicUserID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Signup,
        key: 'UserID'
      }
    },
    DynamicDropdownID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: DynamicDropdown,
        key: 'Dynamic_ddl_ID'
      }
    },
    StatusID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ProjectStatus,
        key: 'StatusID'
      }
    },
    DisplayText: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  },
  {
    timestamps: false,
    tableName: 'SubtaskDynamicColumns'
  }
)

module.exports = SubTaskDynamicColumn

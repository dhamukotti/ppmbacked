const { DataTypes, default: Sequelize } = require('@sequelize/core')
const { sequelize } = require('../db-connection')
const Project = require('./project')
const Signup = require('./signup')
const TaskGroups = require('./task-group') // Make sure this path is correct
const Workspace = require('./workspace')
const ColumnTypeLookup = require('./column-type-lookup')
const TaskMaster = require('./task-master')
const AdditionalColumnValuesTask = require('./additional-column-task')
const ProjectStatus = require('./project-status')
const DynamicDropdown = require('./dynamic-dropdown')

const DynamicColumns = sequelize.define(
  'DynamicColumns',
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
    IsDelete: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TaskID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: TaskMaster,
        key: 'TaskID'
      }
    },
    TaskGroupID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: TaskGroups,
        key: 'TaskGroupID'
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
    ProjectID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Project,
        key: 'ID'
      }
    },
    AdditionalColumnID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: AdditionalColumnValuesTask,
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
    tableName: 'DynamicColumns'
  }
)

module.exports = DynamicColumns

const { DataTypes, default: Sequelize } = require('@sequelize/core')
const { sequelize } = require('../db-connection')
const Project = require('./project')
const Signup = require('./signup')
const TaskGroups = require('./task-group') // Make sure this path is correct
const Workspace = require('./workspace')
const ColumnTypeLookup = require('./column-type-lookup')
const TaskMaster = require('./task-master')

const AdditionalColumnSubTask = sequelize.define(
  'AdditionalColmnValues_subtask',
  {
    AdditionalColumnID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      allowNull: false
    },
    ColumnName: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    AdditionalColumnTypeID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ColumnTypeLookup,
        key: 'ID'
      }
    },
    CreateBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Signup,
        key: 'UserID'
      }
    },
    CreateDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    },
    ModifiedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ModifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IsDelete: {
      type: DataTypes.INTEGER,
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
    DeletedDate: {
      type: DataTypes.DATE,
      allowNull: true
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
    TaskID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: TaskMaster,
        key: 'TaskID'
      }
    }
  },
  {
    timestamps: false,
    tableName: 'AdditionalColmnValues_subtask'
  }
)

module.exports = AdditionalColumnSubTask

const { DataTypes, default: Sequelize } = require('@sequelize/core')
const { sequelize } = require('../db-connection')
const Project = require('./project')
const Signup = require('./signup')
const TaskGroups = require('./task-group') // Make sure this path is correct
const Workspace = require('./workspace')
const ColumnTypeLookup = require('./column-type-lookup')

const AdditionalColumnValuesTask = sequelize.define(
  'AdditionalColmnValues_task',
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
    ModifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ModifiedDate: {
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
    }
  },
  {
    timestamps: false,
    tableName: 'AdditionalColmnValues_task'
  }
)

module.exports = AdditionalColumnValuesTask

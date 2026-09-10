const { DataTypes } = require('@sequelize/core')
const { sequelize } = require('../db-connection')
const Project = require('./project')
const TaskGroups = require('./task-group') // Make sure this path is correct
const Workspace = require('./workspace')
const TaskMaster = require('./task-master')

const DynamicDropdown = sequelize.define(
  'DynamicDropdownList',
  {
    Dynamic_ddl_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      allowNull: false
    },
    Valuetxt: {
      type: DataTypes.STRING(200),
      allowNull: true
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
    }
  },
  {
    timestamps: false,
    tableName: 'DynamicDropdownList'
  }
)

module.exports = DynamicDropdown

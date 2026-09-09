const { DataTypes, default: Sequelize } = require('@sequelize/core')
const { sequelize } = require('../db-connection')
const Signup = require('./signup')
const TaskGroups = require('./task-group')

const ProjectStatus = sequelize.define(
  'ProjectStatus',
  {
    StatusID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true
    },
    Statusname: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    CreateDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    },
    CreatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Signup,
        key: 'UserID'
      }
    },
    Colorcode: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    IsDelete: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IsDefault: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TaskgroupID: {
      type: DataTypes.INTEGER,
      references: {
        model: TaskGroups,
        key: 'TaskGroupID'
      }
    }
  },
  {
    timestamps: false,
    tableName: 'ProjectStatus'
  }
)

module.exports = ProjectStatus

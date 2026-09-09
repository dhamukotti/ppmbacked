const { DataTypes, default: Sequelize } = require('@sequelize/core')
const { sequelize } = require('../../db-connection')
const Signup = require('../signup')
const SprintWorkspace = require('./sprint-workspace')

const BugPriority = sequelize.define(
  'BugPriority',
  {
    PriorityID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true
    },
    PriorityName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Colorcode: {
      type: DataTypes.STRING(50),
      allowNull: true
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
    IsDelete: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IsDefault: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    WorkSpaceID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: SprintWorkspace,
        key: 'WorkspaceID'
      }
    }
  },
  {
    timestamps: false,
    tableName: 'BugPriority'
  }
)

module.exports = BugPriority

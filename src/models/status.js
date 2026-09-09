const { DataTypes, default: Sequelize } = require('@sequelize/core')
const { sequelize } = require('../db-connection')
const Signup = require('./signup')
const SprintManagement = require('./sprint-management/sprints')

const BugQueueStatus = sequelize.define(
  'BugQueueStatus',
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
    SprintID: {
      type: DataTypes.INTEGER,
      references: {
        model: SprintManagement,
        key: 'SprintID'
      }
    }
  },
  {
    timestamps: false,
    tableName: 'BugQueueStatus'
  }
)

module.exports = BugQueueStatus

const { DataTypes } = require('@sequelize/core')
const { sequelize } = require('../db-connection')
const TaskMaster = require('./task-master')
const SubTasks = require('./subtask')
const Signup = require('./signup')

const RecentActivity = sequelize.define(
  'RecentActivity',
  {
    RecentActivityID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    TaskMasterID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TaskMaster,
        key: 'TaskID'
      }
    },
    SubTasksID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: SubTasks,
        key: 'SubTaskID'
      }
    },
    AdditionalColumnID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DoneBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Signup,
        key: 'UserID'
      }
    },
    DoneAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    Title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Description: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    ActivityType: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    PreviousState: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    NewState: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    IsCritical: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    tableName: 'RecentActivity',
    timestamps: false
  }
)

module.exports = RecentActivity

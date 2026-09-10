const { DataTypes, default: Sequelize } = require('@sequelize/core')
const { sequelize } = require('../db-connection')
const Signup = require('./signup')
const ProjectStatus = require('./project-status')
const TaskMaster = require('./task-master')

const SubTasks = sequelize.define(
  'SubTasks',
  {
    SubTaskID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true
    },
    TaskMasterID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: TaskMaster,
        key: 'TaskID'
      }
    },
    SubTaskName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    SubtaskOwner: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Signup,
        key: 'UserID'
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

    CreateDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    },
    Createby: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Signup,
        key: 'UserID'
      }
    },
    IsDelete: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    DeletedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Deletedby: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Signup,
        key: 'UserID'
      }
    },
    Effort: {
      type: DataTypes?.STRING(50),
      allowNull: true
    },
    TimelineStartDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    TimelineEndDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    timestamps: false,
    tableName: 'SubTasks'
  }
)

module.exports = SubTasks

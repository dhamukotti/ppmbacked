const { DataTypes, default: Sequelize } = require('@sequelize/core')
const { sequelize } = require('../../db-connection')
const Signup = require('../signup')
const ProjectPriority = require('../project-priority')
const ProjectStatus = require('../project-status')
const SprintManagement = require('./sprints')

const SprintTaskManagement = sequelize.define(
  'SprintTaskManagement',
  {
    SprintTaskID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true
    },
    Taskname: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    TaskDescription: {
      type: DataTypes.STRING(4000),
      allowNull: true
    },
    Taskowner: {
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
    StatusID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ProjectStatus,
        key: 'StatusID'
      }
    },
    PriorityID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ProjectPriority,
        key: 'PriorityID'
      }
    },
    TypeID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    EstimatedSP: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ActualSP: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IsUnplanned: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
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
    SprintID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: SprintManagement,
        key: 'SprintID'
      }
    }
  },
  {
    timestamps: false,
    tableName: 'SprintTaskManagement'
  }
)

module.exports = SprintTaskManagement

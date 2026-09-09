const { DataTypes, default: Sequelize } = require('@sequelize/core')
const { sequelize } = require('../../db-connection')
const Signup = require('../signup')
const SprintManagement = require('./sprints')
const BugPriority = require('./bug-priority')
const BugQueueStatus = require('../status')
const SprintTaskManagement = require('./sprint-tasks')
const SprintWorkspace = require('./sprint-workspace')

const BugQueueManagement = sequelize.define(
  'BugQueueManagement',
  {
    BugID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true
    },
    BugName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    BugDescription: {
      type: DataTypes.STRING(4000),
      allowNull: true
    },
    Reporter: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Signup,
        key: 'UserID'
      }
    },
    TimeResolution: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    TimerStart: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IsDelete: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    StatusID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: BugQueueStatus,
        key: 'StatusID'
      }
    },
    PriorityID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: BugPriority,
        key: 'PriorityID'
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
    Deletedby: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Signup,
        key: 'UserID'
      }
    },
    SprintTaskID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: SprintTaskManagement,
        key: 'SprintTaskID'
      }
    },
    SprintID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: SprintManagement,
        key: 'SprintID'
      }
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
    tableName: 'BugQueueManagement'
  }
)

module.exports = BugQueueManagement

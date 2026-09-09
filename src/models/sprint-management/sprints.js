const { DataTypes, default: Sequelize } = require('@sequelize/core')
const { sequelize } = require('../../db-connection')
const Signup = require('../signup')
const SprintWorkspace = require('./sprint-workspace')
const SprintGroups = require('./sprint-group')

const SprintManagement = sequelize.define(
  'SprintManagement',
  {
    SprintID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    Name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    WorkSpaceID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: SprintWorkspace,
        key: 'WorkspaceID'
      }
    },
    SprintGroupID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: SprintGroups,
        key: 'SprintGroupID'
      }
    },
    Goals: {
      type: DataTypes.STRING(500),
      allowNull: true
    },

    SprintStatus: {
      type: DataTypes.ENUM('Not Started', 'Active', 'Paused', 'Completed'),
      defaultValue: 'Not Started',
      allowNull: false
    },

    SprintTimelineStart: {
      type: DataTypes.DATE,
      allowNull: true
    },

    SprintTimelineEnd: {
      type: DataTypes.DATE,
      allowNull: true
    },

    IsDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
    UpdatedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    UpdateBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Signup,
        key: 'UserID'
      }
    },

    SprintTimeElapsedInSeconds: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: 'SprintManagement'
  }
)

module.exports = SprintManagement

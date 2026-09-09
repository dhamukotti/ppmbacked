const { DataTypes, default: Sequelize } = require('@sequelize/core')
const { sequelize } = require('../db-connection')
const TaskGroups = require('./task-group')
const Signup = require('./signup')
const ProjectPriority = require('./project-priority')
const ProjectStatus = require('./project-status')
const Project = require('./project')
const Workspace = require('./workspace')

const TaskMaster = sequelize.define(
  'TaskMaster',
  {
    TaskID: {
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
    TimelineStartDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    TimelineEndDate: {
      type: DataTypes.DATE,
      allowNull: true
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
    TaskGroupID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: TaskGroups,
        key: 'TaskGroupID'
      }
    },
    ProjectID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Project,
        key: 'ID'
      }
    },
    WorkspaceID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Workspace,
        key: 'WorkspaceID'
      }
    }
  },
  {
    timestamps: false,
    tableName: 'TaskMaster'
  }
)

module.exports = TaskMaster

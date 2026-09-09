const { DataTypes, default: Sequelize } = require('@sequelize/core')
const { sequelize } = require('../db-connection')
const Signup = require('./signup')
const Roles = require('./role')
const Workspace = require('./workspace')
const Project = require('./project')

const UserProjects = sequelize.define(
  'UserProjects',
  {
    UserProjectID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      allowNull: false
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Signup,
        key: 'UserID'
      }
    },
    WorkspaceID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Workspace,
        key: 'WorkspaceID'
      }
    },
    ProjectID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Project,
        key: 'ID'
      }
    },
    RoleID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Roles,
        key: 'RoleID'
      }
    },
    JoinDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    AddedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Signup,
        key: 'UserID'
      }
    },
    UpdatedBy: {
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
    }
  },
  {
    timestamps: false,
    tableName: 'UserProjects'
  }
)

module.exports = UserProjects

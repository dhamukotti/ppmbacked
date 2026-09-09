const { DataTypes } = require('@sequelize/core')
const { sequelize } = require('../db-connection')
const Signup = require('./signup')
const Roles = require('./roles')
const Workspace = require('./workspace')
const Project = require('./project')

const InviteMgt = sequelize.define(
  'InviteMgt',
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      allowNull: false
    },
    InvitedEmailaddress: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    InvitedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    InvitedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Signup,
        key: 'UserID'
      }
    },
    InviteAcceptedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    RoleID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Roles,
        key: 'RoleID'
      }
    },
    Status: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'Pending'
    },
    WorkspaceID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Workspace,
        key: 'WorkspaceID'
      }
    },
    ProjectID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Project,
        key: 'ID'
      }
    }
  },
  {
    timestamps: false,
    tableName: 'InviteMgt'
  }
)

module.exports = InviteMgt

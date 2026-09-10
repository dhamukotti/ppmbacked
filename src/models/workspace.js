const { DataTypes } = require('@sequelize/core')
const { sequelize } = require('../db-connection')
const Signup = require('./signup')
const Organization = require('./organization')

const Workspace = sequelize.define(
  'Workspace',
  {
    WorkspaceID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      allowNull: false
    },
    WorkspaceName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    OrganizationID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Organization,
        key: 'OrganizationID'
      }
    },
    CreateDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW // Set default to current timestamp
    },
    CreatedBy: {
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
    IsDelete: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    UpdatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    timestamps: false,
    tableName: 'Workspace'
  }
)

module.exports = Workspace

const { DataTypes, default: Sequelize } = require('@sequelize/core')
const { sequelize } = require('../db-connection')
const Signup = require('./signup')
const Organization = require('./organization')
const Roles = require('./role')

const UserOrganization = sequelize.define(
  'UserOrganization',
  {
    ID: {
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
    OrganizationID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Organization,
        key: 'OrganizationID'
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
    }
  },
  {
    timestamps: false,
    tableName: 'UserOrganization'
  }
)

module.exports = UserOrganization

const { DataTypes } = require('@sequelize/core')
const { sequelize } = require('../db-connection')
const Project = require('./project')
const Signup = require('./signup')

const AutomationRules = sequelize.define(
  'AutomationRules',
  {
    RuleID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      allowNull: false
    },
    ProjectID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Project,
        key: 'ID'
      },
      onDelete: 'CASCADE' // Matches the DB constraint
    },
    trigger: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    conditions: {
      type: DataTypes.JSON,
      allowNull: false
    },
    CreatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    CreatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true, // Allow NULL to match the DB structure
      references: {
        model: Signup,
        key: 'UserID'
      },
      onDelete: 'NO ACTION' // Matches the DB constraint
    },
    UpdatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    UpdatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true, // Allow NULL to match the DB structure
      references: {
        model: Signup,
        key: 'UserID'
      },
      onDelete: 'NO ACTION' // Matches the DB constraint
    }
  },
  {
    tableName: 'AutomationRules',
    timestamps: false
  }
)

module.exports = AutomationRules

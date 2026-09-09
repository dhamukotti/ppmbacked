const { DataTypes, default: Sequelize } = require('@sequelize/core')
const { sequelize } = require('../db-connection')
const Country = require('./country')

const Organization = sequelize.define(
  'Organization',
  {
    OrganizationID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true
    },
    OrganizationName: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    CreateDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    },
    CountryID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Country,
        key: 'ID'
      }
    }
  },
  {
    timestamps: false,
    tableName: 'Organization'
  }
)

module.exports = Organization

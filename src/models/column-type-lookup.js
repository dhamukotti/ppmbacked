const { DataTypes } = require('@sequelize/core')
const { sequelize } = require('../db-connection')

const ColumnTypeLookup = sequelize.define(
  'AdditionalColumnTypeLookup',
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      allowNull: false
    },
    Title: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Keyname: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    IsDelete: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    timestamps: false,
    tableName: 'AdditionalColumnTypeLookup'
  }
)

module.exports = ColumnTypeLookup

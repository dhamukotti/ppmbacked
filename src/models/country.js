const { DataTypes } = require('@sequelize/core')
const { sequelize } = require('../db-connection')

const Country = sequelize.define(
  'Country',
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      allowNull: false
    },
    Name: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    Code: {
      type: DataTypes.STRING(6),
      allowNull: true
    },
    CreateDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    timestamps: false,
    tableName: 'Country'
  }
)

module.exports = Country

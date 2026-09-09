const { DataTypes } = require('@sequelize/core')
const { sequelize } = require('../db-connection')

const Login = sequelize.define(
  'Login',
  {
    UserID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    IsLoginSuccess: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    LoginErrcnt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    LastLogindatetime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    CurrentLatitude: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    CurrentLongitude: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  },
  {
    timestamps: false,
    tableName: 'Login'
  }
)

module.exports = Login

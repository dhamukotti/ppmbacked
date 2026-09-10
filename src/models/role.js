const { DataTypes } = require('@sequelize/core')
const { sequelize } = require('../db-connection')

const Roles = sequelize.define(
  'Roles',
  {
    RoleID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      allowNull: false
    },
    RoleName: {
      type: DataTypes.STRING(10),
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: 'Roles'
  }
)

module.exports = Roles

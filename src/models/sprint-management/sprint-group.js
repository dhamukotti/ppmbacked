const { DataTypes } = require('@sequelize/core')
const { sequelize } = require('../../db-connection')
// Assuming you already have a Workspaces model if you plan to reference it
const Workspaces = require('./sprint-workspace')

const SprintGroups = sequelize.define(
  'SprintGroups',
  {
    SprintGroupID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    GroupName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    WorkspaceID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Workspaces,
        key: 'WorkspaceID'
      }
    }
  },
  {
    timestamps: false,
    tableName: 'SprintGroups'
  }
)

module.exports = SprintGroups

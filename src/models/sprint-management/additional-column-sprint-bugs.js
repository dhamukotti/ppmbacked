const { DataTypes, default: Sequelize } = require('@sequelize/core')
const { sequelize } = require('../../db-connection')
const Signup = require('../signup')
const Workspace = require('./sprint-workspace')
const ColumnTypeLookup = require('../column-type-lookup')

const AdditionalColumnValuesBugs = sequelize.define(
  'AdditionalColmnValues_bugs',
  {
    AdditionalColumnID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      allowNull: false
    },
    ColumnName: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    AdditionalColumnTypeID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ColumnTypeLookup,
        key: 'ID'
      }
    },
    CreateDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    },
    CreateBy: {
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
    DeletedBy: {
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
    ModifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ModifiedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    WorkspaceID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Workspace,
        key: 'WorkspaceID'
      }
    }
  },
  {
    timestamps: false,
    tableName: 'AdditionalColmnValues_bugs'
  }
)

module.exports = AdditionalColumnValuesBugs

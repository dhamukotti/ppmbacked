const { DataTypes, default: Sequelize } = require('@sequelize/core')
const { sequelize } = require('../db-connection')

const Signup = require('./signup')
const TaskMaster = require('./task-master')

const TaskUpdates = sequelize.define(
  'TaskUpdates',
  {
    UpdateID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true
    },
    TaskID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: TaskMaster,
        key: 'TaskID'
      }
    },
    ParentUpdateID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'TaskUpdates', // Self-referential key
        key: 'UpdateID'
      }
    },
    Message: {
      type: DataTypes.STRING(4000),
      allowNull: false
    },
    IsDelete: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    CreatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    },
    CreatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Signup,
        key: 'UserID'
      }
    }
  },
  {
    timestamps: false,
    tableName: 'TaskUpdates'
  }
)

// Define associations
TaskUpdates.belongsTo(TaskMaster, {
  foreignKey: 'TaskID'
})

TaskUpdates.belongsTo(Signup, {
  foreignKey: 'CreatedBy',
  as: 'createdBy'
})

module.exports = TaskUpdates

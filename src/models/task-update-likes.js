const { DataTypes } = require('@sequelize/core')
const Signup = require('./signup')
const TaskUpdates = require('./task-updates')
const { sequelize } = require('../db-connection')

const TaskUpdateLikes = sequelize.define(
  'TaskUpdateLikes',
  {
    LikeID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    UpdateID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TaskUpdates,
        key: 'UpdateID'
      }
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Signup,
        key: 'UserID'
      }
    }
  },
  {
    timestamps: false,
    tableName: 'TaskUpdateLikes'
  }
)

// Associations
TaskUpdateLikes.belongsTo(TaskUpdates, { foreignKey: 'UpdateID' })
TaskUpdates.hasMany(TaskUpdateLikes, { foreignKey: 'UpdateID' })

TaskUpdateLikes.belongsTo(Signup, { foreignKey: 'UserID' })
Signup.hasMany(TaskUpdateLikes, { foreignKey: 'UserID' })

module.exports = TaskUpdateLikes

const { DataTypes, default: Sequelize } = require('@sequelize/core')
const { sequelize } = require('../db-connection')
const Signup = require('./signup')
const Workspace = require('./workspace')

const Project = sequelize.define(
  'Project',
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true
    },
    ProjectName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    WorkSpaceID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Workspace,
        key: 'WorkspaceID'
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
    UpdatedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    UpdateBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IsOpen: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: 'Project'
  }
)

Project.belongsTo(Workspace, { foreignKey: 'WorkSpaceID', as: 'workspace' })

Workspace.hasMany(Project, { foreignKey: 'WorkSpaceID' })

module.exports = Project

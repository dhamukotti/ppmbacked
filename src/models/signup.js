const { DataTypes, default: Sequelize } = require('@sequelize/core')
const { sequelize } = require('../db-connection')
const Organization = require('./organization')
const Country = require('./country')

const Signup = sequelize.define(
  'Signup',
  {
    UserID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    Name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Email: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Pwd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Accountsource: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    CreateDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    CountryID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Country,
        key: 'ID'
      }
    },
    Latitude: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Longtitude: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    UpdatedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    UpdateBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    OrganizationName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    OrganizationSize: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    OrganizationID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Organization,
        key: 'OrganizationID'
      }
    },
    IsDelete: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ProfilePicture: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    ResetOTP: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    OtpExpireAt: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  },
  {
    timestamps: false,
    tableName: 'Signup'
  }
)

Signup.belongsTo(Country, { foreignKey: 'CountryID' })

module.exports = Signup

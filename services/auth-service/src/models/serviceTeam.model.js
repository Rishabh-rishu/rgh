import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ServiceTeam = sequelize.define(
  "ServiceTeam",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    propertyId: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    serviceIds: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    serviceMemberId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    firstNameEnglish: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    firstNameArabic: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    lastNameEnglish: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    lastNameArabic: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    countryCode: {
      type: DataTypes.STRING,
      defaultValue: "+974",
    },

    contactNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Auth
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    accessToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    otp: {
      type: DataTypes.STRING(6),
      allowNull: true,
    },

    otpExpiryTime: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },

    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "service_teams",
    timestamps: true,
  }
);

export default ServiceTeam;
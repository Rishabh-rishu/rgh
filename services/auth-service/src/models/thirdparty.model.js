import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ThirdParty = sequelize.define(
  "ThirdParty",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    // Owner Details
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    firstNameArabic: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    lastNameArabic: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },

    countryCode: {
      type: DataTypes.STRING,
      defaultValue: "+974",
    },

    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    fullAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    ownerImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    idProof: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    businessIdImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    businessImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // 3rd Party Details

    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    serviceName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    experience: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    descriptionEnglish: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    descriptionArabic: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    // Auth Fields (Don't Remove)

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
    tableName: "third_parties",
    timestamps: true,
  }
);

export default ThirdParty;
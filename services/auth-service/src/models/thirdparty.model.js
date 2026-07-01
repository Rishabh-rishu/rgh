import { DataTypes, Op } from "sequelize";
import sequelize from "../config/database.js";
 
const ThirdParty = sequelize.define(
  "ThirdParty",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
 
    thirdPartyId: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false,
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
 
    firstNameArabic: DataTypes.STRING,
 
    lastNameArabic: DataTypes.STRING,
 
    email: {
      type: DataTypes.STRING,
      allowNull: false,
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
 
    fullAddress: DataTypes.TEXT,
 
    location: DataTypes.STRING,
 
    ownerImage: DataTypes.STRING,
 
    idProof: DataTypes.STRING,
 
    businessIdImage: DataTypes.STRING,
 
    businessImage: DataTypes.STRING,
 
    category: {
      type: DataTypes.ENUM(
        "Salon",
        "Gym",
        "Swimming",
        "Movie",
        "Badminton"
      ),
      allowNull: false,
    },
 
    serviceName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
 
    experience: DataTypes.DATEONLY,
 
    address: DataTypes.TEXT,
 
    descriptionEnglish: DataTypes.TEXT,
 
    descriptionArabic: DataTypes.TEXT,
 
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
 
    serviceList: {
      type: DataTypes.STRING,
      defaultValue: "N/A",
    },
 
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
 
    accessToken: DataTypes.TEXT,
 
    otp: DataTypes.STRING(6),
 
    otpExpiryTime: DataTypes.BIGINT,
 
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
 
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
 
    createdBy: DataTypes.UUID,
 
    updatedBy: DataTypes.UUID,
  },
  {
    tableName: "third_parties",
    timestamps: true,
    underscored: true,
  }
);
 
 
export default ThirdParty;
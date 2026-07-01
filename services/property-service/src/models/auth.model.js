import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "first_name",
    },

    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "last_name",
    },

    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },

      countryCode: {
      type: DataTypes.STRING(5), // e.g. +1, +91, +44
      allowNull: true,
      field: "country_code",
    },

    phone:{

      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },

    passwordHash: {
      type: DataTypes.STRING,
      field: "password_hash",
    },

    role: {
      type: DataTypes.ENUM(
        "admin",
        "tenant",
        "security_guard"
      ),
      defaultValue: "tenant",
    },

    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_verified",
    },

     dob: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "dob",
    },

    // Profile Image URL
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "image_url",
    },

    isBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_blocked",
    },

    nationality: {
  type: DataTypes.STRING,
  allowNull: true,
  field: "nationality",
},

    accessToken: {
      type: DataTypes.TEXT,
      field: "access_token",
    },
  },
  {
    tableName: "users",
    underscored: true,
  }
);

export default User;

 
   
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ServiceProvider = sequelize.define(
  "ServiceProvider",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    propertyId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "property_id",
    },

    helpCategoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "help_category_id",
    },

    serviceId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "service_id",
    },

    serviceMemberId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "service_member_id",
    },

    firstNameEnglish: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "first_name_english",
    },

    firstNameArabic: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "first_name_arabic",
    },

    lastNameEnglish: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "last_name_english",
    },

    lastNameArabic: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "last_name_arabic",
    },

    contactNo: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "contact_no",
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    experience: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    designation: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    joiningDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "joining_date",
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "service_providers",
    timestamps: true,
    underscored: true,
  }
);

export default ServiceProvider;
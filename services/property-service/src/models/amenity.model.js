import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Amenity = sequelize.define(
  "Amenity",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    amenityNameEn: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "amenity_name_en",
    },

    amenityNameAr: {
      type: DataTypes.STRING,
      field: "amenity_name_ar",
    },

    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    location: {
      type: DataTypes.STRING,
    },

    address: {
      type: DataTypes.STRING,
    },

    contactNo: {
      type: DataTypes.STRING,
      field: "contact_no",
    },

    descriptionEn: {
      type: DataTypes.TEXT,
      field: "description_en",
    },

    descriptionAr: {
      type: DataTypes.TEXT,
      field: "description_ar",
    },

    termsConditionEn: {
      type: DataTypes.TEXT,
      field: "terms_condition_en",
    },

    termsConditionAr: {
      type: DataTypes.TEXT,
      field: "terms_condition_ar",
    },

    availabilityDays: {
      type: DataTypes.JSON,
      defaultValue: [],
      field: "availability_days",
    },

    durationFrom: {
      type: DataTypes.TIME,
      field: "duration_from",
    },

    durationTo: {
      type: DataTypes.TIME,
      field: "duration_to",
    },

    facilities: {
      type: DataTypes.JSON,
      defaultValue: [],
    },

    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_deleted",
    },
  },
  {
    tableName: "amenities",
    timestamps: true,
    underscored: true,
  }
);

export default Amenity;
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Property = sequelize.define(
  "Property",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    propertyType: {
      type: DataTypes.ENUM("Flat", "Villa"),
      allowNull: false,
      field: "property_type",
    },

    propertyName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "property_name",
    },

    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    propertyCategory: {
      type: DataTypes.ENUM("Residential", "Commercial"),
      allowNull: false,
      field: "property_category",
    },

    propertyFor: {
      type: DataTypes.ENUM("Rent", "Sale"),
      allowNull: false,
      field: "property_for",
    },

    squareFeet: {
      type: DataTypes.INTEGER,
      field: "square_feet",
    },

    images: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    file360: {
      type: DataTypes.STRING,
      field: "file_360",
    },

    descriptionEn: {
      type: DataTypes.TEXT,
      field: "description_en",
    },

    descriptionAr: {
      type: DataTypes.TEXT,
      field: "description_ar",
    },

    nearbyAttractions: {
      type: DataTypes.JSON,
      allowNull: true,
      field: "nearby_attractions",
    },

    agentName: {
      type: DataTypes.STRING,
      field: "agent_name",
    },

    agentEmail: {
      type: DataTypes.STRING,
      field: "agent_email",
    },

    agentPhone: {
      type: DataTypes.STRING,
      field: "agent_phone",
    },

    agentPhoto: {
      type: DataTypes.STRING,
      field: "agent_photo",
    },

    amenities: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_deleted",
    },
  },
  {
    tableName: "properties",
    timestamps: true,
    underscored: true,
  }
);

export default Property;
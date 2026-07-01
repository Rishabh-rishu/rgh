import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PropertyAmenity = sequelize.define(
  "PropertyAmenity",
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

    amenityId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "amenity_id",
    },
  },
  {
    tableName: "property_amenities",
    timestamps: true,
    underscored: true,
  }
);

export default PropertyAmenity;
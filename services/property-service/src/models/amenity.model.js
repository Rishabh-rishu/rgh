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

    amenityNameEn: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    amenityNameAr: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    icon: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active",
    },

    createdBy: {
      type: DataTypes.UUID,
    },

    updatedBy: {
      type: DataTypes.UUID,
    },
  },
  {
    tableName: "amenities",
    timestamps: true,
    underscored: true,
  }
);

export default Amenity;
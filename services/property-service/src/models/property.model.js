import { DataTypes, Op } from "sequelize";
import sequelize from "../config/database.js";

const Property = sequelize.define(
  "Property",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    propertyCode: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
    },

    listingStatus: {
      type: DataTypes.ENUM("Rent", "Sale"),
      allowNull: false,
    },

    propertyType: {
      type: DataTypes.ENUM(
        "Apartment",
        "Villa",
        "House",
        "Office",
        "Shop",
        "Warehouse",
        "Land"
      ),
      allowNull: false,
    },

    propertyCategory: {
      type: DataTypes.STRING(100),
    },

    rentPrice: {
      type: DataTypes.DECIMAL(12, 2),
    },

    salePrice: {
      type: DataTypes.DECIMAL(12, 2),
    },

    bedrooms: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    bathrooms: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    squareFeet: {
      type: DataTypes.INTEGER,
    },

    furnishingStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    parking: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    yearBuilt: {
      type: DataTypes.INTEGER,
    },

    projectId: {
      type: DataTypes.UUID,
    },

    assignedAgentId: {
      type: DataTypes.UUID,
    },

    fullAddress: {
      type: DataTypes.TEXT,
    },

    city: {
      type: DataTypes.STRING,
    },

    state: {
      type: DataTypes.STRING,
    },

    country: {
      type: DataTypes.STRING,
    },

    zipcode: {
      type: DataTypes.STRING,
    },

    latitude: {
      type: DataTypes.DECIMAL(10, 8),
    },

    longitude: {
      type: DataTypes.DECIMAL(11, 8),
    },

    virtualTour: {
      type: DataTypes.STRING,
    },

    gallery: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },

    amenities: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      defaultValue: [],
    },

    nearbyPlaces: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },

    status: {
      type: DataTypes.ENUM("Active", "InActive"),
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
    tableName: "properties",
    underscored: true,
    timestamps: true,
  }
);


Property.beforeValidate(async (property) => {
  // Skip if propertyCode is already set
  if (property.propertyCode) return;

  const lastProperty = await Property.findOne({
    attributes: ["propertyCode"],
    where: {
      propertyCode: {
        [Op.ne]: null,
      },
    },
    order: [["createdAt", "DESC"]],
  });

  if (!lastProperty) {
    property.propertyCode = "ALS001";
    return;
  }

  const lastNumber = parseInt(
    lastProperty.propertyCode.replace("ALS", ""),
    10
  );

  const nextNumber = isNaN(lastNumber) ? 1 : lastNumber + 1;

  property.propertyCode = `ALS${String(nextNumber).padStart(3, "0")}`;
});


export default Property;

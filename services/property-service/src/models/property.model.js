// import { DataTypes } from "sequelize";
// import sequelize from "../config/database.js";
// import Amenity from "./amenity.model.js";
// import PropertyAmenity from "./propertyAmenity.model.js";
// const Property = sequelize.define(
//   "Property",
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },

//     title: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },

//     listingStatus: {
//       type: DataTypes.ENUM("rent", "sale"),
//       allowNull: false,
//       field: "listing_status",
//     },

//     projectId: {
//       type: DataTypes.UUID,
//       allowNull: true,
//       field: "project_id",
//     },

//     rentPrice: {
//       type: DataTypes.DECIMAL(12, 2),
//       allowNull: true,
//       field: "rent_price",
//     },

//     bed: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },

//     bathroom: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },

//     squareFeet: {
//       type: DataTypes.FLOAT,
//       allowNull: true,
//       field: "square_feet",
//     },

//     propertyType: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       field: "property_type",
//     },

//     propertyCategory: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       field: "property_category",
//     },

//     fullAddress: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//       field: "full_address",
//     },

//     location: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },

//     parking: {
//       type: DataTypes.ENUM(
//         "none",
//         "1_car",
//         "2_car",
//         "3_car",
//         "covered",
//         "open"
//       ),
//       allowNull: true,
//     },

//     furnishingStatus: {
//       type: DataTypes.ENUM(
//         "furnished",
//         "semi_furnished",
//         "unfurnished"
//       ),
//       allowNull: true,
//       field: "furnishing_status",
//     },

//     yearBuild: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       field: "year_build",
//     },

//     locationProximity: {
//       type: DataTypes.STRING,
//       allowNull: true,
//       field: "location_proximity",
//     },

//     propertyReference: {
//       type: DataTypes.STRING,
//       allowNull: true,
//       unique: true,
//       field: "property_reference",
//     },

//     nearbyAttractions: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//       field: "nearby_attractions",
//     },

//     description: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },

//     locationCode: {
//       type: DataTypes.STRING,
//       allowNull: true,
//       field: "location_code",
//     },

//     agentId: {
//       type: DataTypes.UUID,
//       allowNull: true,
//       field: "agent_id",
//     },

//     latitude: {
//       type: DataTypes.DECIMAL(10, 8),
//       allowNull: true,
//     },

//     longitude: {
//       type: DataTypes.DECIMAL(11, 8),
//       allowNull: true,
//     },

//     contentEnglish: {
//       type: DataTypes.TEXT("long"),
//       allowNull: true,
//       field: "content_english",
//     },

//     gallery: {
//       type: DataTypes.JSON,
//       allowNull: true,
//       comment: "Array of image URLs",
//     },

//     status: {
//       type: DataTypes.ENUM("active", "inactive"),
//       defaultValue: "active",
//     },

//     isDeleted: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false,
//       field: "is_deleted",
//     },
//   },
//   {
//     tableName: "properties",
//     timestamps: true,
//     underscored: true,
//   }
// );

// export default Property;



// // Property belongs to Agent
// // Property.belongsTo(Agent, {
// //   foreignKey: "agentId",
// //   as: "agent",
// // });

// // Property belongs to Project
// // Property.belongsTo(Project, {
// //   foreignKey: "projectId",
// //   as: "project",
// // });

// // Property <-> Amenity
// Property.belongsToMany(Amenity, {
//   through: PropertyAmenity,
//   foreignKey: "propertyId",
//   otherKey: "amenityId",
//   as: "amenities",
// });

// // Amenity.belongsToMany(Property, {
// //   through: PropertyAmenity,
// //   foreignKey: "amenityId",
// //   otherKey: "propertyId",
// //   as: "properties",
// // });
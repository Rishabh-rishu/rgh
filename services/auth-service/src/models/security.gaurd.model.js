import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
// import Property from "./property.model.js";

const SecurityGuard = sequelize.define(
  "SecurityGuard",
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
    //   references: {
    //     model: Property,
    //     key: "id",
    //   },
    },

    guardId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "guard_id",
    },

    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "profile_image",
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

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    contactNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "contact_number",
    },

    serviceLocation: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "service_location",
    },

    experience: {
      type: DataTypes.ENUM(
        "0-1 Year",
        "1-3 Years",
        "3-5 Years",
        "5-10 Years",
        "10+ Years"
      ),
      allowNull: false,
    },

    joiningDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "joining_date",
    },

    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
        password: {
  type: DataTypes.STRING,
  allowNull: false,
},

accessToken: {
  type: DataTypes.TEXT,
  allowNull: true,
  field: "access_token",
},
  },
  
  {
    tableName: "security_guards",
    timestamps: true,
  }
);

// Property.hasMany(SecurityGuard, {
//   foreignKey: "propertyId",
// });

// SecurityGuard.belongsTo(Property, {
//   foreignKey: "propertyId",
// });

export default SecurityGuard;
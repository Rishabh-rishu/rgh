import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Tenant = sequelize.define(
  "Tenant",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    firstNameEn: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "first_name_en",
    },

    firstNameAr: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "first_name_ar",
    },

    lastNameEn: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "last_name_en",
    },

    lastNameAr: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "last_name_ar",
    },

    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "phone_number",
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    joiningDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "joining_date",
    },

    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    propertyType: {
      type: DataTypes.ENUM(
        "Apartment",
        "Villa",
        "Studio",
        "Office",
        "Shop"
      ),
      allowNull: false,
      field: "property_type",
    },

    propertyId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "property_id",
    },

    buildingNo: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "building_no",
    },

    unitNo: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "unit_no",
    },

    tenantPlan: {
      type: DataTypes.ENUM(
        "Blue",
        "Diamond",
        "Sapphire"
      ),
      allowNull: false,
      field: "tenant_plan",
    },

    leaseType: {
      type: DataTypes.ENUM(
        "Short Lease",
        "Long Lease"
      ),
      allowNull: false,
      field: "lease_type",
    },

    leaseStartDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "lease_start_date",
    },

    leaseEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "lease_end_date",
    },

    documents: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },

    status: {
      type: DataTypes.ENUM(
        "ACTIVE",
        "INACTIVE"
      ),
      defaultValue: "ACTIVE",
    },

    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_deleted",
    },
  },
  {
    tableName: "tenants",
    timestamps: true,
    underscored: true,
  }
);

export default Tenant;
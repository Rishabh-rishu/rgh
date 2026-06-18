const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const id = {
  type: DataTypes.STRING,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true,
};

const Property = sequelize.define('Property', {
  id,
  propertyNameEnglish: { type: DataTypes.STRING, allowNull: false, field: 'property_name_english' },
  propertyNameArabic: { type: DataTypes.STRING, field: 'property_name_arabic' },
  address: { type: DataTypes.TEXT, allowNull: false },
  latitude: DataTypes.FLOAT,
  longitude: DataTypes.FLOAT,
  totalUnits: { type: DataTypes.INTEGER, allowNull: false, field: 'total_units' },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'active' },
}, {
  tableName: 'properties',
  underscored: true,
});

const Tenant = sequelize.define('Tenant', {
  id,
  firstName: { type: DataTypes.STRING, allowNull: false, field: 'first_name' },
  lastName: { type: DataTypes.STRING, allowNull: false, field: 'last_name' },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: DataTypes.STRING,
  propertyId: { type: DataTypes.STRING, allowNull: false, field: 'property_id' },
  unitNumber: { type: DataTypes.STRING, allowNull: false, field: 'unit_number' },
  leaseStart: { type: DataTypes.DATE, field: 'lease_start' },
  leaseEnd: { type: DataTypes.DATE, field: 'lease_end' },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'active' },
}, {
  tableName: 'tenants',
  underscored: true,
});

const FamilyMember = sequelize.define('FamilyMember', {
  id,
  tenantId: { type: DataTypes.STRING, allowNull: false, field: 'tenant_id' },
  fullName: { type: DataTypes.STRING, allowNull: false, field: 'full_name' },
  relationType: { type: DataTypes.STRING, allowNull: false, field: 'relation_type' },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'active' },
}, {
  tableName: 'family_members',
  underscored: true,
  updatedAt: false,
});

const Category = sequelize.define('Category', {
  id,
  nameEnglish: { type: DataTypes.STRING, allowNull: false, field: 'name_english' },
  nameArabic: { type: DataTypes.STRING, field: 'name_arabic' },
  description: DataTypes.TEXT,
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'active' },
}, {
  tableName: 'categories',
  underscored: true,
});

const Amenity = sequelize.define('Amenity', {
  id,
  categoryId: { type: DataTypes.STRING, allowNull: false, field: 'category_id' },
  nameEnglish: { type: DataTypes.STRING, allowNull: false, field: 'name_english' },
  nameArabic: { type: DataTypes.STRING, field: 'name_arabic' },
  capacity: DataTypes.INTEGER,
  isBookable: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_bookable' },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'active' },
}, {
  tableName: 'amenities',
  underscored: true,
});

const PropertyAmenity = sequelize.define('PropertyAmenity', {
  id,
  propertyId: { type: DataTypes.STRING, allowNull: false, field: 'property_id' },
  amenityId: { type: DataTypes.STRING, allowNull: false, field: 'amenity_id' },
}, {
  tableName: 'property_amenities',
  timestamps: false,
  underscored: true,
  indexes: [{ unique: true, fields: ['property_id', 'amenity_id'] }],
});

Property.hasMany(Tenant, { as: 'tenants', foreignKey: 'propertyId' });
Tenant.belongsTo(Property, { as: 'property', foreignKey: 'propertyId' });
Tenant.hasMany(FamilyMember, { as: 'familyMembers', foreignKey: 'tenantId', onDelete: 'CASCADE' });
FamilyMember.belongsTo(Tenant, { as: 'tenant', foreignKey: 'tenantId' });
Category.hasMany(Amenity, { as: 'amenities', foreignKey: 'categoryId' });
Amenity.belongsTo(Category, { as: 'category', foreignKey: 'categoryId' });
Property.hasMany(PropertyAmenity, { as: 'propertyAmenities', foreignKey: 'propertyId', onDelete: 'CASCADE' });
PropertyAmenity.belongsTo(Property, { as: 'property', foreignKey: 'propertyId' });
Amenity.hasMany(PropertyAmenity, { as: 'propertyAmenities', foreignKey: 'amenityId', onDelete: 'CASCADE' });
PropertyAmenity.belongsTo(Amenity, { as: 'amenity', foreignKey: 'amenityId' });

module.exports = {
  sequelize,
  Property,
  Tenant,
  FamilyMember,
  Category,
  Amenity,
  PropertyAmenity,
};

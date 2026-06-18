const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const id = {
  type: DataTypes.STRING,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true,
};

const Guard = sequelize.define('Guard', {
  id,
  firstName: { type: DataTypes.STRING, allowNull: false, field: 'first_name' },
  lastName: { type: DataTypes.STRING, allowNull: false, field: 'last_name' },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: DataTypes.STRING,
  propertyId: { type: DataTypes.STRING, field: 'property_id' },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'active' },
}, {
  tableName: 'guards',
  underscored: true,
});

const Provider = sequelize.define('Provider', {
  id,
  companyName: { type: DataTypes.STRING, allowNull: false, field: 'company_name' },
  contactName: { type: DataTypes.STRING, allowNull: false, field: 'contact_name' },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: DataTypes.STRING,
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'active' },
}, {
  tableName: 'providers',
  underscored: true,
});

const ThirdParty = sequelize.define('ThirdParty', {
  id,
  name: { type: DataTypes.STRING, allowNull: false },
  contactName: { type: DataTypes.STRING, allowNull: false, field: 'contact_name' },
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'active' },
}, {
  tableName: 'third_parties',
  underscored: true,
});

const ServiceRequest = sequelize.define('ServiceRequest', {
  id,
  tenantId: { type: DataTypes.STRING, allowNull: false, field: 'tenant_id' },
  propertyId: { type: DataTypes.STRING, allowNull: false, field: 'property_id' },
  category: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' },
  assignedTo: { type: DataTypes.STRING, field: 'assigned_to' },
}, {
  tableName: 'service_requests',
  underscored: true,
});

const ProviderSlot = sequelize.define('ProviderSlot', {
  id,
  providerId: { type: DataTypes.STRING, allowNull: false, field: 'provider_id' },
  dayOfWeek: { type: DataTypes.INTEGER, allowNull: false, field: 'day_of_week' },
  startTime: { type: DataTypes.STRING, allowNull: false, field: 'start_time' },
  endTime: { type: DataTypes.STRING, allowNull: false, field: 'end_time' },
  isAvailable: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_available' },
}, {
  tableName: 'provider_slots',
  underscored: true,
  updatedAt: false,
});

const Job = sequelize.define('Job', {
  id,
  providerId: { type: DataTypes.STRING, allowNull: false, field: 'provider_id' },
  requestId: { type: DataTypes.STRING, field: 'request_id' },
  title: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' },
  scheduledAt: { type: DataTypes.DATE, field: 'scheduled_at' },
}, {
  tableName: 'jobs',
  underscored: true,
});

const Incident = sequelize.define('Incident', {
  id,
  guardId: { type: DataTypes.STRING, allowNull: false, field: 'guard_id' },
  propertyId: { type: DataTypes.STRING, allowNull: false, field: 'property_id' },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  severity: { type: DataTypes.STRING, allowNull: false, defaultValue: 'low' },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'open' },
}, {
  tableName: 'incidents',
  underscored: true,
});

Guard.hasMany(Incident, { as: 'incidents', foreignKey: 'guardId' });
Incident.belongsTo(Guard, { as: 'guard', foreignKey: 'guardId' });
Provider.hasMany(ProviderSlot, { as: 'slots', foreignKey: 'providerId', onDelete: 'CASCADE' });
ProviderSlot.belongsTo(Provider, { as: 'provider', foreignKey: 'providerId' });
Provider.hasMany(Job, { as: 'jobs', foreignKey: 'providerId' });
Job.belongsTo(Provider, { as: 'provider', foreignKey: 'providerId' });

module.exports = {
  sequelize,
  Guard,
  Provider,
  ThirdParty,
  ServiceRequest,
  ProviderSlot,
  Job,
  Incident,
};

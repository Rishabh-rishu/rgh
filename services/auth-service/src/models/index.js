const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const id = {
  type: DataTypes.STRING,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true,
};

const Role = sequelize.define('Role', {
  id,
  roleName: { type: DataTypes.STRING, allowNull: false, unique: true, field: 'role_name' },
  description: DataTypes.TEXT,
}, {
  tableName: 'roles',
  timestamps: false,
  underscored: true,
});

const Permission = sequelize.define('Permission', {
  id,
  permissionName: { type: DataTypes.STRING, allowNull: false, unique: true, field: 'permission_name' },
  module: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'permissions',
  timestamps: false,
  underscored: true,
});

const RolePermission = sequelize.define('RolePermission', {
  roleId: { type: DataTypes.STRING, primaryKey: true, field: 'role_id' },
  permissionId: { type: DataTypes.STRING, primaryKey: true, field: 'permission_id' },
}, {
  tableName: 'role_permissions',
  timestamps: false,
  underscored: true,
});

const User = sequelize.define('User', {
  id,
  firstName: { type: DataTypes.STRING, allowNull: false, field: 'first_name' },
  lastName: { type: DataTypes.STRING, allowNull: false, field: 'last_name' },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: DataTypes.STRING,
  passwordHash: { type: DataTypes.STRING, allowNull: false, field: 'password_hash' },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'active' },
  preferredLanguage: { type: DataTypes.STRING, allowNull: false, defaultValue: 'en', field: 'preferred_language' },
  roleId: { type: DataTypes.STRING, allowNull: false, field: 'role_id' },
}, {
  tableName: 'users',
  underscored: true,
});

const OtpVerification = sequelize.define('OtpVerification', {
  id,
  identifier: { type: DataTypes.STRING, allowNull: false },
  otpCode: { type: DataTypes.STRING, allowNull: false, field: 'otp_code' },
  purpose: { type: DataTypes.STRING, allowNull: false },
  expiresAt: { type: DataTypes.DATE, allowNull: false, field: 'expires_at' },
}, {
  tableName: 'otp_verifications',
  underscored: true,
  updatedAt: false,
});

const RefreshToken = sequelize.define('RefreshToken', {
  id,
  userId: { type: DataTypes.STRING, allowNull: false, field: 'user_id' },
  refreshToken: { type: DataTypes.STRING, allowNull: false, unique: true, field: 'refresh_token' },
  expiresAt: { type: DataTypes.DATE, allowNull: false, field: 'expires_at' },
}, {
  tableName: 'refresh_tokens',
  underscored: true,
  updatedAt: false,
});

Role.hasMany(User, { as: 'users', foreignKey: 'roleId' });
User.belongsTo(Role, { as: 'role', foreignKey: 'roleId' });
User.hasMany(RefreshToken, { as: 'refreshTokens', foreignKey: 'userId', onDelete: 'CASCADE' });
RefreshToken.belongsTo(User, { as: 'user', foreignKey: 'userId' });
Role.belongsToMany(Permission, {
  as: 'permissions',
  through: RolePermission,
  foreignKey: 'roleId',
  otherKey: 'permissionId',
});
Permission.belongsToMany(Role, {
  as: 'roles',
  through: RolePermission,
  foreignKey: 'permissionId',
  otherKey: 'roleId',
});

module.exports = {
  sequelize,
  User,
  Role,
  Permission,
  RolePermission,
  OtpVerification,
  RefreshToken,
};

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const id = {
  type: DataTypes.STRING,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true,
};

const Booking = sequelize.define('Booking', {
  id,
  tenantId: { type: DataTypes.STRING, allowNull: false, field: 'tenant_id' },
  amenityId: { type: DataTypes.STRING, allowNull: false, field: 'amenity_id' },
  propertyId: { type: DataTypes.STRING, allowNull: false, field: 'property_id' },
  startTime: { type: DataTypes.DATE, allowNull: false, field: 'start_time' },
  endTime: { type: DataTypes.DATE, allowNull: false, field: 'end_time' },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'confirmed' },
}, {
  tableName: 'bookings',
  underscored: true,
});

const GuestRequest = sequelize.define('GuestRequest', {
  id,
  tenantId: { type: DataTypes.STRING, allowNull: false, field: 'tenant_id' },
  propertyId: { type: DataTypes.STRING, allowNull: false, field: 'property_id' },
  guestName: { type: DataTypes.STRING, allowNull: false, field: 'guest_name' },
  guestPhone: { type: DataTypes.STRING, field: 'guest_phone' },
  visitDate: { type: DataTypes.DATE, allowNull: false, field: 'visit_date' },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' },
  approvedBy: { type: DataTypes.STRING, field: 'approved_by' },
}, {
  tableName: 'guest_requests',
  underscored: true,
});

const Payment = sequelize.define('Payment', {
  id,
  tenantId: { type: DataTypes.STRING, allowNull: false, field: 'tenant_id' },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  currency: { type: DataTypes.STRING, allowNull: false, defaultValue: 'SAR' },
  paymentMethod: { type: DataTypes.STRING, allowNull: false, field: 'payment_method' },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' },
  reference: { type: DataTypes.STRING, unique: true },
  promoCodeId: { type: DataTypes.STRING, field: 'promo_code_id' },
}, {
  tableName: 'payments',
  underscored: true,
  updatedAt: false,
});

const Wallet = sequelize.define('Wallet', {
  id,
  tenantId: { type: DataTypes.STRING, allowNull: false, unique: true, field: 'tenant_id' },
  balance: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  currency: { type: DataTypes.STRING, allowNull: false, defaultValue: 'SAR' },
}, {
  tableName: 'wallets',
  underscored: true,
});

const WalletTransaction = sequelize.define('WalletTransaction', {
  id,
  walletId: { type: DataTypes.STRING, allowNull: false, field: 'wallet_id' },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  reference: DataTypes.STRING,
}, {
  tableName: 'wallet_transactions',
  underscored: true,
  updatedAt: false,
});

const PromoCode = sequelize.define('PromoCode', {
  id,
  code: { type: DataTypes.STRING, allowNull: false, unique: true },
  discountType: { type: DataTypes.STRING, allowNull: false, field: 'discount_type' },
  discountValue: { type: DataTypes.FLOAT, allowNull: false, field: 'discount_value' },
  maxUses: { type: DataTypes.INTEGER, field: 'max_uses' },
  usedCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'used_count' },
  expiresAt: { type: DataTypes.DATE, field: 'expires_at' },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'active' },
}, {
  tableName: 'promo_codes',
  underscored: true,
  updatedAt: false,
});

Wallet.hasMany(WalletTransaction, { as: 'transactions', foreignKey: 'walletId' });
WalletTransaction.belongsTo(Wallet, { as: 'wallet', foreignKey: 'walletId' });

module.exports = {
  sequelize,
  Booking,
  GuestRequest,
  Payment,
  Wallet,
  WalletTransaction,
  PromoCode,
};

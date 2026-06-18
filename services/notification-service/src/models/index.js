const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const id = {
  type: DataTypes.STRING,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true,
};

const Notification = sequelize.define('Notification', {
  id,
  userId: { type: DataTypes.STRING, allowNull: false, field: 'user_id' },
  type: { type: DataTypes.STRING, allowNull: false },
  channel: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  body: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' },
  source: DataTypes.STRING,
}, {
  tableName: 'notifications',
  underscored: true,
  updatedAt: false,
});

const NotificationLog = sequelize.define('NotificationLog', {
  id,
  notificationId: { type: DataTypes.STRING, allowNull: false, field: 'notification_id' },
  status: { type: DataTypes.STRING, allowNull: false },
  response: DataTypes.TEXT,
}, {
  tableName: 'notification_logs',
  underscored: true,
  updatedAt: false,
});

const EmailLog = sequelize.define('EmailLog', {
  id,
  to: { type: DataTypes.STRING, allowNull: false },
  subject: { type: DataTypes.STRING, allowNull: false },
  body: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'sent' },
}, {
  tableName: 'email_logs',
  underscored: true,
  updatedAt: false,
});

const SmsLog = sequelize.define('SmsLog', {
  id,
  to: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'sent' },
}, {
  tableName: 'sms_logs',
  underscored: true,
  updatedAt: false,
});

Notification.hasMany(NotificationLog, { as: 'logs', foreignKey: 'notificationId', onDelete: 'CASCADE' });
NotificationLog.belongsTo(Notification, { as: 'notification', foreignKey: 'notificationId' });

module.exports = {
  sequelize,
  Notification,
  NotificationLog,
  EmailLog,
  SmsLog,
};

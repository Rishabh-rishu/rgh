const AUTH_SERVICE_URL = "http://auth-service:3001";
const PROPERTY_SERVICE_URL = process.env.PROPERTY_SERVICE_URL || 'http://property-service:3002';
const OPERATIONS_SERVICE_URL = process.env.OPERATIONS_SERVICE_URL || 'http://operations-service:3003';
const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL || 'http://booking-service:3004';
const COMMUNITY_SERVICE_URL = process.env.COMMUNITY_SERVICE_URL || 'http://community-service:3005';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3006';

const services = [
  {
    name: 'auth-service',
    path: '/api/auth',
    target: AUTH_SERVICE_URL,
    protected: false,
    pathRewrite: { '^/api/auth': '/api/auth' },
  },
  {
    name: 'property-service',
    path: '/api/properties',
    target: PROPERTY_SERVICE_URL,
    protected: false,
    roles: ['admin', 'tenant', 'security_guard'],
    pathRewrite: { '^/api/properties': '/api/properties' },
  },
  {
    name: 'operations-service',
    path: '/api/operations',
    target: OPERATIONS_SERVICE_URL,
    protected: true,
    roles: ['admin', 'security_guard', 'service_team', 'service_provider'],
    pathRewrite: { '^/api/operations': '/api/operations' },
  },
  {
    name: 'booking-service',
    path: '/api/bookings',
    target: BOOKING_SERVICE_URL,
    protected: true,
    roles: ['admin', 'tenant', 'security_guard'],
    pathRewrite: { '^/api/bookings': '/api/bookings' },
  },
  {
    name: 'community-service',
    path: '/api/community',
    target: COMMUNITY_SERVICE_URL,
    protected: true,
    roles: ['admin', 'tenant'],
    pathRewrite: { '^/api/community': '/api/community' },
  },
  {
    name: 'notification-service',
    path: '/api/notifications',
    target: NOTIFICATION_SERVICE_URL,
    protected: true,
    roles: ['admin'],
    pathRewrite: { '^/api/notifications': '/api/notifications' },
  },
];

module.exports = { services };

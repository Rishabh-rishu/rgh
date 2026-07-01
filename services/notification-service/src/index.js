require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

const { createServiceApp, startServer } = require('@rgh/shared');
const sequelize = require('./config/database');
const notificationRoutes = require('./routes/notificationRoutes');

const PORT = process.env.NOTIFICATION_PORT || 3006;
const HOST = process.env.HOST || '0.0.0.0';

const { app, logger } = createServiceApp({
  serviceName: 'notification-service',
  routes: notificationRoutes,
  basePath: '/api/notifications',
});

async function bootstrap() {
  await sequelize.connectDb();

  startServer({
    app,
    logger,
    serviceName: 'Notification Service',
    port: PORT,
    host: HOST,
  });
}

bootstrap().catch((err) => {
  logger.error(`Notification Service failed to start: ${err.message}`);
  process.exit(1);
});

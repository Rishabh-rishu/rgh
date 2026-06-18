require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

const { createServiceApp, startServer } = require('@rgh/shared');
const sequelize = require('./config/database');
const operationsRoutes = require('./routes/operationsRoutes');

const PORT = process.env.OPERATIONS_PORT || 3003;
const HOST = process.env.HOST || '0.0.0.0';

const { app, logger } = createServiceApp({
  serviceName: 'operations-service',
  routes: operationsRoutes,
  basePath: '/api/operations',
});

async function bootstrap() {
  await sequelize.connectDb();

  startServer({
    app,
    logger,
    serviceName: 'Operations Service',
    port: PORT,
    host: HOST,
  });
}

bootstrap().catch((err) => {
  logger.error(`Operations Service failed to start: ${err.message}`);
  process.exit(1);
});

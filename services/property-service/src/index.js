require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

const { createServiceApp, startServer } = require('@rgh/shared');
const sequelize = require('./config/database');
const propertyRoutes = require('./routes/propertyRoutes');

const PORT = process.env.PROPERTY_PORT || 3002;
const HOST = process.env.HOST || '0.0.0.0';

const { app, logger } = createServiceApp({
  serviceName: 'property-service',
  routes: propertyRoutes,
  basePath: '/api/properties',
});

async function bootstrap() {
  await sequelize.connectDb();

  startServer({
    app,
    logger,
    serviceName: 'Property Service',
    port: PORT,
    host: HOST,
  });
}

bootstrap().catch((err) => {
  logger.error(`Property Service failed to start: ${err.message}`);
  process.exit(1);
});

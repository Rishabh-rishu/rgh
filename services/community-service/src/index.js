require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

const { createServiceApp, startServer } = require('@rgh/shared');
const sequelize = require('./config/database');
const communityRoutes = require('./routes/communityRoutes');

const PORT = process.env.COMMUNITY_PORT || 3005;
const HOST = process.env.HOST || '0.0.0.0';

const { app, logger } = createServiceApp({
  serviceName: 'community-service',
  routes: communityRoutes,
  basePath: '/api/community',
});

async function bootstrap() {
  await sequelize.connectDb();

  startServer({
    app,
    logger,
    serviceName: 'Community Service',
    port: PORT,
    host: HOST,
  });
}

bootstrap().catch((err) => {
  logger.error(`Community Service failed to start: ${err.message}`);
  process.exit(1);
});

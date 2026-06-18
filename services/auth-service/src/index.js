require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

const { createServiceApp, startServer } = require('@rgh/shared');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');

const PORT = process.env.AUTH_PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

const { app, logger } = createServiceApp({
  serviceName: 'auth-service',
  routes: authRoutes,
  basePath: '/api/auth',
});

async function bootstrap() {
  await sequelize.connectDb();

  startServer({
    app,
    logger,
    serviceName: 'Auth Service',
    port: PORT,
    host: HOST,
  });
}

bootstrap().catch((err) => {
  logger.error(`Auth Service failed to start: ${err.message}`);
  process.exit(1);
});

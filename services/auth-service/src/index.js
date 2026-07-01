import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import shared from '@rgh/shared';
import sequelize from './config/database.js';
import authRoutes from './routes/authRoutes.js';

const { createServiceApp, startServer } = shared;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

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

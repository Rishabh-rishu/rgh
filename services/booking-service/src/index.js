require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

const { createServiceApp, startServer } = require('@rgh/shared');
const sequelize = require('./config/database');
const bookingRoutes = require('./routes/bookingRoutes');

const PORT = process.env.BOOKING_PORT || 3004;
const HOST = process.env.HOST || '0.0.0.0';

const { app, logger } = createServiceApp({
  serviceName: 'booking-service',
  routes: bookingRoutes,
  basePath: '/api/bookings',
});

async function bootstrap() {
  await sequelize.connectDb();

  startServer({
    app,
    logger,
    serviceName: 'Booking Service',
    port: PORT,
    host: HOST,
  });
}

bootstrap().catch((err) => {
  logger.error(`Booking Service failed to start: ${err.message}`);
  process.exit(1);
});

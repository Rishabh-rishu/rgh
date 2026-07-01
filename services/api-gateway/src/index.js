require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
 
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');
const { createLogger, startServer } = require('@rgh/shared');
const { authMiddleware } = require('./middleware/auth');
const { services } = require('./config/services');
 
const PORT = process.env.GATEWAY_PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const logger = createLogger('api-gateway');
const app = express();
 
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use(limiter);
 
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
    routes: services.map((s) => ({ path: s.path, target: s.target })),
  });
});
 
services.forEach((service) => {
  const middlewares = [];
 
  if (service.protected) {
    middlewares.push(authMiddleware(service.roles));
  }
 
  middlewares.push(
    createProxyMiddleware({
      target: service.target,
      changeOrigin: true,
      pathRewrite: (_path, req) => req.originalUrl,
      on: {
        proxyReq: (proxyReq, req) => {
          fixRequestBody(proxyReq, req);
 
          if (req.user) {
            proxyReq.setHeader('x-user-id', req.user.id);
            proxyReq.setHeader('x-user-role', req.user.role);
            proxyReq.setHeader('x-user-email', req.user.email);
          }
        },
        error: (err, _req, res) => {
          logger.error(`Proxy error for ${service.path}: ${err.message}`);
          if (!res.headersSent) {
            res.status(502).json({
              success: false,
              message: `Service unavailable: ${service.name}`,
            });
          }
        },
      },
    })
  );
 
  app.use(service.path, ...middlewares);
  logger.info(`Registered route: ${service.path} -> ${service.target}`);
});
 
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});
 
startServer({
  app,
  logger,
  serviceName: 'API Gateway',
  port: PORT,
  host: HOST,
  onListening: () => {
    logger.info('All requests must go through this gateway');
  },
});
 
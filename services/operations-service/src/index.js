import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import shared from "@rgh/shared";
import sequelize from "./config/database.js";
import operationsRoutes from "./routes/index.js";

const { createServiceApp, startServer } = shared;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../../.env"),
});

const PORT = process.env.OPERATIONS_PORT || 3003;
const HOST = process.env.HOST || "0.0.0.0";

const { app, logger } = createServiceApp({
  serviceName: "operations-service",
  routes: operationsRoutes,
  basePath: "/api/operations",
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

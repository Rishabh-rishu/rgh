import { Sequelize } from 'sequelize';

function getDatabaseUrl() {
  if (process.env.AUTH_DATABASE_URL || process.env.DATABASE_URL) {
    return process.env.AUTH_DATABASE_URL || process.env.DATABASE_URL;
  }

  const { DB_HOST, DB_PORT = 5432, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

  if (!DB_HOST || !DB_NAME || !DB_USER || !DB_PASSWORD) {
    throw new Error('Auth service database is not configured. Set AUTH_DATABASE_URL, DATABASE_URL, or DB_HOST/DB_NAME/DB_USER/DB_PASSWORD.');
  }

  return `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

const sequelize = new Sequelize(getDatabaseUrl(), {
  dialect: 'postgres',
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
});

async function connectDb() {
  try {
    await sequelize.authenticate();
    console.log('Auth service database connected successfully');
    return sequelize;
  } catch (error) {
    console.error('Unable to connect to auth service database:', error.message);
    throw error;
  }
}

sequelize.connectDb = connectDb;
sequelize.connectionDb = connectDb;

export default sequelize;

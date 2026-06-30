import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT_MS || 10000),
  },
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
});

async function connectDb() {
  try {
    await sequelize.authenticate();

    console.log('Auth service database connected successfully');
    await sequelize.sync({ alter: true }); // Updates existing tables
    console.log("Database synchronized");
    return sequelize;
  } catch (error) {
    console.error('Unable to connect to auth service database:', error.message);
    throw error;
  }
}

sequelize.connectDb = connectDb;
sequelize.connectionDb = connectDb;

export default sequelize;

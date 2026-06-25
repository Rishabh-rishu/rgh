import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('postgresql://rgh34pusr:HS397XUv3ZQspe67@3.210.55.83:5432/rgh_db', {
  dialect: 'postgres',
  dialectOptions: {
    connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT_MS || 10000),
  },
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
});

async function connectDb() {
  try {
    console.log("-=-=-=-==-",sequelize)
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

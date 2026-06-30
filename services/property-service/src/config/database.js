const { Sequelize } = require('sequelize');

const dbUrl =  "postgresql://rgh34pusr:HS397XUv3ZQspe67@3.210.55.83:5432/rgh_db";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
});

async function connectDb() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); // Updates existing tables
    console.log("Database synchronized");
    console.log('Property service database connected successfully');
    return sequelize;
  } catch (error) {
    console.error('Unable to connect to property service database:', error.message);
    throw error;
  }
}

sequelize.connectDb = connectDb;
sequelize.connectionDb = connectDb;

module.exports = sequelize;

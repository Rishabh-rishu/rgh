const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
});

async function connectDb() {
  try {
    await sequelize.authenticate();
    console.log('Booking service database connected successfully');
    return sequelize;
  } catch (error) {
    console.error('Unable to connect to booking service database:', error.message);
    throw error;
  }
}

sequelize.connectDb = connectDb;
sequelize.connectionDb = connectDb;

module.exports = sequelize;

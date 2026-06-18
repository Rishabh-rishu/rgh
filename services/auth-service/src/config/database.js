const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.AUTH_DATABASE_URL || process.env.DATABASE_URL || 'postgres://rgh:rgh_password@localhost:5432/rgh_auth', {
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

module.exports = sequelize;

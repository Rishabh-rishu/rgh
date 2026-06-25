import { sequelize } from '../models/index.js';

sequelize.sync({ alter: process.env.DB_SYNC_ALTER === 'true' })
  .then(() => {
    console.log('Auth service database synced');
    return sequelize.close();
  })
  .catch(async (err) => {
    console.error(err);
    await sequelize.close();
    process.exit(1);
  });

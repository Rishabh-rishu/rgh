const models = require('../models');

models.sequelize.sync({ alter: process.env.DB_SYNC_ALTER === 'true' })
  .then(() => {
    console.log('Property service database synced');
    return models.sequelize.close();
  })
  .catch(async (err) => {
    console.error(err);
    await models.sequelize.close();
    process.exit(1);
  });

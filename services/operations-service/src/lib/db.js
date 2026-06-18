const { createSequelizeModelClient } = require('@rgh/shared');
const models = require('../models');

module.exports = { db: createSequelizeModelClient(models), sequelize: models.sequelize };

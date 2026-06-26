const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const securityGaurd = require("./securityGaurd.model")


module.exports = {
  sequelize,
  securityGaurd
};

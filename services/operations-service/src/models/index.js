const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const securityGaurd = require("./securityGaurd.model")
const thirdParty = require("./thirdParty.model")


module.exports = {
  sequelize,
  securityGaurd,
  thirdParty
};

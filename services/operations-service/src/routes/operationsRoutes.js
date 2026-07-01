const express = require('express');
const { success, authenticate, authorize } = require('@rgh/shared');
const { db } = require('../lib/db');

const router = express.Router()

module.exports = router;

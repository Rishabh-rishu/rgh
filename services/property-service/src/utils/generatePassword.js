const bcrypt = require('bcrypt');

async function generatePassword(password) {
  return await bcrypt.hash(password, 10);
}

module.exports = { generatePassword };
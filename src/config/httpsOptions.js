const fs = require('fs');
const path = require('path');
require('dotenv').config();

const options = {
  key: fs.readFileSync(path.resolve(__dirname, '../../privkey.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../../fullchain.pem')),
  passphrase: process.env.PASSPHRASE,
};

module.exports = options;

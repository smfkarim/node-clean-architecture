const bcrypt = require('bcrypt');
const config = require('../../config/environment');
const HashService = require('../../application/services/HashService');

class HashServiceImpl extends HashService {
  async hash(data) {
    return await bcrypt.hash(data, config.bcrypt.saltRounds);
  }

  async compare(data, hash) {
    return await bcrypt.compare(data, hash);
  }
}

module.exports = HashServiceImpl;
'use sctrict'
const bcrypt = require('bcryptjs')

class Utils {
  constructor() {
  }

  getEncryptedPassword(password) {
    const rounds = 10;
    const salt = bcrypt.genSaltSync(rounds);
    return bcrypt.hashSync(password, salt);
  }
}

module.exports = new Utils();
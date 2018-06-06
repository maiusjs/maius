const { Service } = require('../../dev/maius');

module.exports = class HomeService extends Service {
  async number(num) {
    return num + 100;
  }
};

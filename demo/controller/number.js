const { Controller } = require('../../dev/maius');

module.exports = class HomeController extends Controller {
  async getNumber(ctx, next) {
    const number = await this.service.home.number(10);
    ctx.body = number;
  }
};

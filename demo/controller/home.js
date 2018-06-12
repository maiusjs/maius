const { Controller } = require('../../dev/maius');

module.exports = class HomeController extends Controller {
  constructor() {
    super();
    this.info = this.info.bind(this);
  }

  async info(ctx, next) {
    // console.log('Controller dealing with the request');
    const number = await this.service.home.number(10);

    await ctx.render('index', {
      user: 'Maius'
    });
  }
};

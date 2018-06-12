const { Controller } = require('../../dev/maius');

module.exports = class HomeController extends Controller {
  constructor() {
    super();
    this.info = this.info.bind(this);
  }

  async info(ctx, next) {
    await ctx.render('index', {
      msg: 'Welcome to Maius'
    });
  }
};

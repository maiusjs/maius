const { Controller } = require('../../dev/maius');

module.exports = class HomeController extends Controller {
  async info(ctx, next) {
    // ctx.body = 'hello world!';
    // await next();
    await ctx.render('index', {
      msg: 'Welcome to Maius'
    });
  }
};

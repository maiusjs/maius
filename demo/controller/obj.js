module.exports = {
  b: 'Yeah~!',

  async info(ctx, next) {
    console.log(this);
    await ctx.render('index', {
      msg: `Welcome to Maius, ${this.b}`
    });
  }
}

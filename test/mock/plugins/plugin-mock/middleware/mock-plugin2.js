module.exports = function mockPlugin2() {
  return async (ctx, next) => {
    console.log('This is mockPlugin2 middleware, in');
    await next();
    console.log('This is mockPlugin2 middleware, out');
  }
}

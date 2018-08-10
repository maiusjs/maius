module.exports = function mockPlugin1() {
  return async (ctx, next) => {
    console.log('This is mockPlugin1 middleware, in');
    await next();
    console.log('This is mockPlugin1 middleware, out');
  }
}

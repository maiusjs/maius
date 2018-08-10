module.exports = function fn1() {
  return async (ctx, next) => {
    console.log('This is fn1 middleware, in');
    await next();
    console.log('This is fn1 middleware, out');
  }
}

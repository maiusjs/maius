module.exports = function fn3() {
  return async (ctx, next) => {
    console.log('This is fn3 middleware, in');
    await next();
    console.log('This is fn3 middleware, out');
  }
}

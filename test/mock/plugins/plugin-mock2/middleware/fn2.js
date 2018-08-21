module.exports = function fn2() {
  return async (ctx, next) => {
    console.log('This is fn2 middleware, in');
    await next();
    console.log('This is fn2 middleware, out');
  }
}

module.exports = function mockPlugin1(options, app, pluginConfig) {
  console.log('executed mockPlugin1');
  console.log('mockPlugin1 got plugin config:', pluginConfig);

  return async (ctx, next) => {
    console.log('This is mockPlugin1 middleware, in');
    await next();
    console.log('This is mockPlugin1 middleware, out');
  }
}

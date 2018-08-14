module.exports = function mockPlugin2(options, app, pluginConfig) {
  console.log('executed mockPlugin2');
  console.log('mockPlugin2 got plugin config:', pluginConfig);

  return async (ctx, next) => {
    console.log('This is mockPlugin2 middleware, in');
    await next();
    console.log('This is mockPlugin2 middleware, out');
  }
}

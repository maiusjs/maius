module.exports = (options, app, pluginConfig) => async (ctx, next) => {
  console.log('external in');
  // console.log('external plugin config', pluginConfig);
  await next()
  console.log('external out');
};

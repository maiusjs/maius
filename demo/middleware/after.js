module.exports = options => async (ctx, next) => {
  // options && options.name && (ctx.name = options.name);
  console.log('After middleware will be called after router');
  await next();
};

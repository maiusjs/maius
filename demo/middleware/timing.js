module.exports = options => async (ctx, next) => {
  const start = Date.now();
  await next();
  console.log(`time: ${Date.now() - start}ms`);
};

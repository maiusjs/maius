module.exports = options => async function timing(ctx, next) {
  const start = Date.now();
  await next();
  console.log(`time: ${Date.now() - start}ms`);
};

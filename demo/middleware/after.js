module.exports = options => async function after(ctx, next) {
  console.log('After inner');
  await next();
  console.log('After outer');
};

module.exports = (options, app) => async (ctx, next) => {
  console.log('dddeeemmmooo in');
  console.log(options);
  console.log(app);
  await next()
  console.log('dddeeemmmooo out');
};

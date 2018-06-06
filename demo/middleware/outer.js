module.exports = () => async (ctx, next) => {
  console.log(`--> ${ctx.method} ${ctx.href}`);
  await next();
  console.log('<-- End');
};

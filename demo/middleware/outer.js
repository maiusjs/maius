module.exports = () => async function outer(ctx, next) {
  console.log(`--> ${ctx.method} ${ctx.href}`);
  await next();
  console.log('<-- End');
};

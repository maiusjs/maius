import { Context } from 'koa';

module.exports = (options, app) => async (ctx: Context, next) => {
  console.log('demo demo demo in');
  await next();
  console.log('demo demo demo out');
};

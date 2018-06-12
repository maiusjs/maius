import * as koaViews from 'koa-views';

export const maiusViews = (dir: string, opt?: IMaiusViewOpt) => koaViews(dir, opt);

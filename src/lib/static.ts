import * as serve from 'koa-static';

const maiusStatic = (staticPath, opts) => serve(staticPath, opts);

export default maiusStatic;

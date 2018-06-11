import * as serve from 'koa-static';

const maiusStatic = (staticPath: string, opts: serve.Options) => serve(staticPath, opts);

export default maiusStatic;

/// <reference path="../../../node_modules/@types/koa-router/index.d.ts" />
/// <reference path="../../../node_modules/@types/koa-views/index.d.ts" />
/// <reference types="koa" />
/// <reference types="koa-router" />
/// <reference types="koa-views" />
import * as serve from 'koa-static';
declare const maiusStatic: (staticPath: string, opts: serve.Options) => (context: Application.Context, next: () => Promise<any>) => any;
export default maiusStatic;

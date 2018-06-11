import * as KoaRouter from 'koa-router';
declare class Router extends KoaRouter {
    private maius;
    constructor(opts: KoaRouter.IRouterOptions);
    resources(...args: any[]): void;
}
export default Router;

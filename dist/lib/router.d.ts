import * as KoaRouter from 'koa-router';
export default class Router extends KoaRouter {
    private maius;
    constructor(opts: any, maius: any);
    resources(...args: any[]): void;
}

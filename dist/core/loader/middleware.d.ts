import { Middleware } from 'koa';
import Maius from '../../maius';
export interface IMiddlewareConfig {
    name: string | ((...args: any[]) => Middleware);
    args?: any[];
    options: any;
    disabled?: boolean;
}
export interface IMiddlewareFnCol {
    [x: string]: (...args: any[]) => Middleware;
}
export default class MiddlewareLoader {
    middlewareFnCol: IMiddlewareFnCol;
    middlewareConfigList: IMiddlewareConfig[];
    private config;
    private app;
    constructor(app: Maius, dirname: string, config: IMiddlewareConfig[]);
    load(...extendArgs: any[]): void;
    private collectMiddleware;
    private requireMiddleware;
    private handleMiddlewareConfig;
    private proxyPushItem;
    private checkSafe;
}

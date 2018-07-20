/// <reference types="koa-router" />
/// <reference types="koa-views" />
/// <reference types="node" />
import * as http from 'http';
import * as KoaApplication from 'koa';
import * as log4js from 'log4js';
import IUserConfig from './interface/i-user-config';
import IUserOptions from './interface/i-user-options';
import BaseContext from './lib/base-context';
import { HttpClient } from './lib/httpclient';
import Logger from './lib/logger';
import Router from './lib/router';
export declare type MaiusContext = KoaApplication.Context;
declare class Maius extends KoaApplication {
    static Controller: typeof BaseContext;
    static Service: typeof BaseContext;
    static Logger: typeof Logger;
    options: IUserOptions;
    config: IUserConfig;
    router: Router;
    controller: {
        [x: string]: BaseContext;
    };
    service: {
        [x: string]: BaseContext;
    };
    logger: log4js.Logger;
    httpClient: HttpClient;
    ctx: KoaApplication.Context;
    constructor(options: IUserOptions);
    listen(...args: any[]): any;
    createContext(req: http.IncomingMessage, res: http.ServerResponse): KoaApplication.Context;
    private readonly controllerLoader;
    private readonly serviceLoader;
    private readonly middlewareLoader;
    private useMiddleware;
    private loadUserRoutes;
    private errorHandler;
}
export default Maius;

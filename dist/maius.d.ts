/// <reference types="koa-router" />
/// <reference types="koa-views" />
/// <reference types="node" />
import * as http from 'http';
import * as KoaApplication from 'koa';
import * as log4js from 'log4js';
import BaseContext from './core/lib/base-context';
import { HttpClient } from './core/lib/httpclient';
import Logger from './core/lib/logger';
import Router from './core/lib/router';
import { IConfig } from './core/loader/config';
export declare type MaiusContext = KoaApplication.Context;
export interface IOptions {
    rootDir: string;
    port?: number;
}
declare const dirname: {
    CONFIG: string;
    CONTROLLER: string;
    MIDDLEWARE: string;
    PLUGIN: string;
    ROUTER: string;
    SERVICE: string;
    STATIC: string;
    VIEW: string;
};
declare class Maius extends KoaApplication {
    static Controller: typeof BaseContext;
    static Service: typeof BaseContext;
    static Logger: typeof Logger;
    options: IOptions;
    config: IConfig;
    router: Router;
    dirname: typeof dirname;
    controller: {
        [x: string]: BaseContext;
    };
    service: {
        [x: string]: BaseContext;
    };
    logger: log4js.Logger;
    httpClient: HttpClient;
    ctx: KoaApplication.Context;
    constructor(options: IOptions);
    listen(...args: any[]): any;
    createContext(req: http.IncomingMessage, res: http.ServerResponse): KoaApplication.Context;
    private getLogger;
    private readonly controllerLoader;
    private readonly serviceLoader;
    private useMiddleware;
    private loadUserRoutes;
    private errorHandler;
}
export default Maius;

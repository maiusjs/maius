import { Middleware } from 'koa';
import * as serve from 'koa-static';
import { IPluginOptions } from '../../core/loader/plugin/plugin-one';
import Maius from '../../maius';
declare type MiddlewareList = ((...args: any[]) => Middleware)[];
interface IStaticOptions extends IPluginOptions {
    options?: string[] | {
        root: string;
        options: serve.Options;
    }[];
}
export default class MaiusStatic {
    middleware: MiddlewareList;
    private app;
    private options;
    constructor(app: Maius, options: IStaticOptions);
    private useMiddleware;
}
export {};

import { Middleware } from 'koa';
import Maius from '../../../maius';
import { IConfig } from '../config';
export interface IPlugin {
    middleware?: ((...args: any[]) => Middleware)[];
}
export interface IPluginOptions {
    name: string;
    [x: string]: any;
}
export default class PluginOneLoader {
    dirname: string;
    directory: {
        config: string;
        middleware: string;
    };
    options: IPluginOptions;
    config: IConfig;
    private app;
    constructor(app: Maius, dirname: string, options: IPluginOptions);
    load(): void;
    private callEntry;
}

import { IMiddlewareConfig } from './middleware';
interface IViewConfig {
    root: string;
    options: {
        extension?: string;
        options?: any;
        map?: any;
        engineSource?: any;
    };
}
export interface ILoggerConfig {
    directory?: string;
    level?: string;
    stdout?: boolean;
}
export interface IConfig {
    env?: string;
    middleware?: IMiddlewareConfig[];
    plugin?: {
        name: string;
        [x: string]: any;
    }[];
    logger?: ILoggerConfig;
    view?: IViewConfig;
    [x: string]: any;
}
export default class ConfigLoader {
    private dirname;
    private config;
    constructor(dirname: string);
    getConfig(): IConfig;
    private mergeMultiUserConfig;
    private mergeConfigByFile;
    private mergeConfigFolder;
    private folderEnv;
}
export {};

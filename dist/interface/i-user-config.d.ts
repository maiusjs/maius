import ConfigMiddlewareItemModel from '../models/mdw-opts-model';
export default interface IUserConfig {
    env?: string;
    middleware?: IUserConfigMiddlewareOpts[];
    static: any;
    logger?: ILoggerConfig;
    views?: {
        engine: string;
        extension: string;
        dir: string;
        option?: object;
    };
}
export declare type IUserConfigMiddlewareOpts = string | ConfigMiddlewareItemModel;
export interface ILoggerConfig {
    directory?: string;
    level?: string;
    stdout?: boolean;
}

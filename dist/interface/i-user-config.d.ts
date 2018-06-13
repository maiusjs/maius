import ConfigMiddlewareItemModel from '../models/mdw-opts-model';
export default interface IUserConfig {
    middleware?: IUserConfigMiddlewareOpts[];
    staticOpts: any;
    views: {
        engine: string;
        extension: string;
        dir: string;
    };
}
export declare type IUserConfigMiddlewareOpts = string | ConfigMiddlewareItemModel;

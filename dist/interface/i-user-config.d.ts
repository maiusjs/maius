import Application from '../lib/application';
export default interface IUserConfig {
    middleware?: IUserConfigMiddlewareOpts[];
    static: any;
}
export declare type IUserConfigMiddlewareOpts = string | IUserConfigMiddlewareArrItem;
export interface IUserConfigMiddlewareArrItem {
    args?: any[];
    name: string;
    load?: (app: Application) => any;
    _couldReorder?: boolean;
    _filename?: string;
}

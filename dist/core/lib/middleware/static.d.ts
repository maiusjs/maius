import Maius from '../../maius';
import ConfigMiddlewareItemModel from '../../models/mdw-opts-model';
import { BaseMiddleware } from './base';
export default class Static extends BaseMiddleware {
    private staticPath;
    private userConfig;
    private userOptions;
    private opts;
    private staticConfig;
    private defaultConfig;
    constructor(maius: Maius);
    getMiddlewareOpts(opts?: ConfigMiddlewareItemModel): typeof opts;
}

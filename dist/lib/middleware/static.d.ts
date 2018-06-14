import Maius from '../../maius';
import ConfigMiddlewareItemModel from '../../models/mdw-opts-model';
import { BaseMiddleware } from './base';
export default class Static extends BaseMiddleware {
    private staticPath;
    private staticOpts;
    private userConfig;
    private userOptions;
    private opts;
    constructor(maius: Maius);
    getMiddlewareOpts(opts?: ConfigMiddlewareItemModel): typeof opts;
}

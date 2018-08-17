import Maius from '../../maius';
import ConfigMiddlewareItemModel from '../../models/mdw-opts-model';
import { BaseMiddleware } from './base';
export default class LoggerMiddleware extends BaseMiddleware {
    private userConfig;
    private userOptions;
    constructor(maius: Maius);
    getMiddlewareOpts(opts?: ConfigMiddlewareItemModel): typeof opts;
}

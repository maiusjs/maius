import Maius from '../../maius';
import ConfigMiddlewareItemModel from '../../models/mdw-opts-model';
import { BaseMiddleware } from './base';
export default class Static extends BaseMiddleware {
    private userConfig;
    private userOptions;
    private supportMap;
    private viewsConfig;
    constructor(maius: Maius);
    getMiddlewareOpts(opts?: ConfigMiddlewareItemModel): typeof opts;
    private getUserCustomFliter;
    private viewsDir;
    private makeViewsConfig;
}

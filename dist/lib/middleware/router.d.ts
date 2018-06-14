import Maius from '../../maius';
import ConfigMiddlewareItemModel from '../../models/mdw-opts-model';
import { BaseMiddleware } from './base';
export default class RouterMdw extends BaseMiddleware {
    constructor(maius: Maius);
    getMiddlewareOpts(): ConfigMiddlewareItemModel;
}

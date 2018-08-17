import Maius from '../../maius';
import MdwOptsModel from '../../models/mdw-opts-model';
export declare abstract class BaseMiddleware {
    protected maius: Maius;
    constructor(maius: Maius);
    abstract getMiddlewareOpts(opts?: MdwOptsModel): typeof opts;
    merge(source: MdwOptsModel, target: typeof source): typeof source;
}

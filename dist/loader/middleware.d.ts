import Maius from '../maius';
import MdwOptsModel from '../models/mdw-opts-model';
export default class MiddlewareLoader {
    private maius;
    private userOptions;
    private userConfig;
    private selfBeforeMdw;
    private selfAfterMdw;
    private willBeReorderdNames;
    constructor(maius: Maius);
    useAllMiddleware(): void;
    getAllMiddlewareOpts(): MdwOptsModel[];
    private getMiddlewareConfig;
    private filterBeRordered;
    private mergeSelfOptsWithUserReorderedOpts;
    private getMiddlewareDir;
    private makeOneSelfMiddlewareOpts;
    private requireSelfMiddlewareByName;
    private isSelfMiddlewareByOpts;
    private isSelfPrefix;
}

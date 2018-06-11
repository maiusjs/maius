import { Middleware } from 'koa';
import { IUserConfigMiddlewareArrItem } from '../interface/i-user-config';
import Maius from '../maius';
export default class MiddlewareLoader {
    private maius;
    private options;
    private userConfig;
    private router;
    private selfBeforeMdw;
    private selfAfterMdw;
    constructor(maius: Maius);
    getMiddleware(): Middleware[];
    getMiddlewareConfig(): IUserConfigMiddlewareArrItem[];
    getMiddlewareDir(): string;
    private loadOneMiddleware;
    private reorderMiddlewareOpts;
    private findSelfMiddlewareOpt;
    private assignOpt;
    private isSelfMiddleware;
    private selfStaticMiddleware;
    private selfRouterMiddleware;
}

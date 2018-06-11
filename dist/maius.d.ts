import IUserOptions from './interface/i-user-options';
import Application from './lib/application';
import BaseContext from './lib/base-context';
import Router from './lib/middleware/router';
declare class Maius {
    static Controller: typeof BaseContext;
    static Service: typeof BaseContext;
    options: IUserOptions;
    app: Application;
    router: Router;
    controller: {
        [x: string]: BaseContext;
    };
    service: {
        [x: string]: BaseContext;
    };
    private middleware;
    constructor(options: IUserOptions);
    listen(port: any): Promise<void>;
    readonly userConfig: any;
    private readonly controllerLoader;
    private readonly serviceLoader;
    private readonly middlewareLoader;
    private setControllerAndServiceProps;
    private useMiddleware;
    private loadUserRoutes;
}
export default Maius;

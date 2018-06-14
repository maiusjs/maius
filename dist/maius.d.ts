import IUserConfig from './interface/i-user-config';
import IUserOptions from './interface/i-user-options';
import Application from './lib/application';
import BaseContext from './lib/base-context';
import Router from './lib/router';
declare class Maius {
    static Controller: typeof BaseContext;
    static Service: typeof BaseContext;
    options: IUserOptions;
    config: IUserConfig;
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
    listen(port?: number): Promise<void>;
    private readonly controllerLoader;
    private readonly serviceLoader;
    private readonly middlewareLoader;
    private setControllerAndServiceProps;
    private useMiddleware;
    private loadUserRoutes;
}
export default Maius;

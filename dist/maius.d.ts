import Application from './lib/application';
import BaseContext from './lib/base-context';
import Router from './lib/router';
import ControllerLoader from './loader/controller';
import MiddlewareLoader from './loader/middleware';
import ServiceLoader from './loader/service';
interface IOptions {
    rootDir: string;
    port?: number;
}
declare class Maius {
    static Controller: typeof BaseContext;
    static Service: typeof BaseContext;
    options: IOptions;
    app: Application;
    router: Router;
    controller: {
        [x: string]: BaseContext;
    };
    service: {
        [x: string]: BaseContext;
    };
    constructor(options: IOptions);
    readonly controllerLoader: ControllerLoader;
    readonly serviceLoader: ServiceLoader;
    readonly middlewareLoader: MiddlewareLoader;
    setControllerAndServiceProps(): void;
    useMiddleware(): void;
    useAfterRouterMiddleware(): void;
    useStatic(): void;
    useRouter(): void;
    readonly middleware: any;
    readonly afterRouterMiddleware: any;
    readonly userConfig: object;
    listen(port: any): Promise<void>;
}
export default Maius;

export default class BaseContext {
    baseConstructor: typeof BaseContext;
    service: any;
    controller: any;
    bindService(service: object): void;
    bindController(controller: object): void;
}

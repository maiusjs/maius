export default class BaseContext {
  public baseConstructor: typeof BaseContext;
  public service: any;
  public controller: any;

  public bindService(service: object) {
    this.service = service;
  }

  public bindController(controller: object) {
    this.controller = controller;
  }
}

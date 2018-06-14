import Application from './application';

export default class BaseContext {
  public baseConstructor: typeof BaseContext;
  public service: any;
  public controller: any;
  public app: Application;

  constructor(app: Application) {
    this.app = app;
  }
  public bindService(service: object) {
    this.service = service;
  }

  public bindController(controller: object) {
    this.controller = controller;
  }
}

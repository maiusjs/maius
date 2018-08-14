export default class MockMaius {
  public middleware: any[];

  constructor() {
    this.middleware = [];
  }

  public use(fn: any) {
    this.middleware.push(fn);
  }
}

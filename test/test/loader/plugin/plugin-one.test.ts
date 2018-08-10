import * as path from 'path';
import PluginOneLoader from '../../../../src/loader/plugin/plugin-one';

class MockMaius {
  public middleware: any[];
  public mock: any;

  constructor() {
    this.middleware = [];
  }

  public use(fn) {
    this.middleware.push(fn);
  }
}

const app = new MockMaius();

describe('PluginOneLoader', () => {
  const project = path.resolve(__dirname, '../../../mock/plugins/plugin-mock');

  test('Load one plugin', () => {
    const pluginOneLoader = new PluginOneLoader(project, app as any);

    expect(app.mock).toBe('mock');
    expect(app.middleware.length).toBe(2);
    expect(typeof app.middleware[0]).toBe('function');
    expect(typeof app.middleware[1]).toBe('function');
  });
});

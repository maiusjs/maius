import * as path from 'path';
import PluginOneLoader from '../../../../../src/core/loader/plugin/plugin-one';
import MockMaius from '../../../../mock/maius';

describe('load one mock plugin', () => {
  const pluginConfig = { name: 'name', str: 'skr' };
  const pluginPath = path.resolve(__dirname, '../../../../mock/plugins/plugin-mock/');
  const app = new MockMaius();
  const pluginOneLoader = new PluginOneLoader(app as any, pluginPath, pluginConfig);

  // load the plugin
  pluginOneLoader.load();

  test('middlewares in the plugin should be loaded successfully', () => {
    expect(app.middleware.length).toBe(2);
  });

  test('check the public properties of pluginOneLoader', () => {
    expect(pluginOneLoader.directory).toEqual({
      config: path.join(pluginPath, 'config'),
      middleware: path.join(pluginPath, 'middleware'),
    });

    expect(pluginOneLoader.config).toEqual({
      middleware: [{
        name: 'mock-plugin1',
      }, {
        args: ['argument'],
        name: 'mock-plugin2',
      }],
    });
  });
});

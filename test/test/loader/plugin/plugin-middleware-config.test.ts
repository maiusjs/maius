import * as path from 'path';
import PluginConfigLoader from '../../../../src/loader/plugin/plugin-config';
import PluginMiddlewareConfigLoader from '../../../../src/loader/plugin/plugin-middlweare-config';

describe('PluginMiddlewareConfigLoader', () => {

  test('filter unsafe middleware config', () => {
    const project = path.resolve(__dirname, '../../../mock/plugins/plugin-unsafe-mdw-config');

    const pluginConfigLoader = new PluginConfigLoader(path.join(project, 'config'));
    const pluginMiddlewareConfigLoader =
      new PluginMiddlewareConfigLoader(pluginConfigLoader.config.middleware);

    const list = pluginMiddlewareConfigLoader.middlewareConfigList;

    expect(list.length).toBe(1);
    expect(list[0].name).toBe('mdw2');
    expect(list[0].args).toEqual(['arg']);
  });

  test('normal middleware config', () => {
    const project = path.resolve(__dirname, '../../../mock/plugins/plugin-mock/');

    const pluginConfigLoader = new PluginConfigLoader(path.join(project, 'config'));
    const pluginMiddlewareConfigLoader =
      new PluginMiddlewareConfigLoader(pluginConfigLoader.config.middleware);

    const list = pluginMiddlewareConfigLoader.middlewareConfigList;

    expect(list.length).toBe(2);
    expect(list[1].name).toBe('mock-plugin2');
    expect(list[1].args).toEqual(['argument']);
  });
});

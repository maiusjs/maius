import * as path from 'path';
import PluginConfigLoader from '../../../../src/loader/plugin/plugin-config';

describe('PluginConfigLoader', () => {
  test('Load single file config/middleware.js', () => {
    const configPath = path.resolve(__dirname, '../../../mock/plugins/plugin-mock/config');
    const pluginConfigLoader = new PluginConfigLoader(configPath);

    expect(pluginConfigLoader.config.middleware[0].name).toBe('mock-plugin1');
    expect(pluginConfigLoader.config.middleware[1].name).toBe('mock-plugin2');
    expect(pluginConfigLoader.config.middleware[1].args).toEqual(['argument']);
  });

  test('Load config/config.js & config/middleware.js', () => {
    const configPath = path.resolve(__dirname, '../../../mock/plugins/plugin-mock2/config');
    const pluginConfigLoader = new PluginConfigLoader(configPath);

    expect(pluginConfigLoader.config.middleware.length).toBe(1);
    expect(pluginConfigLoader.config.middleware[0].name).toBe('mdw1');
  });
});

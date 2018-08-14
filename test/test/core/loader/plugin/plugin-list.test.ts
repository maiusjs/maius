import * as path from 'path';
import PluginListLoader, { IPluginItem } from '../../../../../src/core/loader/plugin/plugin-list';
import MockMaius from '../../../../mock/maius';

const MOCK_PATH = path.resolve(__dirname, '../../../../mock');

describe('load a list of plugin', () => {
  const app = new MockMaius();
  const pluginList: IPluginItem[] = [{
    config: { name: 'plugin-mock', str: 'yo' },
    dirname: path.join(MOCK_PATH, './plugins/plugin-mock'),
  }, {
    config: { name: 'plugin-mock2', str: 'yoho' },
    dirname: path.join(MOCK_PATH, './plugins/plugin-mock2'),
  }];

  const pluginListLoader = new PluginListLoader(app as any, pluginList);

  pluginListLoader.load();

  test('use middleware', () => {
    // 2 + 1
    expect(app.middleware.length).toBe(3);
  });

  test('', () => {
  });
});

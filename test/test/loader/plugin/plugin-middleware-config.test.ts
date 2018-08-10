import * as path from 'path';
import PluginMiddlewareConfigLoader from '../../../../src/loader/plugin/plugin-middlweare-config';

describe('PluginMiddlewareConfigLoader', () => {

  test('filter unsafe middleware config', () => {
    const unsafeMiddleware  = [
      {
        args: 'unsafe',
        name: 'mdw1',
      },
      {
        args: ['arg'],
        name: 'mdw2',
      },
    ];

    const pluginMiddlewareConfigLoader =
      new PluginMiddlewareConfigLoader(unsafeMiddleware as any);

    const list = pluginMiddlewareConfigLoader.middlewareConfigList;

    expect(list.length).toBe(1);
    expect(list[0].name).toBe('mdw2');
    expect(list[0].args).toEqual(['arg']);
  });

  test('normal middleware config', () => {
    const middleware = [
      {
        name: 'mock-plugin1',
      },
      {
        args: ['argument'],
        name: 'mock-plugin2',
      },
    ];

    const pluginMiddlewareConfigLoader =
      new PluginMiddlewareConfigLoader(middleware);

    const list = pluginMiddlewareConfigLoader.middlewareConfigList;

    expect(list.length).toBe(2);
    expect(list[1].name).toBe('mock-plugin2');
    expect(list[1].args).toEqual(['argument']);
  });
});

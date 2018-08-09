import * as path from 'path';
import PluginMiddlewareLoader from '../../../../src/loader/plugin/plugin-middleware';

describe('PluginMiddlewareLoader', () => {
  test('load single middleware', () => {
    const dirname = path.resolve(__dirname, '../../../mock/plugins/plugin-mock/middleware');
    const pluginMiddlewareLoader = new PluginMiddlewareLoader(dirname);

    expect(typeof pluginMiddlewareLoader.middlewareCol.fn1).toBe('function');
    expect(pluginMiddlewareLoader.middlewareCol.fn1.name).toBe('fn1');
  });

  test('load multi middleware', () => {
    const dirname = path.resolve(__dirname, '../../../mock/plugins/plugin-mock2/middleware');
    const pluginMiddlewareLoader = new PluginMiddlewareLoader(dirname);

    expect(typeof pluginMiddlewareLoader.middlewareCol.fn1).toBe('function');
    expect(pluginMiddlewareLoader.middlewareCol.fn1.name).toBe('fn1');

    expect(typeof pluginMiddlewareLoader.middlewareCol.fn2).toBe('function');
    expect(pluginMiddlewareLoader.middlewareCol.fn2.name).toBe('fn2');

    expect(typeof pluginMiddlewareLoader.middlewareCol.fn3).toBe('function');
    expect(pluginMiddlewareLoader.middlewareCol.fn3.name).toBe('fn3');
  });
});

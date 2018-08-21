import { isFunction, isObject } from '../../../src/core/utils/type';

const o = [
  { type: 'string', value: 'foo' },
  { type: 'function', value: () => undefined },
  { type: 'object', value: {} },
  { type: 'number', value: 7 },
];

describe('/test/utils/index.test.ts', () => {

  it('call `isFunction, isObject` with multiple params', () => {
    o.forEach(item => {

      expect(isFunction(item.value)).toBe(item.type === 'function' ? true : false);
      expect(isObject(item.value)).toBe(item.type === 'object' ? true : false);
      return true;
    });
  });
});

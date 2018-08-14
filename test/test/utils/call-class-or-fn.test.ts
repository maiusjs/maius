import callClassOrFn from '../../../src/core/utils/call-class-or-fn';

class DemoClass {
  public args: any[];
  constructor(...args: any[]) {
    this.args = args;
  }
}

function demoFn(...args: any[]) {
  return args;
}

const demoObj = { a : 1 };

describe('call-class-or-fn.ts', () => {

  test('call class', () => {
    const demoClass = callClassOrFn(DemoClass, [1, 2]);
    expect(demoClass.args).toEqual([1, 2]);
  });

  test('call function', () => {
    const demoClass = callClassOrFn(demoFn, [3, 4]);
    expect(demoClass).toEqual([3, 4]);
  });

  test('call illegal format', () => {
    expect(() => {
      callClassOrFn(demoObj);
    }).toThrow('It is not class or function');
  });
});

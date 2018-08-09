import { BaseMiddleware } from '../../../../src/lib/middleware/base';
import MdwOptsModel from '../../../../src/models/mdw-opts-model';

describe('/test/base.test.ts', () => {

  class SuperMiddleware extends BaseMiddleware {
    public getMiddlewareOpts() { return null; }
  }

  test('merge two MdwOptsModel instance', () => {
    const superMdw = new SuperMiddleware(null);

    const opts1 = new MdwOptsModel();
    opts1.name = 'test:one';
    opts1.args = null;
    opts1._filename = './opts1/filename';
    opts1._couldReorder = true;
    const fn1 = opts1.load = () => 1;

    const opts2 = new MdwOptsModel();
    opts2.name = 'test:two';
    opts2.args = ['str', { arg: 1 }, 123];
    opts2._filename = null;
    opts2._couldReorder = false;
    const fn2 = opts2.load = () => 2;

    const newOpts = superMdw.merge(opts1, opts2);

    const expectOpts = new MdwOptsModel();
    expectOpts.name = 'test:one';
    expectOpts.args = ['str', { arg: 1 }, 123];
    expectOpts._filename = './opts1/filename';
    expectOpts._couldReorder = false;
    expectOpts.load = fn2;

    expect(newOpts.load(null)).toBe(2);

    expect(newOpts).toEqual(expectOpts);
  });

  test('passing the wrong type value to merge method', () => {
    const superMdw = new SuperMiddleware(null);

    [
      [1, 1, /arguments\[0\]/],
      ['string', 'string', /arguments\[0\]/],
      [null, null, /arguments\[0\]/],
      [undefined, undefined, /arguments\[0\]/],
      [() => {}, () => {}, /arguments\[0\]/],

      [1, {}, /arguments\[0\]/],
      ['string', {}, /arguments\[0\]/],
      [null, {}, /arguments\[0\]/],
      [undefined, {}, /arguments\[0\]/],
      [() => {}, {}, /arguments\[0\]/],

      [{}, 1, /arguments\[1\]/],
      [{}, 'string', /arguments\[1\]/],
      [{}, null, /arguments\[1\]/],
      [{}, undefined, /arguments\[1\]/],
      [{}, () => {}, /arguments\[1\]/],

    ].forEach(item => {
      expect(() => {
        // console.log(item);
        superMdw.merge(item[0], item[1]);
      }).toThrow(item[2]);
    });
  });
});

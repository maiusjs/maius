// import {Maius} from '../src/maius';
// const Maius = require('../src/maius');

import Maius from '../src/maius';

describe('/test/maius.test.ts', () => {

  it('should throw an error when not passed valid `rootDir`', () => {

    expect(() => {
      new Maius({});  // tslint:disable-line
    }).toThrow();
  });
});

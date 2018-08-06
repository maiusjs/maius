module.exports = {

  // env: 'dev', // prod, dev, test, and others
  middleware: [

    'outer',
    'timing',

    // 'maius:router', // reordered middleware.

    // koa-middleware example with simple example
    'kcors',

    // koa-middleware example with complex args
    {
      name: 'koa-morgan',
      args: [
        'combined',
        {
          skip: function (req, res) {
            return false;
          }
        }
      ],
    },
    {
      name: 'after',
      args: [{
        name: 'nihao'
      }],
    },
  ],

  /**
   * You can set static config by those way below:
   */

  // static: 'public',

  // static: ['public', 'static'],

  // static: [
  //   { root: 'public', opts: { defer: true } },
  //   { root: 'static' },
  // ],
};

module.exports.logger = {
  directory: __dirname + '/../logs',
  level: 'DEBUG',
};

module.exports = {
  middleware: [

    'outer',
    'timing',

    'maius:router', // reordered middleware.

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

    // middleware with `afterRouter` option
    {
      name: 'after',
      args: [{
        name: 'nihao'
      }],
      afterRouter: true,
    },
  ],
  static: { },
  viewEngine: {
    extension: 'ejs',
    viewsDir: 'views',
    engine: 'ejs',
  },
};

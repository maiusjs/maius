module.exports = [
  { handle: 'outer' },
  { handle: 'timing' },
  { handle: require('koa-morgan'),
    args: [ 'combined', {
      skip: function (req, res) {
        return false;
      },
    }],
  },
];

module.exports = [
  { name: 'outer' },
  { name: 'timing' },
  { name: require('koa-morgan'),
    args: [ 'combined', {
      skip: function (req, res) {
        return false;
      },
    }],
  },
];

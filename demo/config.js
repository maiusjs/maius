module.exports = {
  middleware: [
    'outer',
    'timing',
    'maius:router', // reordered middleware.
    {
      name: 'after',
      args: [{name: 'hihao'}],
    },
  ],
  static: { },
};

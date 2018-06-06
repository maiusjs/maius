module.exports = {
  middleware: [
    'outer',
    'timing',
    {
      name: 'after',
      options: { name: 'nihao' },
      afterRouter: true,
    },
  ],
  static: { },
};

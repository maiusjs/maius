export default interface IUserConfig {
  middleware?: (string | {
    name: string,
    args?: any[],
    options?: any,
    afterRouter?: boolean,
  })[];
  static: any;
}

// module.exports = {
//   middleware: [
//     'outer',
//     'timing',
//     {
//       name: 'after',
//       options: { name: 'nihao' },
//       afterRouter: true,
//     },
//   ],
//   static: { },
// };

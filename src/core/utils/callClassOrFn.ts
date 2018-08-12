import { isClass, isFunction } from './type';

export default (filename: string, args: any[] = []): any => {
  const content: any = require(filename);
  let target: any = null;

  if (isFunction(content)) {
    target = content;
  } else if (isFunction(content.default)) {
    target = content.default;
  }

  if (isClass(target)) {
    return new target(...args);
  }

  if (isFunction(target)) {
    return target(...args);
  }

  throw new Error('It is not class or function');
};

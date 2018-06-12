const isSomething = (type): (arg: any) => boolean => {

  return arg => {
    return {}.toString.call(arg) === `[object ${type}]`;
  };
};

export const isFunction = isSomething('Function');
export const isObject = isSomething('Object');
export const isBoolean = isSomething('Boolean');

export const isClass = (cls: any, name?: string): boolean => {
  const reg = new RegExp(`^\\s*class\\s+${name ? name + '\\b' : ''}`);

  return typeof cls === 'function' && reg.test(cls.toString());
};

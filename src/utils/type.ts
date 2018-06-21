const isSomething = (...types: string[]): (arg: any) => boolean => {

  return arg => {
    for (const type of types) {
      if ({}.toString.call(arg) === `[object ${type}]`) {
        return true;
      }
    }
    return false;
  };
};

export const isFunction = isSomething('Function', 'AsyncFunction');
export const isObject = isSomething('Object');
export const isBoolean = isSomething('Boolean');

export const isClass = (cls: any, name?: string): boolean => {
  const reg = new RegExp(`^\\s*class\\s+${name ? name + '\\b' : ''}`);

  return typeof cls === 'function' && reg.test(cls.toString());
};

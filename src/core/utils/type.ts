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

export const isObject = isSomething('Object');

export const isBoolean = isSomething('Boolean');

// export const isFunction = isSomething('Function', 'AsyncFunction');
export const isFunction = (arg: any) => {
  return 'function' === typeof arg;
};

export const isClass = (arg: any, className?: string): boolean => {
  if ('function' !== typeof arg) return false;

  const reg = new RegExp(`^\\s*class\\s+${className ? className + '\\b' : ''}`);

  return typeof arg === 'function' && reg.test(arg.toString());
};


const isSomething = (type): (arg: any) => boolean => {

  return arg => {
    return {}.toString.call(arg) === `[object ${type}]`;
  };
};

export const isFunction = isSomething('Function');
export const isObject = isSomething('Object');

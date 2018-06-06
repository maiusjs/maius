export const isFunction = (fn: () => void): boolean => {
  const str = Object.prototype.toString.call(fn);
  return str === '[object Function]';
};

export const isObject = (fn: () => void): boolean => {
  const str = Object.prototype.toString.call(fn);
  return str === '[object Object]';
};

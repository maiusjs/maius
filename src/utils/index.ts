export const isFunction = (fn: () => void): boolean => {
  const str = Object.prototype.toString.call(fn);
  return str === '[object Function]';
};

export const isObject = (obj: any): boolean => {
  const str = Object.prototype.toString.call(obj);
  return str === '[object Object]';
};

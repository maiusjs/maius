import { isClass, isFunction } from './type';

/**
 * Using it method to call a code thunk, if you dont konw it is a class or function.
 *
 * @param content required file content
 * @param args the class or fn arguments
 * @return return should return
 */
export default function callClassOrFn(content: any, args: any[] = []): any {

  // class must put before isFunction, because class also is function.
  if (isClass(content)) {
    return new content(...args);
  }
  if (isClass(content.default)) {
    return new content.default(...args);
  }

  if (isFunction(content)) {
    return content(...args);
  }
  if (isFunction(content.default)) {
    return content.default(...args);
  }
  throw new Error('It is not class or function');
}

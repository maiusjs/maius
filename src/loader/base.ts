import * as assert from 'assert';
import * as Debug from 'debug';
import * as fs from 'fs';
import * as path from 'path';
import BaseContext from '../lib/base-context';
import Maius from '../maius';
import { isFunction, isObject } from '../utils/type';

const debug = Debug('maius:baseLoader');

/**
 * ServiceLoader and ControllerLoader will extends from BaseLoader.
 *
 * this.getIntancesCol() this a common method for ServiceLoader and
 * ControllerLoader.
 *
 * @class
 */

export default abstract class BaseLoader {
  public path: string;
  public maius: Maius;

  /**
   * @constructor
   * @param options      loader options
   * @param options.path user's target directory path
   */

  constructor(maius: Maius, options: { path?: string }) {
    assert(options.path, 'options.path cannot be ignored');
    this.path = options.path;
    this.maius = maius;
  }

  /**
   * @returns 实例化 options.path 下各个文件的类，并根据其文件名组成一个新的对象。
   * { [filename]: classInstance }
   *
   * @since 0.1.0
   */

  public getIntancesCol(): { [x: string]: BaseContext } {
    const col: any = Object.create({});

    this.getFiles().forEach(item => {
      debug('Loading file: %o', item);

      const UserClass = require(item.path);

      debug('file export: %o', UserClass);

      if (isFunction(UserClass)) {
        col[item.name] = this.wrapClass(UserClass);
      } else if (isObject(UserClass) && isFunction(UserClass.default)) {
        // es6 module
        col[item.name] = this.wrapClass(UserClass.default);
      } else if (isObject(UserClass)) {
        col[item.name] = this.wrapObject(UserClass);
      } else {
        throw new Error(`${item.name}.js is not a class function`);
      }
    });

    return col;
  }

  /**
   * @returns 根据 options.path 读取文件夹下的文件，并返回相关文件信息列表
   *
   * @private
   * @since 0.1.0
   */

  private getFiles(): { name: string, path: string }[] {
    const dir = this.path;
    let list: string[] = null;

    try {
      list = fs.readdirSync(dir);
    } catch (error) {
      debug(`Cannot find "${dir}" directory.`);
      // throw new Error(`Cannot find ${dir} directory.`);
      return [];
    }

    // filter *.js
    const files = list
      // 过滤掉所有非 .js 结尾的文件
      .filter(item => /.*?\.js$/.test(item))
      .map(item => {
        return {
          name: /(.*?)\.js$/.exec(item)[1],
          path: path.join(dir, item),
        };
      });

    return files;
  }

  /**
   * Bind the context for Class to avoid losing context on the router.
   *
   * @param instance Users Controller or Service Class instance.
   */

  private wrapClass(UserClass) {
    const instance = new UserClass(this.maius);
    const bindedMethods: string[] = [];
    let proto = Object.getPrototypeOf(instance);

    while (proto !== Object.prototype) {
      const keys = Object.getOwnPropertyNames(proto);

      debug('wrap class keys array: %o', keys);

      for (const key of keys) {
        if (key === 'constructor') continue;

        // skip getter, setter & non-function properties & already binded props
        const d = Object.getOwnPropertyDescriptor(proto, key);
        if (isFunction(d.value) && bindedMethods.indexOf(key) < 0) {
          debug('pushed key: %s', key);
          bindedMethods.push(key);
          instance[key] = proto[key].bind(instance);
        }
      }

      proto = Object.getPrototypeOf(proto);
    }

    return instance;
  }

  /**
   * Bind the context for Object to avoid losing context on the router.
   *
   * @param obj Users Controller or Service object.
   */

  private wrapObject(obj) {
    const keys = Object.keys(obj);

    debug('wrap object keys array: %o', keys);

    for (const key of keys) {
      if (isFunction(obj[key])) {
        obj[key] = obj[key].bind(obj);
      } else if (isObject(obj[key])) {
        this.wrapObject(obj[key]);
      }
    }

    return obj;
  }
}

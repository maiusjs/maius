import * as assert from 'assert';
import * as Debug from 'debug';
import * as fs from 'fs';
import * as path from 'path';
import BaseContext from '../lib/base-context';
import FileItemModel from '../models/loader/file-item-model';
import { isFunction, isObject } from '../utils/index';

const debug = Debug('maius:baseLoader');

export default abstract class BaseLoader {
  public path: string;

  /**
   * @param options      loader options
   * @param options.path user's target directory path
   */

  constructor(options: { path?: string }) {
    assert(options.path, 'options.path cannot be ignored');
    this.path = options.path;
  }

  /**
   * @returns 实例化 options.path 下各个文件的类，并根据其文件名组成一个新的对象。
   * { [filename]: classInstance }
   *
   * @since 0.1.0
   */

  public getIntancesCol(): { [x: string]: BaseContext } {
    const col = {};

    this.getFiles().forEach(item => {
      const UserClass = require(item.path);

      if (isFunction(UserClass)) {
        col[item.name] = new UserClass();
      } else if (isObject(UserClass)) {
        col[item.name] = UserClass;
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

  protected getFiles(): FileItemModel[] {
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
        const fileItem = new FileItemModel();
        fileItem.name = /(.*?)\.js$/.exec(item)[1];
        fileItem.path = path.join(dir, item);
        return fileItem;
      });

    return files;
  }
}

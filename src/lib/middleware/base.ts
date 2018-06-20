import * as assert from 'assert';
import Maius from '../../maius';
import MdwOptsModel from '../../models/mdw-opts-model';
import { isBoolean, isFunction, isObject } from '../../utils/type';

/**
 * All internal middleware must to be extended from this class.
 */
export abstract class BaseMiddleware {
  protected maius: Maius;

  constructor(maius: Maius) {
    this.maius = maius;
  }

  /**
   * @returns MdwOptsModel instance.
   */

  public abstract getMiddlewareOpts(opts?: MdwOptsModel): typeof opts;

  /**
   * Combine two Middleware Options Model.
   */

  public merge (source: MdwOptsModel, target: typeof source): typeof source {
    assert(isObject(source), 'arguments[0] must be ConfigMiddlewareItemModel instance');
    assert(isObject(target), 'arguments[1] must be ConfigMiddlewareItemModel instance');

    const opts = new MdwOptsModel();

    opts.name = source.name;
    opts.args = target.args || source.args;
    opts._filename = target._filename || source._filename;

    opts._couldReorder = isBoolean(target._couldReorder) ?
      target._couldReorder :
      source._couldReorder;

    opts.load = isFunction(target.load) ?
      target.load :
      source.load;

    return opts;
  }
}

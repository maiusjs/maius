import Application from '../lib/application';

export default class MdwOptsModel {
  public args?: any[];
  public name: string;
  public load?: (app: Application) => any;
  // tslint:disable-next-line:variable-name
  public _couldReorder?: boolean;
  // tslint:disable-next-line:variable-name
  public _filename?: string;

  constructor() {
    this.args = null;
    this.name = null;
    this.load = null;
    this._couldReorder = null;
    this._filename = null;
  }
}
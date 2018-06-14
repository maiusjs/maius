import Application from '../lib/application';
export default class MdwOptsModel {
    args?: any[];
    name: string;
    load?: (app: Application) => any;
    _couldReorder?: boolean;
    _filename?: string;
    constructor();
}

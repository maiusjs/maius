import BaseContext from '../lib/base-context';
import FileItemModel from '../models/loader/file-item-model';
export default abstract class BaseLoader {
    path: string;
    constructor(options: {
        path?: string;
    });
    getIntancesCol(): {
        [x: string]: BaseContext;
    };
    protected getFiles(): FileItemModel[];
}

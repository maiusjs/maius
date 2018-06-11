import FileItemModel from '../models/loader/file-item-model';
import BaseContext from '../lib/base-context';
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

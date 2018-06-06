import Maius from '../maius';
interface IOptions {
    path: string;
}
interface IFileItem {
    name: string;
    path: string;
}
export default class BaseLoader {
    path: string;
    maius: Maius;
    private files;
    constructor(options: IOptions);
    getIntancesCol<T>(): {
        [x: string]: T;
    };
    protected getFiles(): IFileItem[];
}
export {};

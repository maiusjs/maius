import Maius from '../../maius';
import BaseContext from '../lib/base-context';
export default abstract class ClassLoader {
    path: string;
    maius: Maius;
    constructor(maius: Maius, options: {
        path?: string;
    });
    getIntancesCol(): {
        [x: string]: BaseContext;
    };
    private getFiles;
    private wrapClass;
    private wrapObject;
}

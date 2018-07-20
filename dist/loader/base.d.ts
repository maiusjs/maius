import BaseContext from '../lib/base-context';
import Maius from '../maius';
export default abstract class BaseLoader {
    path: string;
    maius: Maius;
    constructor(maius: Maius, options: {
        path?: string;
    });
    getIntancesCol(): {
        [x: string]: BaseContext;
    };
    protected getFiles(): {
        name: string;
        path: string;
    }[];
    private wrapClass;
    private wrapObject;
}

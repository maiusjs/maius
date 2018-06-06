import BaseLoader from './base';
export default class ControllerLoader extends BaseLoader {
    getIntancesCol<T>(): {
        [x: string]: T;
    };
}

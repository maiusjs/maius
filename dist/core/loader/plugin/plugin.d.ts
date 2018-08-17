import Maius from '../../../maius';
import { IConfig } from '../config';
export default class PluginLoader {
    private app;
    private lookArray;
    constructor(app: Maius);
    loadInteralPlugin(): void;
    loadExternalPlugin(): void;
    loadPlugin(configList: IConfig['plugin']): void;
    private lookupPath;
    private find;
    private lookupProjectRoot;
}

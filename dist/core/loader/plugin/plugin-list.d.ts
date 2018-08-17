import Maius from '../../../maius';
import { IPluginOptions } from './plugin-one';
export interface IPluginItem {
    dirname: string;
    config: IPluginOptions;
}
export default class PluginListLoader {
    appConfig: object;
    private app;
    private pluginList;
    constructor(app: Maius, pluginList: IPluginItem[]);
    load(): void;
    private mergeConfig;
}

import * as fs from 'fs';
import * as path from 'path';
import Maius from '../maius';

export default class PluginLoader {
  private app: Maius;

  constructor(app) {
    this.app = app;
  }

  private pluginFolderList() {
    const rootDir = this.app.options.rootDir;

    try {
      const list = fs.readdirSync(path.join(rootDir, 'plugin'));
    } catch (error) {
      return;
    }
  }
}

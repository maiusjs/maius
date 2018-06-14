import IUserConfig from '../interface/i-user-config';
import IUserOptions from '../interface/i-user-options';
export default class UserConfigLoader {
    static create(options: IUserOptions): UserConfigLoader;
    static getIntance(): UserConfigLoader;
    private static instance;
    options: IUserOptions;
    config: IUserConfig;
    private constructor();
    private getConfig;
}

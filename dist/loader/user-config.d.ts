import IUserConfig from '../interface/i-user-config';
import IUserOptions from '../interface/i-user-options';
export default class UserConfigLoader {
    options: IUserOptions;
    constructor(options: IUserOptions);
    readonly config: IUserConfig;
}

import Maius, { MaiusContext } from '../../maius';
export default class BaseContext {
    baseConstructor: typeof BaseContext;
    app: Maius;
    ctx: MaiusContext;
    constructor(maius: Maius);
    readonly controller: {
        [x: string]: BaseContext;
    };
    readonly service: {
        [x: string]: BaseContext;
    };
    readonly httpClient: import("../../../node_modules/axios/index").AxiosStatic;
}

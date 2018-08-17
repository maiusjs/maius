"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serve = require("koa-static");
const path = require("path");
class MaiusStatic {
    constructor(app, options) {
        this.app = app;
        this.options = options;
        this.useMiddleware();
    }
    useMiddleware() {
        if (!Array.isArray(this.options.options)) {
            console.warn('Expect an array as the options.options, but got a', typeof this.options.options);
            return;
        }
        const opts = this.options.options;
        for (let i = 0; i < opts.length; i += 1) {
            const item = opts[i];
            let root;
            let options;
            if ('string' === typeof item) {
                root = path.isAbsolute(item)
                    ? item
                    : path.join(this.app.options.rootDir, item);
            }
            else {
                root = item.root;
                options = item.options;
            }
            this.app.use(serve(root, options));
        }
    }
}
exports.default = MaiusStatic;

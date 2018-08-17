"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const koaViews = require("koa-views");
const path = require("path");
const type_1 = require("../../../core/utils/type");
module.exports = function maiusView(options, app) {
    const view = app.config.view;
    const root = view && 'string' === typeof view.root
        ? view.root
        : path.join(app.options.rootDir, 'view');
    const opts = view && type_1.isObject(view.options)
        ? view.options
        : { extension: 'ejs', map: { ejs: 'ejs' } };
    return koaViews(root, opts);
};

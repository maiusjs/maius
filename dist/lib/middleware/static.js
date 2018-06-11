"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serve = require("koa-static");
const maiusStatic = (staticPath, opts) => serve(staticPath, opts);
exports.default = maiusStatic;

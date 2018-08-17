"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const Debug = require("debug");
const fs = require("fs");
const koaViews = require("koa-views");
const path = require("path");
const user_config_1 = require("../../loader/user-config");
const mdw_opts_model_1 = require("../../models/mdw-opts-model");
const type_1 = require("../../utils/type");
const base_1 = require("./base");
const debug = Debug('maius:viewsMiddlware');
class Static extends base_1.BaseMiddleware {
    constructor(maius) {
        super(maius);
        this.userConfig = user_config_1.default.getIntance().config;
        this.userOptions = user_config_1.default.getIntance().options;
        this.supportMap = new Map([
            ['ejs', { engine: 'ejs', extension: 'ejs', dir: 'views' }],
            ['nunjucks', { engine: 'nunjucks', extension: 'html', dir: 'views' }],
        ]);
        this.viewsConfig = this.makeViewsConfig();
    }
    getMiddlewareOpts(opts) {
        const cfg = new mdw_opts_model_1.default();
        cfg.name = 'maius:views';
        cfg._couldReorder = true;
        const userCustomFilter = this.getUserCustomFliter();
        const options = this.viewsConfig;
        debug('views-options-b: o%', options);
        debug('views-options-b: o%', userCustomFilter);
        if (userCustomFilter != null) {
            options.options = Object.assign({}, options.options, userCustomFilter);
        }
        const test = {
            dir: 'views',
            extension: 'ejs',
            options: {
                helpers: {
                    domain: '',
                    relativeTime: '',
                    stringLength: '',
                },
                map: { ejs: 'ejs' },
            },
        };
        debug('views-options-a: o%', options);
        cfg.load = app => app.use(koaViews(this.viewsDir(), options.options));
        const iopts = type_1.isObject(opts) ? opts : new mdw_opts_model_1.default();
        return this.merge(cfg, iopts);
    }
    getUserCustomFliter() {
        const rootDir = this.maius.options.rootDir;
        const flieName = 'filter';
        const ext = '.js';
        const fullFileName = `${flieName}${ext}`;
        const filterDir = `${rootDir}/extend`;
        if (!fs.existsSync(filterDir) ||
            !fs.existsSync(`${filterDir}/${fullFileName}`)) {
            debug('no filter file found');
            return null;
        }
        const fliterObj = require(`${filterDir}/${fullFileName}`);
        const obj = {
            options: {
                helpers: {},
            },
        };
        Object.keys(fliterObj).forEach(key => {
            obj.options.helpers[key] = fliterObj[key];
        });
        return obj;
    }
    viewsDir() {
        return path.join(this.userOptions.rootDir, this.viewsConfig.dir);
    }
    makeViewsConfig() {
        const userConfig = this.userConfig.views;
        const engine = (userConfig && userConfig.engine) || 'ejs';
        const config = this.supportMap.get(engine);
        assert(config, 'The framework did not found the view engine you want to use, ' +
            'you can use these view engine: ' +
            [...this.supportMap.keys()].map(item => `"${item}"`).join(', '));
        config.dir = (userConfig && userConfig.dir) || config.dir;
        config.extension = (userConfig && userConfig.extension) || config.extension;
        const newConfig = {
            dir: config.dir,
            options: {
                extension: config.extension,
                map: {
                    [config.extension]: engine,
                },
            },
        };
        debug('engineConfig %o', newConfig);
        return newConfig;
    }
}
exports.default = Static;

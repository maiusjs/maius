

项目正在规划中, 以下 TODO 中的条目会随着项目的推进而演进式变化.

### framework core

- [x] controller 和 service 的 this 指向问题
- [ ] controller 和 service 可以递归的加载多层级的文件夹
- [x] ServiceLoader 对非 Class Function 的支持

- [x] maius 支持 plugin
    - 结构
        - plugin.js
        - middleware/
        - config/
- [x] maius-static 实现静态资源服务
- [x] ~~maius-static 中间件在洋葱模型中的位置可以通过配置来调整~~

- [x] 增强 config 的配置
  - [x] 支持不同环境下加载不同 config (eg: config/env/production)
  - [x] 多文件的 config (eg: config/view.js 等效于 config/config.js 中的 view 字段)
  - [x] 配置优先级: env > singlefile > config/config.js
  - [x] 兼容 config.js 的配置方式。且 config.js 配置方式的优先级最高

- [x] 怎么配置 node_modules 中的 middleware ( name 支持 function 类型)
- [ ] config.middleware[x].name 可以通过 string 类型的值来加载 node_modules 里面的模块
- [ ] 直接引用的 middleware 和 plugin 中的 middleware 之间如何自定义的调整加载顺序
- [ ] config.middleware 中 name 字段支持直接通过字符串来搜索 node_modules 下面的包

- [ ] 支持 extend
- [ ] plugin 支持 extend

- [ ] router.js 变更路由配置方法（同时保留原来的配置方法）

    ```js
    module.exports = [
        { match: '/', handle: 'home.info' },
        { match: '/user/:id', handle: ['user.verify', 'user.home'] }
    ]
    ```

- [ ] demo 和 core 分离. (待项目core 部分稳定后再开展)
- [ ] Error Handling.
- [ ] 语义化的错误描述

### framework extend

- [ ] Restful API generator
- [ ] model layer
- [ ] template layer
- [ ] logger

### performance, testing

- [ ] benchmark
- [ ] unit test

### cli tool

- [x] init: 根据模板快速创建项目
- [ ] create: 集成常用命令, 例如快速创建 controller 等.
- [ ] dev: 开发相关支持
- [ ] build: 打包相关

### examples

- [x] hackernews
- [x] hackernews-ts
- [ ] hackernews-ts-di

### Planning, Ideas

- [x] 框架直接支持 TS 语言开发（后期考虑）
- [ ] plugin 机制, 需要先想清楚它的使用场景. 它的价值和要解决的问题.

### 一些 config 配置的问题

#### plugin 与 config

根据 config 中的 plugin.name 来查找插件目录，查找顺序如下

```ts
const APP_PATH = this.app.options.rootDir;
const APP_PROJECT_ROOT = this.lookupProjectRoot(APP_PATH);
const MAIUS_INTERNAL_PLUGIN_PATH = path.resolve(__dirname, '../../../plugin');
const MAIUS_PROJECT_ROOT = this.lookupProjectRoot(path.resolve(__dirname));

// finding the plugin directory in the following order.
this.lookArray = [
    path.join(APP_PATH, 'plugin'),
    path.join(APP_PROJECT_ROOT, 'node_modules'),
    path.join(MAIUS_INTERNAL_PLUGIN_PATH),
    path.join(MAIUS_PROJECT_ROOT, 'node_modules'),
];
```

因此需要避免和其他插件重名

#### middleware 与 config

middleware 加载顺序和 config 配置之间的关系：

目前按照下列顺序加载：

1. Maius 自带插件中的中间件
2. 用户配置的插件中的中间件
3. 用户配置的中间件

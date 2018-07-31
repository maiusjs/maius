

项目正在规划中, 以下 TODO 中的条目会随着项目的推进而演进式变化.

#### framework core

- [x] controller 和 service 的 this 指向问题
- [ ] controller 和 service 可以递归的加载多层级的文件夹
- [x] public 静态资源文件夹
- [x] ServiceLoader 对非 Class Function 的支持
- [x] maius-static 中间件在洋葱模型中的位置可以通过配置来调整
- [x] 怎么配置 node_modules 中的 middleware
- [x] 增强 config 的配置
  - [x] 支持不同环境下加载不同 config (eg: config/env/production)
  - [x] 多文件的 config (eg: config/view.js 等效于 config/config.js 中的 view 字段)
  - [x] 配置优先级: env > singlefile > config/config.js
  - [x] 兼容 config.js 的配置方式。且 config.js 配置方式的优先级最高
- [ ] maius 支持 plugin
    - 结构
        - service
        - middleware
        - config
        - extend (application, context, response, request)
- [ ] MAIUS_ENV NODE_ENV


- [ ] demo 和 core 分离. (待项目core 部分稳定后再开展)
- [ ] Error Handling.
- [ ] 语义化的错误描述

#### framework extend

- [ ] Restful API generator
- [ ] model layer
- [ ] template layer
- [ ] logger

#### performance, testing

- [ ] benchmark
- [ ] unit test

#### cli tool

- [x] init: 根据模板快速创建项目
- [ ] create: 集成常用命令, 例如快速创建 controller 等.
- [ ] dev: 开发相关支持
- [ ] build: 打包相关

#### examples

- [x] hackernews
- [x] hackernews-ts
- [ ] hackernews-ts-di

#### Planning, Ideas

- [x] 框架直接支持 TS 语言开发（后期考虑）
- [ ] plugin 机制, 需要先想清楚它的使用场景. 它的价值和要解决的问题.

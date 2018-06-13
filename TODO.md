

项目正在规划中, 以下 TODO 中的条目会随着项目的推进而演进式变化.

#### framework core

- [x] controller 和 service 的 this 指向问题
- [ ] controller 和 service 可以递归的加载多层级的文件夹
- [x] public 静态资源文件夹
- [x] ServiceLoader 对非 Class Function 的支持
- [x] maius-static 中间件在洋葱模型中的位置可以通过配置来调整
- [x] 怎么配置 node_modules 中的 middleware
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

- [ ] hackernews

#### Planning, Ideas
- [ ] 框架直接支持 TS 语言开发（后期考虑）
- [ ] plugin 机制, 需要先想清楚它的使用场景. 它的价值和要解决的问题.

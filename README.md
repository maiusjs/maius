# Maius

[![Build Status](https://travis-ci.org/maiusjs/maius.svg?branch=master)](https://travis-ci.org/maiusjs/maius)

A framework for nodejs

<a id="markdown-目录" name="目录"></a>
## 目录

<!-- TOC depthFrom:2 -->

- [目录](#目录)
- [使用](#使用)
    - [项目结构](#项目结构)
    - [app.js 入口](#appjs-入口)
    - [router.js 路由](#routerjs-路由)
    - [controller 控制器](#controller-控制器)
    - [service 服务](#service-服务)
    - [middleware 中间件](#middleware-中间件)
        - [自定义一个中间件](#自定义一个中间件)
            - [1. 在 `middleware/` 文件夹下创建自定义中间件](#1-在-middleware-文件夹下创建自定义中间件)
            - [2. 加载中间件](#2-加载中间件)
        - [使用 npm 现有的中间件](#使用-npm-现有的中间件)
    - [模板引擎](#模板引擎)
        - [支持自定义模板引擎过滤器](#支持自定义模板引擎过滤器)
            - [使用步骤：](#使用步骤)
    - [资源文件夹](#资源文件夹)
- [CLI 工具](#cli-工具)
- [Contribute](#contribute)
    - [本地开发](#本地开发)
    - [打包生产环境代码](#打包生产环境代码)

<!-- /TOC -->

<a id="markdown-使用" name="使用"></a>
## 使用

<a id="markdown-项目结构" name="项目结构"></a>
### 项目结构

```
.
├── controller  # 控制器目录
├── service     # 服务层目录
├── middleware  # 中间件目录
├── public      # 静态资源目录
├── views       # 视图模板目录
|
├── app.js      # 项目入口
├── config.js   # maius 配置文件
└── router.js   # 路由
```

<a id="markdown-appjs-入口" name="appjs-入口"></a>
### app.js 入口

```js
// app.js

const Maius = require('maius');

const app = new Maius({
  rootDir: __dirname,
  port: 3123,
});

app.listen().then(() => {
  console.log('http://localhost:3123');
});
```

<a id="markdown-routerjs-路由" name="routerjs-路由"></a>
### router.js 路由

- 在 `router.js` 文件中定义 router

```js
// router.js

module.exports = ({ router, controller }) => {
  // 用户访问 '/' 路由时，controller/home.js 文件中的 hello 方法就会去处理请求
  router.get('/', controller.home.hello);

  router.post('/article', controller.home.postArticle);

  router.put('/article', controller.home.putArticle);

  router.patch('/article', controller.home.patchArticle);

  router.del('/article', controller.home.delArticle);
};
```

- 在 `controller/` 文件夹下实现 controller

```js
// controller/home.js

module.exports = class HomeController extends Controller {
  async hello(ctx, next) {
    ctx.body = 'hello world';
  }
  async others() {
    //...
    //...
  }
}
```


router 的详细 API 可以参考[这里](https://github.com/alexmingoia/koa-router#api-reference)


<a id="markdown-controller-控制器" name="controller-控制器"></a>
### controller 控制器

- 在 `controller/` 文件夹下实现 controller

- 通过 `this.service` 来调用在 `service/` 下实现的服务

```js
// controller/home.js

const { Controller } = require('maius');

module.exports = class HomeController extends Controller {
  async hello(ctx, next) {
    ctx.body = 'hello world';
  }

  async number(ctx, next) {
    // 调用 service 下的服务
    const number = await this.service.home.number(10);
    ctx.body = number;
  }
};
```

`controller` 文件夹下的全部 controller 类都会被自动实例化并挂载到一个对象上，并最终作为参数传递到 `router.js` 文件中。

比如：

```js
module.exports = ({ router, controller }) => {
  // 用户访问 '/' 路由时，controller/home.js 文件中的 hello 方法就会去处理请求
  router.get('/', controller.home.hello);
};
```

`controller.home.hello` 就等于 `controller/home.js` 类文件下的 `hello` 方法。

<a id="markdown-service-服务" name="service-服务"></a>
### service 服务

- 在 `service/` 文件夹下实现 service

```js
// service/home.js

const { Service } = require('maius');

module.exports = class HomeService extends Service {
  async number(num) {
    return num + 100;
  }
};
```

- 在 controller 中通过 `this.service` 来调用 service 服务

```js
// controller/home.js

module.exports = class HomeController extends Controller {
  async number(ctx, next) {
    // 调用了 service/home.js 下的服务
    const number = await this.service.home.number(10);
    ctx.body = number;
  }
};
```

<a id="markdown-middleware-中间件" name="middleware-中间件"></a>
### middleware 中间件

Maius 也是基于 Koa 的洋葱模型来实现中间件的，同时也完美兼容 Koa 的中间件。

<a id="markdown-自定义一个中间件" name="自定义一个中间件"></a>
#### 自定义一个中间件

<a id="markdown-1-在-middleware-文件夹下创建自定义中间件" name="1-在-middleware-文件夹下创建自定义中间件"></a>
##### 1. 在 `middleware/` 文件夹下创建自定义中间件

下面我们来实现一个简单的 log 中间件，用于展示程序处理每次请求所消耗的时间：

```js
// middleware/log.js

/*
 * options 是中间件的可传入参数。
 *
 * ctx 参数是一个对象，它会在每一次请求的开始被创建，然后整个由
 * 中间件组成的洋葱模型中传递一个来回。通常我们可以在上面挂载一些
 * 属性，以供之后的中间件使用。
 *
 * next 参数是一个方法，当被调用时，会去按顺序执行下层的中间件。
 */
module.exports = options => async (ctx, next) => {
  const start = Date.now();
  await next();
  console.log(`time: ${Date.now() - start}ms`);
};
```

<a id="markdown-2-加载中间件" name="2-加载中间件"></a>
##### 2. 加载中间件

在 `config.js` 文件中配置中间件加载的位置以及相关参数。

对于这个 log 中间件，我们需要将其放置在洋葱模型的最外层。

```js
// config.js

module.exports = {
  /**
   * 依赖于 Koa 的洋葱模型，中间件将根据下面的先后顺序从外层至内层的开始的包裹。
   *
   * 有两种加载模式
   * 1. 可以直接写 middleware 对应的文件名，来进行简洁的中间件加载
   * 2. 或者通过一个对象进行详细配置。
   */
  middleware: [
    'log', // log 中间件将被包裹在洋葱模型的较外层

    {
      name: 'cors', // 中间件对应的文件名
      args: [{ name: 'maius' }] // 该数组的每一项将会按顺序传递给中间件
    },

    // 下面是最自由的一种加载方式，通过 load 函数，使用 app.use 去手动挂载中间件
    {
      name: 'error',
      load(app) {
          app.use(customMiddleware());
      },
    }
  ],
};
```

至此，log 中间件就算是大功告成了。

<a id="markdown-使用-npm-现有的中间件" name="使用-npm-现有的中间件"></a>
#### 使用 npm 现有的中间件

下面使用 `koa-bodyparser` 中间件来举例

```js
// config.js
module.exports = {
  middleware: [
    'log', // log 中间件将被包裹在洋葱模型的较外层

    // 通过 require.resolve 配置中间件的绝对路径即可
    require.resolve('koa-bodyparser');
  ],
};
```

<a id="markdown-模板引擎" name="模板引擎"></a>
### 模板引擎

```js
// config.js

module.exports = {
   /**
    * { engine } 配置使用的模板引擎
    * { extension } 配置模板引擎文件扩展名
    * { viewsDir } 配置模板引擎文件的目录
    */

   viewEngine: {
    extension: 'ejs',
    viewsDir: 'views',
    engine: 'ejs',
  },
};

```

<a id="markdown-支持自定义模板引擎过滤器" name="支持自定义模板引擎过滤器"></a>
#### 支持自定义模板引擎过滤器

<a id="markdown-使用步骤" name="使用步骤"></a>
##### 使用步骤：

1. 项目目录下新建`extend`文件夹
2. `extend`文件夹下新建`filter.js`
   ```js
   // extend.js
    exports.stringLength = (str) => str.length;
   ```
3. 模板中使用
   ```ejs
    <%=helpers.stringLength('maius')%>
   ```

<a id="markdown-资源文件夹" name="资源文件夹"></a>
### 资源文件夹

Maius 默认将 `public/` 文件夹作为资源文件夹。 你可以在 `config.js` 中增加 static 属性来更改默认配置。

```js
// config.js

module.exports = {
  /**
   * 有三种方式来配置 static 属性
   */

  // 将 Maius 项目根路径下的 public 作为静态资源文件夹
  static: 'public',

  // 通过数组可以配置多个静态资源文件夹
  static: ['public', 'static'],

  // 也可以在数组中传入对象，进行进一步的配置
  static: [
    { root: 'public' },
    { root: 'static', opts: { defer: true } },
  ],
};
```

<a id="markdown-cli-工具" name="cli-工具"></a>
## CLI 工具

- [maius-cli](https://github.com/maiusjs/maius-cli)


<a id="markdown-contribute" name="contribute"></a>
## Contribute

<a id="markdown-本地开发" name="本地开发"></a>
### 本地开发

```
npm run dev
```

<a id="markdown-打包生产环境代码" name="打包生产环境代码"></a>
### 打包生产环境代码

```
npm run build
```

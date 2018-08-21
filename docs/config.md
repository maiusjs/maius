# Configurations of Maius

## static

- `config/static.js`

```js
module.export = [
    'public', // base on app root directory
    { root: 'public', options: {} } // same as koa-static
];
```

## view

- `config/view.js`


```js
// same as koa-views
module.export = {};
```

## logger

- `config/logger.js`

```js
module.export = {
  directory: 'logs', // base on app root directory
  level: 'DEBUG', // log level
}
```

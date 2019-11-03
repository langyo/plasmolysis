# Node.js 跨平台客户端与服务端的轻量级同源异构框架

该框架皆在探索客户端与服务端一体化开发的可能性——网站与本地应用的大部分 UI 构建使用同一份源码，客户端与服务端（B/S 或 C/S）间的数据库对接均使用同一份配置文件性质的源码（换句话讲，客户端的发包、接包与服务端的监听、读写数据库是写在同一份源码中的，由框架自动将其展开），以及再不同平台环境下对项目的正确转译、打包等。

使用的框架：

| 用户界面 | Material-UI / MDI |
| 客户端渲染 | React / Redux |
| 服务端渲染 | Next.js / Express |
| 数据库 | Mongoose |
| 转译器 | Babel / Webpack / Uglifyjs |
| 本地客户端 | Electron / Miniblink / Cordova |
| 集成测试 | Jest / TravisCI |

源取材于本人所写的晨检系统。

DEMO:

```javascript
handleEvent(<actionName>)
  .updateState((state, payload) => ({...}))
  .send(opinionObj, state => ({...}))
  .route(path, opinionObj)
  .handleRequest((res, req, global, callback) => {...})
  .updateState((state, payload) => ({...}))
  .dispatch(<actionName>);
```

// At the server side, it must remove the css files' reference.
// Otherwise, the function 'renderToString' will throw the error.
// require('css-modules-require-hook/preset')({
//   generateScopedName: '[name]__[local]__[hash:base64:5]',
//   extensions: ['.scss', '.sass', '.less']
// });
// // It also must remove the assets files' reference.
// require('asset-require-hook')({
//   extensions: ['.png', '.apng', '.jpg', '.jpeg', '.gif', '.ico']
// });

// Import the server libraries.
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import { configure, connectLogger, getLogger, levels } from 'log4js';
import { json as bodyParserJsonify } from 'body-parser';
import cookieParser from 'cookie-parser'
import { express as userAgentParser } from 'express-useragent';

import ReactDomServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { resolve } from 'path';

// Create the child process.
import { exec } from 'child_process';
exec(`cross-env WORKDIR=${workDirPath} babel-node ${resolve(__dirname, 'packagerSSR.js')}`, (err, stdout, stderr) => {
  if (err) console.error('[SSR packager ERR]', err);
  if (stdout) console.log('[SSR packager OUT]', stdout);
  if (stderr) console.error('[SSR packager ERR]', stderr);
});
exec(`cross-env WORKDIR=${workDirPath} babel-node ${resolve(__dirname, 'packagerSPA.js')}`, (err, stdout, stderr) => {
  if (err) console.error('[SPA packager ERR]', err);
  if (stdout) console.log('[SPA packager OUT]', stdout);
  if (stderr) console.error('[SPA packager ERR]', stderr);
});
exec(`cross-env WORKDIR=${workDirPath} babel-node ${resolve(__dirname, 'staticPackager.js')}`, (err, stdout, stderr) => {
  if (err) console.error('[Static packager ERR]', err);
  if (stdout) console.log('[Static packager OUT]', stdout);
  if (stderr) console.error('[Static packager ERR]', stderr);
});

const port = parseInt(process.env.PORT, 10) || 80;
const dev = process.env.NODE_ENV !== 'production';

import { createServer, context } from './services';

import workDirPath from '../utils/workDirPath';
import scanDir from 'klaw-sync';
import { create as createWatcher } from 'watchr';

import { EventEmitter } from 'events';
let staticPackagerReadyEmitter = new EventEmitter();
staticPackagerReadyEmitter.once('ready', () => {
  exec(`babel-node ${resolve(__dirname, 'packagerSSR.js')}`, (err, stdout, stderr) => {
    if (err) console.error('[SSR packager ERR]', err);
    if (stdout) console.log('[SSR packager OUT]', stdout);
    if (stderr) console.error('[SSR packager ERR]', stderr);
  });
  exec(`babel-node ${resolve(__dirname, 'packagerSPA.js')}`, (err, stdout, stderr) => {
    if (err) console.error('[SPA packager ERR]', err);
    if (stdout) console.log('[SPA packager OUT]', stdout);
    if (stderr) console.error('[SPA packager ERR]', stderr);
  });
});
exec(`babel-node ${resolve(__dirname, 'staticPackager.js')}`, (err, stdout, stderr) => {
  if (err) console.error('[Static packager ERR]', err);
  if (stdout) {
    staticPackagerReadyEmitter.emit('ready');
    console.log('[Static packager OUT]', stdout);
  }
  if (stderr) console.error('[Static packager ERR]', stderr);
});

// Watch the files' change.
let configs = require(resolve(workDirPath, 'nickel.config.js')).default;
let components = {
  views: scanDir(resolve(workDirPath, 'components/views')).reduce((obj, { path }) => ({
    ...obj,
    [path.substr(resolve(workDirPath, 'components/views').length + 1, path.lastIndexOf('.') - resolve(workDirPath, 'components/views').length - 1).split(/[\\\/]/).join('.')]: require(path).default
  }), {}),
  pages: scanDir(resolve(workDirPath, 'components/pages')).reduce((obj, { path }) => ({
    ...obj,
    [path.substr(resolve(workDirPath, 'components/pages').length + 1, path.lastIndexOf('.') - resolve(workDirPath, 'components/pages').length - 1).split(/[\\\/]/).join('.')]: require(path).default
  }), {}),
  models: scanDir(resolve(workDirPath, 'components/models')).reduce((obj, { path }) => ({
    ...obj,
    [path.substr(resolve(workDirPath, 'components/models').length + 1, path.lastIndexOf('.') - resolve(workDirPath, 'components/models').length - 1).split(/[\\\/]/).join('.')]: require(path).default
  }), {})
}
let controllers = {
  views: scanDir(resolve(workDirPath, 'controllers/views')).reduce((obj, { path }) => ({
    ...obj,
    [path.substr(resolve(workDirPath, 'controllers/views').length + 1, path.lastIndexOf('.') - resolve(workDirPath, 'controllers/views').length - 1).split(/[\\\/]/).join('.')]: require(path).default
  }), {}),
  pages: scanDir(resolve(workDirPath, 'controllers/pages')).reduce((obj, { path }) => ({
    ...obj,
    [path.substr(resolve(workDirPath, 'controllers/pages').length + 1, path.lastIndexOf('.') - resolve(workDirPath, 'controllers/pages').length - 1).split(/[\\\/]/).join('.')]: require(path).default
  }), {}),
  models: scanDir(resolve(workDirPath, 'controllers/models')).reduce((obj, { path }) => ({
    ...obj,
    [path.substr(resolve(workDirPath, 'controllers/models').length + 1, path.lastIndexOf('.') - resolve(workDirPath, 'controllers/models').length - 1).split(/[\\\/]/).join('.')]: require(path).default
  }), {}),
  global: require(resolve(workDirPath, 'controllers/global.js')).default
};
let actions = scanDir(resolve(__dirname, '../actions')).reduce((obj, { path }) => ({
  ...obj,
  [path.substr(resolve(__dirname, '../actions').length + 1, path.lastIndexOf('.') - resolve(__dirname, '../actions').length - 1).split(/[\\\/]/).join('.')]: require(path)
}), {});

let stalkers = [
  createWatcher(resolve(workDirPath, 'controllers')).on('change', (type, fullPath) => {
    const rootPath = resolve(workDirPath, 'controllers');
    const pathArr = fullPath.substr(rootPath.length + 1).split(/[\/\\]/);

    // Filter unused folders and files.
    if (['views', 'pages', 'models', 'global.js'].indexOf(pathArr[0]) < 0) return;

    switch (type) {
      case 'create':
      case 'update':
        components[pathArr[0]][pathArr.splice(1).join('.')] = require(fullPath).default;
        break;
      case 'delete':
        delete components[pathArr[0]][pathArr.splice(1).join('.')];
        break;
    }
  }),
  createWatcher(resolve(__dirname, '../actions')).on('change', (type, fullPath) => {
    const rootPath = resolve(__dirname, '../actions');
    const path = fullPath.substr(rootPath.length + 1).split(/[\/\\]/).join('.');

    switch (type) {
      case 'create':
      case 'update':
        actions[path] = require(fullPath);
        break;
      case 'delete':
        delete actions[path];
        break;
    }
  }),
  createWatcher(resolve(workDirPath, 'nickel.config.js')).on('change', type => {
    if (type === 'delete') throw new Error('You must provide a configuration file.');
    configs = require(resolve(workDirPath, 'nickel.config.js'));
  })
];
process.on('close', () => stalkers.forEach(e => e.close()));

// Create the server.
const server = express();

server.use(helmet());
server.use(compression());

console.log('Now it is in the', dev ? 'development' : 'production', 'mode.');
if (!dev) {
  configure({
    appenders: {
      out: { type: 'stdout' },
      app: { type: 'file', filename: +(new Date()) + '.log' }
    },
    categories: {
      default: { appenders: ['out', 'app'], level: 'debug' }
    }
  });
  server.use(connectLogger(getLogger('normal'), { level: levels.INFO }));
}

server.use('/static', express.static(resolve(workDirPath, 'static'), {
  maxAge: '1t',
  immutable: true
}));

// Create the middlewares.
server.use(bodyParserJsonify());
server.use(cookieParser());
server.use(userAgentParser());

// Create preload page and api services.
createServer(server);

// Create the page services.
server.get('*', (req, res) => {
  const renderPage = req.url === '/' ? configs.initPage : req.url.substr(1, Math.min(req.url.indexOf('/', 2), req.url.indexOf('?', 2)));
  if (Object.keys(components.pages).indexOf(renderPage) < 0) {
    res.send(`No page named ${renderPage}!`);
    res.end();
    return;
  }
  const enbaleSPA = configs.enableSPA || false;

  // Get initialize props and state.
  let initState = {
    renderPage,
    renderPageParam: req.query,
    cookies: req.cookies,
    headers: req.headers
  };
  (async () => controllers[renderPage].preload ?
    (await controllers[renderPage].preload(context, req.cookies, req.query)) :
    {})().then(preloadPageData => {
      initState = {
        ...initState,
        preloadPageData
      };
      let components = {
        page: <Provider store={initState}>{React.createElement(pages[renderPage], { key: renderPage, pageData: preloadPageData })}</Provider>,
        views: <Provider store={initState}>{Object.keys(views).map((n, key) => n === 'border' ? null : React.createElement(views[n], { key }))}</Provider>
      };
      (async () => controllers.global.preload ?
        (await controllers.global.preload(context, req.cookies, req.query, componens))
        : {})().then(preloadGlobalData => {
          initState = {
            ...initState,
            preloadGlobalData
          };
          // Send the data.
          res.send(
            `<!DOCTYPE html>
<html lang=${configs.language || 'en'}>
<head>
  <meta charSet='utf-8' />
  <meta
    name='viewport'
    content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no'
  />
  <style>{
    body{
      margin: 0px;
      padding: 0px;
    }
  }</style>
  <link
    rel='stylesheet'
    href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
  />
  <title>${
            typeof configs.title === 'string' ?
              configs.title :
              (typeof configs.title[renderPage] === 'string' ?
                configs.title[renderPage] :
                configs.title[renderPage](renderPage))
            }</title>
  <link rel='icon' href=${configs.icon} />
</head>
<body>
  <noscript>
    You need to enable JavaScript to run this app.
    您需要启用 JavaScript 才能运行该应用。
  </noscript>
  ${enbaleSPA ? `<script src="./spa.js" />` : ''}
  <div id="nicklecat-page">${ReactDomServer.renderToString(components.page)}</div>
  <div id="nicklecat-views">${ReactDomServer.renderToString(components.views)}</div>
  <div id="nickelcat-models"></div>
  <script id="nickelcat-ssr-preload">
    window.__initState = JSON.parse(${JSON.stringify(initState)});
    (${jsx})()
  </script>
</body>
</html>
`);
        })
    });
});

server.listen(port, () => {
  console.log(`> Ready on http://localhost:${port}`)
});
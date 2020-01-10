// At the server side, it must remove the css files' reference.
// Otherwise, the function 'renderToString' will throw the error.
require('css-modules-require-hook/preset')({
  generateScopedName: '[name]__[local]__[hash:base64:5]',
  extensions: ['.scss', '.sass', '.less']
});
// It also must remove the assets files' reference.
require('asset-require-hook')({
  extensions: ['.png', '.apng', '.jpg', '.jpeg', '.gif', '.ico']
});

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

import { exec } from 'child_process';

const port = parseInt(process.env.PORT, 10) || 80;
const dev = process.env.NODE_ENV !== 'production';

import services from './services';

import { workDirPath, packages, context } from '../utils/require';

exec(`babel-node ${resolve('packagerSSR.js')}`, (err, stdout, stderr) => {
  if (err) console.error('[SSR packager] ERR', err);
  if (stdout) console.log('[SSR packager]', stdout);
  if (stderr) console.error('[SSR packager]', stderr);
});
exec(`babel-node ${resolve('packagerSPA.js')}`, (err, stdout, stderr) => {
  if (err) console.error('[SPA packager] ERR', err);
  if (stdout) console.log('[SPA packager]', stdout);
  if (stderr) console.error('[SPA packager]', stderr);
});

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

server.use(bodyParserJsonify());
server.use(cookieParser());
server.use(userAgentParser());

// services(server);

server.get('*', (req, res) => {
  const renderPage = req.url === '/' ? packages.configs.initPage : req.url.substr(1, Math.min(req.url.indexOf('/', 2), req.url.indexOf('?', 2)));
  if (Object.keys(components.pages).indexOf(renderPage) < 0) {
    res.send(`No page named ${renderPage}!`);
    res.end();
    return;
  }
  const enbaleSPA = packages.configs.enableSPA || false;

  // Get initialize props and state.
  let initState = {
    renderPage,
    renderPageParam: req.query,
    cookies: req.cookies,
    headers: req.headers
  };
  // 这里的 pages, views, models 均尚未 import
  (async () => packages.controllers[renderPage].preload ?
    (await packages.controllers[renderPage].preload(context, req.cookies, req.query)) :
    {})().then(preloadPageData => {
      initState = {
        ...initState,
        preloadPageData
      };
      let components = {
        page: <Provider store={initState}>{React.createElement(pages[renderPage], { key: renderPage, pageData: preloadPageData })}</Provider>,
        views: <Provider store={initState}>{Object.keys(views).map((n, key) => n === 'border' ? null : React.createElement(views[n], { key }))}</Provider>
      };
      (async () => packages.controllers.global.preload ?
        (await packages.controllers.global.preload(context, req.cookies, req.query, componens))
        : {})().then(preloadGlobalData => {
          initState = {
            ...initState,
            preloadGlobalData
          };
          // Send the data.
          res.send(
            `<!DOCTYPE html>
<html lang=${packages.configs.language || 'en'}>
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
            typeof packages.configs.title === 'string' ?
              packages.configs.title :
              (typeof packages.configs.title[renderPage] === 'string' ?
                packages.configs.title[renderPage] :
                packages.configs.title[renderPage](renderPage))
            }</title>
  <link rel='icon' href=${packages.configs.icon} />
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
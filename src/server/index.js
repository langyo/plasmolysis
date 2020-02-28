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

import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { resolve } from 'path';

const port = parseInt(process.env.PORT, 10) || 80;
const dev = process.env.NODE_ENV !== 'production';

import workDirPath from '../utils/workDirPath';
import { createServer, getContext } from './services';
import { requirePackage, getPackages } from './watcher';
import getInitializeData from './initializer';

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
  const renderPage = req.url === '/' ? requirePackage(`configs`).initPage : req.url.substr(1, Math.min(req.url.indexOf('/', 2), req.url.indexOf('?', 2)));
  if (Object.keys(getPackages().components.pages).indexOf(renderPage) < 0) {
    // TODO 404 page(pages.error, or set by profile)
    res.send(`404 No page named ${renderPage}!`);
    res.end();
    return;
  }

  // Get preload data and initialize state.
  const pagePreloader = requirePackage(`controllers.pages.${renderPage}`).preload || () => ({});
  const globalPreloader = getPackages().components.global ? requirePackage(`controllers.global`).preload : () => ({});
  const initState = getInitializeData();
  const context = getContext();
  const cookies = req.cookies;
  const params = req.query;
  const headers = req.headers;

  let pagePreload = pagePreloader(context, cookies, params);
  let pageInitState = initState.pages[renderPage]
    ? (typeof initState.pages[renderPage] === 'function'
      ? initState.pages[renderPage](pagePreload)
      : initState.pages[renderPage])
    : pagePreload;
  let globalPreload = globalPreloader(context, cookies, params, {});

  let state = {
    pages: {
      [renderPage]: pageInitState
    },
    views: initState.views,
    data: {
      ...initState.data,
      cookies,
      params,
      headers,
      globalPreload: globalPreload.payload
    },
    renderPage
  };

  // Render the page.
  res.send(`<!DOCTYPE html>
<html lang=${requirePackage(`configs`).language || 'en'}>
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
  ${globalPreload.extraHeadStr || ''}
  <title>${
    typeof requirePackage(`configs`).title === 'string' ?
      requirePackage(`configs`).title :
      (typeof requirePackage(`configs`).title[renderPage] === 'string' ?
        requirePackage(`configs`).title[renderPage] :
        requirePackage(`configs`).title[renderPage](renderPage))
    }</title>
  ${requirePackage(`configs`).icon ? `<link rel='icon' href=${requirePackage(`configs`).icon} />` : ''}
</head>
<body>
  <noscript>
    You need to enable JavaScript to run this app.
    您需要启用 JavaScript 才能运行该应用。
  </noscript>
  <script>window.__APP_STATE__ = JSON.parse(${JSON.stringify({
      pages: {
        [renderPage]: pageInitState
      },
      views: initState.views,
      data: {
        ...initState.data,
        ...globalPreload.payload,
        cookies,
        params,
        headers,
        globalPreload: globalPreload.payload
      },
      renderPage
    })});</script>
  ${globalPreload.extraBodyStr || ''}
  <div id="nickelcat-root">
${renderToString(createElement(requirePackage(`components.pages.${renderPage}`), {
        // ...state.pages[renderPage],
        // ...state.data
}))}
  </div>
</body>
</html>`);
});

server.listen(port, () => {
  console.log(`Ready on http://localhost:${port}`)
});

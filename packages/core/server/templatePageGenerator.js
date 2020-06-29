import React, { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import nodeRender from './serverNodeRender';

import { serverLog as log } from '../utils/logger';
import chalk from 'chalk';

const defaultMetaData = [{
  name: "viewport",
  id: "viewport",
  content: "width=device-width, initial-scale=1"
}];

export default (pageType, actionManager) => async ({
  ip, path, query, host, charset, protocol, type, cookies
}, {
  staticClientPath,
  pageTitle,
  allowMobileConsole = true,
  rootGuide: {
    modelManager,
    initState,
    headProcessor = nodes => ({
      renderCSS: {},
      renderHTML: Object.keys(nodes)
        .map(id => `<div id="${id}">${renderToString(nodes[id])}</div>`)
        .join(''),
      renderMeta: defaultMetaData
    }),
    targetElementID = 'nickelcat-root'
  }
}) => {
  try {
    // Initialize the data.
    const { payload: payloadRetModelState = {}, globalState: payloadRetGlobalState = {} } = await modelManager.getPreloader(pageType)({
      ip, path, query, host, charset, protocol, type, cookies
    });
    const renderState = {
      pageType,
      globalState: {
        ...initState,
        ...payloadRetGlobalState
      },
      pagePreloadState: modelManager.getInitializer(pageType)(payloadRetModelState)
    };
    const nodes = nodeRender({
      actionManager,
      modelManager,
      ...renderState,
      targetElementID
    });
    const { renderCSS, renderHTML, renderMeta } = (result => ({
      renderCSS: {},
      renderHTML: {},
      renderMeta: defaultMetaData,
      ...result
    }))(headProcessor(nodes));

    const body = `
<html>
<head>
<title>
    ${
      typeof pageTitle === 'string' && pageTitle ||
      typeof pageTitle === 'object' && (
        pageTitle[pageType] || ''
      )
      }
</title>
<style>
body {
padding: 0px;
margin: 0px;
}
</style>
    ${
      renderMeta.map(obj =>
        Object.keys(obj)
          .map(key => `${key}="${obj[key]}"`)
          .join(' ')
      ).reduce((str, next) => `${str}
<meta ${next} />`, '')
      }
    ${
      Object.keys(renderCSS)
        .map(id => `<style id="${id}">${renderCSS[id]}</style>`)
        .join('')
      }
<head>
<body>
<div id="nickelcat-root">
${renderHTML}
</div>
<script id="__NICKELCAT_INIT_STATE__">
window.__NICKELCAT_INIT__ = (${JSON.stringify(renderState)});
window.__NICKELCAT_SSR_CSS__ = (${JSON.stringify(Object.keys(renderCSS))});
document.getElementById("__NICKELCAT_INIT_STATE__").parentElement.removeChild(document.getElementById("__NICKELCAT_INIT_STATE__"));
</script>
<script src=${staticClientPath}></script>
${allowMobileConsole && `<script id="__NICKELCAT_MOBILE_DEBUG_FLAG__">
;(function () {
var src = '//cdn.jsdelivr.net/npm/eruda';
if (!/mobile_dev=true/.test(window.location)) return;
document.write('<scr' + 'ipt src="' + src + '"></scr' + 'ipt>');
document.write('<scr' + 'ipt>eruda.init();</scr' + 'ipt>');
document.getElementById('__NICKELCAT_MOBILE_DEBUG_FLAG__').parentElement.removeChild(document.getElementById('__NICKELCAT_MOBILE_DEBUG_FLAG__'));
})();
</script>` || ''}
</body>
</html>`;
    return { type: 'text/html', statusCode: 200, body };
  } catch (e) {
    log('error', chalk.redBright('Page preload crash'), chalk.yellow(pageType), e);
    return {
      type: 'text/html', statusCode: 503, body: `
<html>
<head>
    <title>RUNTIME ERROR</title>
</head>
<body>
<h2>Oops!</h2>
<p>${e.message}</p>
<p>The most likely cause of the error is the invalid parameters passed, or the problem with the server design.</p>
<p>The server has logged the error. We apologize for the inconvenience. :P</p>
</body>
</html>
    `};
  }
};